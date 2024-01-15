import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, UnauthorizedException, forwardRef } from '@nestjs/common';
import { gameSettingsType } from '@shared/types/game/game';
import { GameEngine } from '@shared/game/game';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';
import { BotDifficulty } from '@shared/types/game/game';
import { OutGameGateway } from './socket/out.gateway';
import { ELobbyStatus } from '@shared/types/game/socket';
import { IdManagerService } from './idManager.service';
import { Direction } from '@shared/types/game/utils';
import { ModelHistoryService } from 'src/model/history/history.service';
import { HistoryService } from 'src/controller/history/history.service';

const defaultSettings: gameSettingsType = {
	maxPoint:			5,
	numPlayer:			2,
	ballSize:			1,
	padSize:			5,
	mode:				BotDifficulty.NORMAL,
	randomizer:			false,
	initialBallSpeed:	0.5,
	speedAcceleration:	0.1,
};
	
@Injectable()
export class GameService implements OnModuleInit, OnModuleDestroy {
	constructor(
		private readonly io: OutGameGateway,
		private readonly idManager: IdManagerService,
    	// private readonly historyServide: HistoryService,
	) { }

	private readonly logger = new Logger(GameService.name);
	private continueMatchmaking: boolean = true;

	private matchmakingList: Array<number> = [];

	private rooms: Map<
		// RoomId
		string,

		// Players id
		{
			whiteList: Array<number>,
			players: Array<{
				id: number,
				ready: boolean,
			}>
			instance: GameEngine,
		}
	> = new Map();




	onModuleInit(){
		this.matchmakingLoop();
	}

	onModuleDestroy(){
		this.continueMatchmaking = false;
	}

	getNewRoomId(): UUID{
		return uuidv4();
	}

	async matchmakingLoop(){
		if (!this.continueMatchmaking){
			return;
		}
		if ((this.matchmakingList?.length ?? 0) < 2){
			this.matchmakingList.forEach(userId => {
				this.io.emitToPlayer(this.idManager.getUserPrimarySocket(userId), ELobbyStatus.InQueue, {
					msg: 'Waiting for players',
				})
			});
		}
		else {
			const player1 = this.matchmakingList.shift();
			const player2 = this.matchmakingList.shift();

			const roomId = this.getNewRoomId();

			// add to user 1 and 2 disconnect function
			const player1DisconnectLobby = () => {
				this.endMatch(roomId, null, "Player has disconnected");
			}
			const player2DisconnectLobby = () => {
				this.endMatch(roomId, null, "Player has disconnected");
			}

			this.rooms.set(roomId, {
				whiteList: [],
				players: [
					{ id: player1, ready: false },
					{ id: player2, ready: false },
				],
				instance: new GameEngine(defaultSettings,
					// on game tick
					(state) => {
						this.io.emitGameState(roomId, state);
					},
					undefined,
					// on game end
					async (scores) => {
						this.endMatch(roomId, scores, "Game has finished");
					}
				)
			});
			
			await this.idManager.subscribePrimaryUserToRoom(player1, roomId).catch(() => this.surrenderMatch(player1));
			await this.idManager.subscribePrimaryUserToRoom(player2, roomId).catch(() => this.surrenderMatch(player2));

			await this.idManager.setOnDisconnectCallback(player1, () => this.surrenderMatch(player1)).catch(() => this.surrenderMatch(player1));
			await this.idManager.setOnDisconnectCallback(player2, () => this.surrenderMatch(player2)).catch(() => this.surrenderMatch(player2));

			this.lobbyLoop(roomId);
		}
		
		this.logger.verbose(JSON.stringify(this))
		setTimeout(() => this.matchmakingLoop(), 1000);
	}

