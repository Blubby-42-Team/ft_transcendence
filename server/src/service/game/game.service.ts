/*
	Service for managing game lobbys and game rooms
 */

import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Server } from 'socket.io';
import { LobbyInstance } from '../../model/game/game.class';
import { EmitGateway } from './emit.gateway';
import { AuthService } from 'src/auth/auth.service';
import { JoinGameRoomRequestDto } from '@shared/dto/ws.dto';
import { User } from 'src/model/user/user.class';
import { ModelUserModule } from '../../model/user/user.module';
import { ModelUserService } from 'src/model/user/user.service';
import { log } from 'console';

@Injectable()
export class GameService {

	constructor (
		private readonly emitGAteway: EmitGateway,
		private readonly authService: AuthService,
		private readonly modelUserService: ModelUserService,
	) {}

	private readonly logger = new Logger(GameService.name);

	private lobbys: {
		[key: string]: LobbyInstance;
	} = {};

	private users: {
		[key: number]: {
			room_id: string,
		}
	} = {};

	async gameStateManager() {
		this.logger.debug('gameStateManager');
		// TODO
	}

	async createLobby(userId: number): Promise<string> {

		return await this.getLobbyByUserId(userId)
		.then((lobby) => {
			if (lobby !== undefined) {
				this.logger.debug(`User ${userId} allready own the lobby ${lobby.room_id}`);
				throw new BadRequestException(`User ${userId} allready own the lobby ${lobby.room_id}`);
			}
			this.logger.error(`getLobbyByUserId return undefined?!`);
			throw new BadGatewayException(`Create lobby failed!`);
		})
		.catch((err) => {

			if ((err instanceof NotFoundException) === false) {
				throw err;
			}

			this.logger.debug(`User ${userId} does not own a lobby, create one`);

			const newRoomId = this.generateUniqueRoomId(6);

			const newLobby = new LobbyInstance(newRoomId, userId, this.gameStateManager);
			this.lobbys[newRoomId] = newLobby;

			this.users[userId] = {
				room_id: newRoomId,
			};

			return newRoomId;
		});

	}

	async deleteLobby(roomId: string, userId: number) {
		this.logger.debug(`try deleteLobby ${roomId}`);
		if (this.lobbys[roomId] === undefined) {
			this.logger.debug('Room does not exist');
			throw new NotFoundException('Room does not exist');
		}
		delete this.lobbys[roomId];
		this.logger.debug(`deleteLobby ${roomId}`);
	}

	// async startGame(roomName: string, opt: GameOptDto, io: Server) {
	// }

	async stopGame(roomName: string) {
		this.logger.debug(`stopGame ${roomName}`);
		// emit to all players
		// disconnect all players
	}

	async addPlayerToWhiteList(roomId: string, userId: number) {
		const lobby = this.getLobby(roomId);

		// check if the user is the owner of the lobby
		if (lobby.owner_id !== userId) {
			this.logger.debug(`User ${userId} is not the owner of lobby ${roomId}`);
			throw new BadRequestException(`User ${userId} is not the owner of lobby ${roomId}`);
		}

		lobby.addPlayerToWhiteList(userId)
	}

	async removePlayerFromWhiteList(roomId: string, userId: number) {
		const lobby = this.getLobby(roomId);

		// check if the user is the owner of the lobby
		if (lobby.owner_id !== userId) {
			this.logger.debug(`User ${userId} is not the owner of lobby ${roomId}`);
			throw new BadRequestException(`User ${userId} is not the owner of lobby ${roomId}`);
		}

		lobby.removePlayerFromWhiteList(userId)
	}

	async addPlayerToLobby(roomId: string, userId: number) {
		this.logger.debug(`addPlayerToLobby ${roomId} ${userId}`);
		const lobby = this.getLobby(roomId);
		lobby.addPlayerToLobby(userId);
		this.users[userId] = {
			room_id: roomId,
		};
		this.logger.debug(`addUserToLobby ${roomId} ${userId}`);

	}

	async removePlayerFromLobby(roomId: string, userId: number): Promise<void> {
	}
	
	
	async reconnectPlayerToRoom(userId: number) {
	}

	/**
	 * 
	 * @param roomId 
	 * @returns return the lobby instance
	 * @throws NotFoundException if the lobby does not exist
	 */
	getLobby(roomId: string): LobbyInstance {
		const lobby = this.lobbys[roomId];
		if (lobby === undefined) {
			throw new NotFoundException(`Lobby ${roomId} does not exist`);
		}
		return lobby;
	}

	/**
	 * try to find in which lobby the user is
	 * @param userId user id
	 * @returns return the lobby instance
	 * @throws NotFoundException if the user is not in a lobby
	 */
	async getLobbyByUserId(userId: number): Promise<LobbyInstance> {
		
		// I use a user map that make the link between the user and the lobby
		const user = this.users[userId];
		if (user === undefined) {
			this.logger.debug(`User ${userId} does not exist`);
			throw new NotFoundException(`User ${userId} does not exist`);
		}

		return this.lobbys[user.room_id];
	}

	/**
	 * Generate a random id
	 * @param length Length of the id
	 * @returns Random id
	 */
	private generateId(length): string {
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

	/**
	 * 
	 * @returns return all lobbys public data
	 */
	async getAllLobbysPublicData() {
		if (this.lobbys === undefined) {
			return [];
		}

		if (Object.keys(this.lobbys).length === 0) {
			return [];
		}

		const lobbysPublicData = [];
		for (const lobbyId in this.lobbys) {
			if (this.lobbys[lobbyId] === undefined) {
				continue;
			}
			const lobbyPublicData = this.lobbys[lobbyId].getPublicData();
			lobbysPublicData.push(lobbyPublicData);
		}
		return lobbysPublicData;
	}

	/**
	 * Generate a unique room id
	 * @param length Length of the room id
	 * @returns Unique room id
	 * @throws Error if we can't generate unique room id after X tries
	 */
	private generateUniqueRoomId(length) {
		let roomId = '';
		let counter = 0;

		do {
			// throw error if we can't generate unique room id after X tries
			if (counter > 99) {
				throw new BadGatewayException(`Could not generate unique room id after ${counter} tries`);
			}
			roomId = this.generateId(length);
			counter += 1;
		} while (this.lobbys[roomId] !== undefined);

		return roomId;
	}
}