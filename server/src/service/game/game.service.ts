import { Injectable, Logger, OnModuleDestroy, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { gameSettingsType } from '@shared/types/game/game';
import { GameEngine } from '@shared/game/game';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';
import { BotDifficulty } from '@shared/types/game/game';
import { OutGameGateway } from './socket/out.gateway';
import { ELobbyStatus } from '@shared/dto/ws.dto';
import { IdManagerService } from './idManager.service';
import { Direction } from '@shared/types/game/utils';

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
	) { }

	private readonly logger = new Logger(GameService.name);
	private continueMatchmaking: boolean = true;
	private matchmakingList: Array<number> = [];
	private party: Map<
		// RoomId
		string,

		// Players id
		{
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
		if ((this.matchmakingList?.length ?? 0) >= 2){
			const player1 = this.matchmakingList.shift();
			const player2 = this.matchmakingList.shift();

			const roomId = this.getNewRoomId();

			// add to user 1 and 2 disconnect function
			const player1DisconnectLobby = () => {
				// send error message to player 2
				this.party.delete(roomId);
			}
			const player2DisconnectLobby = () => {
				// send error message to player 1
				this.party.delete(roomId);
			}

			this.party.set(roomId, {
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
						this.party.get(roomId).instance.stop();
						this.party.delete(roomId);
						// send victory message to player 1
						// add match history to user 1 and 2
						this.io.emitToRoom(roomId, ELobbyStatus.LobbyEnded, {
							msg: "Game has finished"
						})
						await this.idManager.unsetOnDisconnectCallback(player1).catch(() => {});
						await this.idManager.unsetOnDisconnectCallback(player2).catch(() => {});
						await this.idManager.unsubscribePrimaryUserToRoom(player1, roomId).catch(() => {});
						await this.idManager.unsubscribePrimaryUserToRoom(player2, roomId).catch(() => {});
					}
				)
			});
			
			await this.idManager.subscribePrimaryUserToRoom(player1, roomId)
				.catch(player1DisconnectLobby);
			await this.idManager.subscribePrimaryUserToRoom(player2, roomId)
				.catch(player2DisconnectLobby);

			await this.idManager.setOnDisconnectCallback(player1, player1DisconnectLobby)
				.catch(player1DisconnectLobby);
			await this.idManager.setOnDisconnectCallback(player2, player2DisconnectLobby)
				.catch(player2DisconnectLobby);

			this.lobbyLoop(roomId);
		}
		this.logger.verbose(JSON.stringify(this.toJSON()))
		setTimeout(() => this.matchmakingLoop(), 1000);
	}

	async lobbyLoop(roomId: string){
		const party = this.party.get(roomId);
		if (!party){
			return;
		}

		const player1 = party.players[0].id;
		const player2 = party.players[1].id;
		
		// If everyone is not ready
		if (!party.players.every(({ ready }) => ready)){
			this.io.emitToRoom(roomId, ELobbyStatus.WaitingForPlayers, {
				msg: 'Waiting for players',
				players: party.players.map(({ id }) => id),
			});

			// continue loop
			setTimeout(() => this.lobbyLoop(roomId), 1000);
		}

		// If everyone is ready
		else {
			const player1DisconnectGame = async () => {
				party.instance.stop();
				// send error message to player 2
				// add match history to user 1 and 2
				this.io.emitToRoom(roomId, ELobbyStatus.LobbyEnded, {
					msg: "The other player has disconnected"
				})
				await this.idManager.unsetOnDisconnectCallback(player2).catch(() => {});
				await this.idManager.unsubscribePrimaryUserToRoom(player2, roomId).catch(() => {});
				this.party.delete(roomId);
			};
			const player2DisconnectGame = async () => {
				party.instance.stop();
				// send error message to player 1
				// add match history to user 1 and 2
				this.io.emitToRoom(roomId, ELobbyStatus.LobbyEnded, {
					msg: "The other player has disconnected"
				})
				await this.idManager.unsetOnDisconnectCallback(player2).catch(() => {});
				await this.idManager.unsubscribePrimaryUserToRoom(player2, roomId).catch(() => {});
				this.party.delete(roomId);
			};

			await this.idManager.setOnDisconnectCallback(player1, player1DisconnectGame)
				.catch(player1DisconnectGame);
			await this.idManager.setOnDisconnectCallback(player2, player2DisconnectGame)
				.catch(player2DisconnectGame);
			

			this.io.emitToRoom(roomId, ELobbyStatus.AllPlayersReady, {
				msg: 'All players ready',
			});
			party.instance.start();
		}
	}

	getRoomId(userId: number){
		for (const [roomId, { players }] of this.party.entries()){
			if (players.some(({ id }) => id === userId)){
				return roomId;
			}
		}
		return null
		
	}

	isReady(userId: number){
		if (!this.getRoomId(userId)){
			throw new UnauthorizedException(`User ${userId} is not in a room`);
		}
		const roomId = this.getRoomId(userId);
		this.logger.verbose(`isReady ${userId} ${roomId}`)
		this.party.get(roomId).players.find(({ id }) => id === userId).ready = true;
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






	createPrivateParty(userId: number, settings: gameSettingsType){

	}

	joinPrivateParty(partyId: string, userId: number){
		// Check if party is full
		// If not add him
	}

	inviteToPrivateParty(partyId: string, userId: number){

	}






	move(userId: number, direction: boolean, press: boolean){
		const roomId = this.getRoomId(userId);
		if (!roomId){
			return ;
		}
		const room = this.party.get(roomId);
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
		const room = this.party.get(roomId);
		room.instance.startRound(press);
	}





	toJSON(){
		return {
			rooms: [...this.party.entries()].map(([roomId, { players }]) => ({ roomId, players })),
			matchmaking: this.matchmakingList,
		}
	}
}