	async lobbyLoop(roomId: string){
		const room = this.rooms.get(roomId);
		if (!room){
			return;
		}

		
		// Lobby is not full
		if (room.players.length < 2){
			this.io.emitToRoom(roomId, ELobbyStatus.WaitingForPlayers, {
				msg: 'Waiting for players to join',
				players: room.players.map(({ id }) => id),
			});
			setTimeout(() => this.lobbyLoop(roomId), 1000);
		}
		
		// If everyone is not ready
		else if (!room.players.every(({ ready }) => ready)){
			this.io.emitToRoom(roomId, ELobbyStatus.WaitingForPlayers, {
				msg: 'Waiting for players to be ready',
				players: room.players.map(({ id }) => id),
			});

			// continue loop
			setTimeout(() => this.lobbyLoop(roomId), 1000);
		}

		// If everyone is ready
		else {
			const player1 = room.players[0].id;
			const player2 = room.players[1].id;

			await this.idManager.setOnDisconnectCallback(player1, () => this.surrenderMatch(player1)).catch(() => this.surrenderMatch(player1));
			await this.idManager.setOnDisconnectCallback(player2, () => this.surrenderMatch(player2)).catch(() => this.surrenderMatch(player2));
			

			this.io.emitToRoom(roomId, ELobbyStatus.AllPlayersReady, {
				msg: 'All players ready',
			});
			room.instance.start();
		}
	}

	getRoomId(userId: number){
		for (const [roomId, { players }] of this.rooms.entries()){
			if (players.some(({ id }) => id === userId)){
				return roomId;
			}
		}
		return null;
	}

	isReady(userId: number){
		if (!this.getRoomId(userId)){
			throw new UnauthorizedException(`User ${userId} is not in a room`);
		}
		const roomId = this.getRoomId(userId);
		this.logger.verbose(`isReady ${userId} ${roomId}`)
		this.rooms.get(roomId).players.find(({ id }) => id === userId).ready = true;
	}





	joinMatchmaking(userId: number){
		if (this.matchmakingList.includes(userId)){
			throw new UnauthorizedException(`User ${userId} is already in matchmaking`);
		}
		if (this.getRoomId(userId)){
			throw new UnauthorizedException(`User ${userId} is already in a room`);
		}
		this.matchmakingList.push(userId);
	}

	leaveMatchmaking(userId: number){
		if (!this.matchmakingList.includes(userId)){
			throw new UnauthorizedException(`User ${userId} is not in matchmaking`);
		}
		if (this.getRoomId(userId)){
			throw new UnauthorizedException(`User ${userId} is already in a room`);
		}
		this.matchmakingList = this.matchmakingList.filter(id => id !== userId);
	}







	createPrivateParty(
		userId: number,
		settings: Partial<gameSettingsType>,
	){
		const newSettings: gameSettingsType = JSON.parse(JSON.stringify(defaultSettings));
		newSettings.maxPoint = settings.maxPoint ?? newSettings.maxPoint;
		newSettings.ballSize = settings.ballSize ?? newSettings.ballSize;
		newSettings.padSize = settings.padSize ?? newSettings.padSize;

		if (this.getRoomId(userId)){
			throw new UnauthorizedException(`User ${userId} is already in a room`);
		}

		const roomId = this.getNewRoomId();
		this.rooms.set(roomId, {
			whiteList: [userId],
			players: [],
			instance: new GameEngine(newSettings,
				// on game tick
				(state) => {
					this.io.emitGameState(roomId, state);
				},
				undefined,
				// on game end
				async (scores) => {
					await this.endMatch(roomId, scores, "Game has finished");
				}
			)
		});
		this.lobbyLoop(roomId);
		return roomId;
	}

	joinPrivateParty(partyId: string, userId: number){
		const room = this.rooms.get(partyId);
		if (!room){
			throw new UnauthorizedException(`Party ${partyId} does not exist`);
		}

		if (room.players.some(({ id }) => id === userId)){
			throw new UnauthorizedException(`User ${userId} is already in party ${partyId}`);
		}

		if (!room.whiteList.includes(userId)){
			throw new UnauthorizedException(`User ${userId} is not invited to the party ${partyId}`);
		}

		if (room.players.length >= 2){
			throw new UnauthorizedException(`Party ${partyId} is full`);
		}

		room.players.push({
			id: userId,
			ready: false,
		});
		room.whiteList = room.whiteList.filter(id => id !== userId);
	}

