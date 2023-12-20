/*
	Service for managing game lobbys and game rooms
 */

import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LobbyInstance } from '../../model/game/game.class';
import { EmitGateway } from './emit.gateway';
import { AuthService } from 'src/auth/auth.service';
import { ModelUserService } from 'src/model/user/user.service';

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
			connectedClients: Array<string>,
		}
	} = {};

	async gameStateManager() {
		this.logger.debug('gameStateManager');
		// TODO
	}

	/**
	 * Try to create a lobby for the user
	 * @param userId Id of the user
	 * @returns Room id of the lobby
	 * @throws BadGatewayException if we can't create a lobby
	 */
	async createLobby(userId: number): Promise<string> {

		const newRoomId = this.generateUniqueRoomId(6);

		const newLobby = new LobbyInstance(newRoomId, userId, this.gameStateManager);
		this.lobbys[newRoomId] = newLobby;

		this.users[userId] = {
			room_id: newRoomId,
			connectedClients: [],
		};

		return newRoomId;
	}

	/**
	 * Delete a lobby and disconnect all players before
	 * @param roomId Id of the lobby to delete
	 * @throws NotFoundException if the lobby does not exist
	 */
	async disconnectAllPlayerAndDeleteLobby(roomId: string) {

		this.logger.debug(`try deleteLobby ${roomId}`);

		if (this.lobbys[roomId] === undefined) {
			this.logger.debug('Room does not exist');
			throw new NotFoundException('Room does not exist');
		}

		this.lobbys[roomId].closeLobby();//TODO


		// Remove all players from the map
		const players = this.lobbys[roomId].getPlayers();

		for (const player_id of Object.keys(players)) {
			if (this.users[player_id] === undefined) {
				this.logger.error(`User ${player_id} is in the lobby ${roomId} but not in the user map!?`);
				throw new BadGatewayException(`[${roomId}][${player_id}] Failed to delete lobby, see logs or contact an admin`);
			}
			delete this.users[player_id];
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

	async addPlayerToWhiteList(roomId: string, newUserId: number) {
		const lobby = this.getLobby(roomId);

		// check if the user is the owner of the lobby
		if (lobby.owner_id === newUserId) {
			this.logger.debug(`User ${newUserId} is the owner of lobby ${roomId}`);
			throw new BadRequestException(`User ${newUserId} is the owner of lobby ${roomId}`);
		}

		lobby.addPlayerToWhiteList(newUserId)
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

	/**
	 * Add a player to a lobby
	 * @param roomId room id of the lobby
	 * @param userId user id of the player
	 * @returns room id of the lobby
	 * @throws BadRequestException if the user is already in a lobby
	 */
	async addPlayerToLobby(roomId: string, userId: number) {
		this.logger.debug(`try to addPlayerToLobby ${roomId} ${userId}`);

		// check if the user is already in a lobby
		if (this.users[userId] !== undefined) {
			this.logger.debug(`User ${userId} is already in a lobby ${this.users[userId].room_id}`);
			throw new BadRequestException(`User ${userId} is already in a lobby ${this.users[userId].room_id}`);
		}

		const lobby = this.getLobby(roomId);
		lobby.addPlayerToLobby(userId);
		this.users[userId] = {
			room_id: roomId,
			connectedClients: [],
		};
		this.logger.debug(`addUserToLobby ${roomId} ${userId}`);
		return lobby.room_id;

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
	async findUserInLobbys(userId: number): Promise<LobbyInstance> {
		
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

		const playerPublicData = {};
		for (const userId of Object.keys(this.users)) {
			playerPublicData[userId] = this.users[userId].room_id;
		}
		
		return {
			lobbys: lobbysPublicData,
			players: playerPublicData,
		};
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
				this.logger.error(`Could not generate unique room id after ${counter} tries`);
				throw new BadGatewayException(`Could not generate unique room id after ${counter} tries, see logs or contact an admin`);
			}
			roomId = this.generateId(length);
			counter += 1;
		} while (this.lobbys[roomId] !== undefined);

		return roomId;
	}
}