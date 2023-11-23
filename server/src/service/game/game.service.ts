import { Injectable, Logger } from '@nestjs/common';
import { GameOptDto } from '@shared/dto/game.dto';
import { Server } from 'socket.io';
import { LobbyInstance } from '../../model/game/game.class';
import { EmitGateway } from './emit.gateway';

@Injectable()
export class GameService {

	constructor (
		private readonly emitGAteway: EmitGateway,
	) {}

	private readonly logger = new Logger(GameService.name);

	private lobbys: {
		[key: string]: LobbyInstance;
	} = {};

	private users: {
		[key: number]: {
			lobby: string,
			room_id: string,
			// isConnected: boolean,
		}
	} = {};

	/**
	 * //TODO :
	 *          - [ ] owner_id
	 *          - [ ] room_id
	 */
	async createLobby(userId: number) {
		//TODO generate unique 
		const id = this.generateUniqueRoomId(5);

		//TODO create default game settings

	}

	async deleteLobby(roomId: string) {
		if (this.lobbys[roomId] === undefined) {
			return;//TODO throw error
		}

		this.lobbys[roomId].closeLobby();
		delete this.lobbys[roomId];
	}

	/**
	 * //TODO :
	 *         - [ ] game_id
	 * 
	 */
	async startGame(roomName: string, opt: GameOptDto, io: Server) {
	}

	async stopGame(roomName: string) {
	}

	async addPlayerToWhiteList(roomId: string, userId: number) {
	}

	async addPlayerToLobby(roomId: string, userId: number) {
		//TODO check if user is already in a lobby by checking users map
		if (this.users[userId] !== undefined) {
			return;//TODO throw error
		}
		
		//TODO check if user is in the lobby whitelist
		if (!this.lobbys[roomId].isInWhiteList(userId)) {
			return;//TODO throw error
		}
		//TODO check if lobby is full

		//TODO add user to lobby and connect him to the WS room
	}

	async removePlayerFromLobby(roomId: string ,userId: number): Promise<void> {
		if (this.lobbys[roomId] === undefined) {
			return;//TODO throw error
		}

		if (this.users[userId] === undefined) {
			return;//TODO throw error
		};

		/**
		 * If the user is the owner of the lobby, delete the lobby
		 */
		if (this.lobbys[roomId].getOwnerID() === userId) {
			this.deleteLobby(roomId);
			return;
		}

		//TODO remove user from lobby and disconnect him from the WS room
		this.lobbys[roomId].removePlayerFromLobby(userId);
		//TODO update users map
		delete this.users[userId];
	}
	
	
	async reconnectPlayerToRoom(userId: number) {
	}

	test(){
		this.logger.log('test');
		this.emitGAteway.server.emit('test', 'test');
	}

	private generateUniqueRoomId(length) {
		//TODO check if id is unique in the lobbys map
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
		}
		return result;
	}
}