	inviteToPrivateParty(partyId: string, userId: number){
		const room = this.rooms.get(partyId);
		if (!room){
			throw new UnauthorizedException(`Party ${partyId} does not exist`);
		}

		if (room.players.some(({ id }) => id === userId)){
			throw new UnauthorizedException(`User ${userId} is already in party ${partyId}`);
		}
		
		if (room.whiteList.includes(userId)){
			throw new UnauthorizedException(`User ${userId} is already invited to the party ${partyId}`);
		}

		room.whiteList.push(userId);
	}






	move(userId: number, direction: boolean, press: boolean){
		const roomId = this.getRoomId(userId);
		if (!roomId){
			return ;
		}
		const room = this.rooms.get(roomId);
		if (room.players?.[0]?.id ?? 0 === userId){
			room.instance.move(Direction.LEFT, direction, press);
		}
		else if (room.players?.[1]?.id ?? 0 === userId){
			room.instance.move(Direction.RIGHT, direction, press);
		}
	}

	startRound(userId: number, press: boolean){
		const roomId = this.getRoomId(userId);
		if (!roomId){
			return ;
		}
		const room = this.rooms.get(roomId);
		room.instance.startRound(press);
	}

	async surrenderMatch(userId: number){
		const roomId = this.getRoomId(userId);
		if (!roomId){
			return ;
		}
		const room = this.rooms.get(roomId);
		for (let i = 0; i < room.players.length; i++) {
			if (room.players[i].id !== userId){
				const scores = room.instance.getScores();
				scores[i] = 10;
				this.endMatch(roomId, scores, "Player has surrendered");
				return ;
			}
		}
		await this.endMatch(roomId, null, "Player has surrendered");
	}

	async endMatch(roomId: string, scores: number[] | null, message: string){
		const room = this.rooms.get(roomId);
		room.instance.stop();

		console.log(scores)

		// TODO add match history to user 1 and 2
		// if (scores !== null){
		// 	await this.historyServide.addHistoryByUserId(
		// 		player1,
		// 		player2,
		// 		EGameType.Classic,
		// 		scores[0],
		// 		scores[1],
		// 		0,
		// 	);
		// }

		this.io.emitToRoom(roomId, ELobbyStatus.LobbyEnded, {
			msg: message
		})
		
		await this.idManager.unsetOnDisconnectCallback(room.players[0].id).catch(() => {});
		await this.idManager.unsetOnDisconnectCallback(room.players[1].id).catch(() => {});
		await this.idManager.unsubscribePrimaryUserToRoom(room.players[0].id, roomId).catch(() => {});
		await this.idManager.unsubscribePrimaryUserToRoom(room.players[1].id, roomId).catch(() => {});
		await this.idManager.resetUserPrimarySocket(room.players[0].id).catch(() => {});
		await this.idManager.resetUserPrimarySocket(room.players[1].id).catch(() => {});
		this.rooms.delete(roomId);
	}

	async leaveMatch(userId: number){
		const room = this.getRoomId(userId);
		if (!room){
			throw new UnauthorizedException(`User ${userId} is not in a room`);
		}
		await this.idManager.unsetOnDisconnectCallback(userId).catch(() => {});
		await this.idManager.unsubscribePrimaryUserToRoom(userId, room).catch(() => {});
		await this.idManager.resetUserPrimarySocket(userId).catch(() => {});
		return this.endMatch(room, null, "Player has left the game");
	}



	toJSON(){
		return {
			rooms: [...this.rooms.entries()].map(([roomId, { players, whiteList }]) => ({ roomId, players, whiteList })),
			matchmaking: this.matchmakingList,
		}
	}
}