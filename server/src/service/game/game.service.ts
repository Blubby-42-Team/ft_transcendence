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
import { EGameType } from '@shared/types/history';
import { ModelUserService } from 'src/model/user/user.service';
import { ModelMessagesService } from 'src/model/messages/messages.service';

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
		private readonly userService: ModelUserService,
    	private readonly historyServide: ModelHistoryService,
		private readonly messageService: ModelMessagesService,
	) { }

	private readonly logger = new Logger(GameService.name);
	private continueMatchmaking: boolean = true;

	private matchmakingList: Array<number> = [];

	private rooms: Map<
		// RoomId
		string,

		// Players id
		{
			owner: number,
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

			this.rooms.set(roomId, {
				owner: 0,
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
		
		this.logger.verbose(JSON.stringify(this, null, 2))
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







	async createPrivateParty(
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

		for (const [roomId, { owner }] of this.rooms.entries()){
			if (owner === userId){
				const room = this.rooms.get(roomId);
				for (const { id } of room.players){
					await this.idManager.resetUserPrimarySocket(id).catch(() => {});
					await this.idManager.unsetOnDisconnectCallback(id).catch(() => {});
					await this.idManager.unsubscribePrimaryUserToRoom(id, roomId).catch(() => {});
				}
				this.rooms.delete(roomId);
			}
		}

		const roomId = this.getNewRoomId();
		this.rooms.set(roomId, {
			owner: userId,
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

		const removePlayerIfDisconnectAndDeleteRoomIfEmpty = async () => {
			room.players = room.players.filter(({ id }) => id !== userId);
			if (room.players.length === 0){
				this.rooms.delete(partyId);
			}
		}

		this.idManager.subscribePrimaryUserToRoom(userId, partyId)
			.catch(removePlayerIfDisconnectAndDeleteRoomIfEmpty);
		this.idManager.setOnDisconnectCallback(userId, removePlayerIfDisconnectAndDeleteRoomIfEmpty)
			.catch(removePlayerIfDisconnectAndDeleteRoomIfEmpty);
	}

	async inviteToPrivateParty(invitedId: number, userId: number){
		const partyId = this.getRoomId(userId);
		if (!partyId){
			throw new UnauthorizedException(`User ${userId} is not in a party`);
		}

		const room = this.rooms.get(partyId);
		if (!room){
			throw new UnauthorizedException(`Party ${partyId} does not exist`);
		}

		if (room.players.some(({ id }) => id !== userId)){
			throw new UnauthorizedException(`User ${userId} is not in party ${partyId}`);
		}

		await this.userService.getUserById(invitedId);

		if (room.players.some(({ id }) => id === invitedId)){
			throw new UnauthorizedException(`User ${invitedId} is already in party ${partyId}`);
		}
		
		if (room.whiteList.includes(invitedId)){
			throw new UnauthorizedException(`User ${invitedId} is already invited to the party ${partyId}`);
		}

		room.whiteList.push(invitedId);

		await this.messageService.addInviteToLobby(userId, invitedId, partyId);
	}






	move(userId: number, direction: boolean, press: boolean){
		const roomId = this.getRoomId(userId);
		if (!roomId){
			return ;
		}
		const room = this.rooms.get(roomId);
		const playerPos = (() => {
			switch (userId) {
				case room.players[0].id: return Direction.LEFT;
				case room.players[1].id: return Direction.RIGHT;
				default: return Direction.NONE;
			}
		})()
		room.instance.move(playerPos, direction, press);
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
				scores[i] = room.instance.gameSettings.maxPoint;
				await this.endMatch(roomId, scores, "Player has surrendered");
				return ;
			}
		}
		await this.endMatch(roomId, null, "Player has surrendered");
	}

	async endMatch(roomId: string, scores: number[] | null, message: string | null){
		const room = this.rooms.get(roomId);
		room.instance.stop();

		// TODO add match history to user 1 and 2
		if (scores !== null){
			await this.historyServide.addHistoryByUserId(
				room.players[0].id,
				room.players[1].id,
				EGameType.Classic,
				scores[0],
				scores[1],
			);
		}

		this.io.emitToRoom(roomId, ELobbyStatus.LobbyEnded, {
			msg: message
		});
		
		room.players.forEach(async ({ id }) => {
			await this.idManager.unsubscribePrimaryUserToRoom(id, roomId).catch(() => {});
			await this.idManager.resetUserPrimarySocket(id).catch(() => {});
			await this.idManager.unsetOnDisconnectCallback(id).catch(() => {});
		});
		
		this.rooms.delete(roomId);
	}

	async leaveMatch(userId: number){
		const room = this.getRoomId(userId);
		if (!room){
			throw new UnauthorizedException(`User ${userId} is not in a room`);
		}
		if (this.rooms.get(room).players.length < 2){
			return this.endMatch(room, null, "Player has left");
		}
		return this.surrenderMatch(userId);
	}





	toJSON(){
		return {
			rooms: [...this.rooms.entries()].map(([roomId, { players, whiteList }]) => ({ roomId, players, whiteList })),
			matchmaking: this.matchmakingList,
		}
	}
}