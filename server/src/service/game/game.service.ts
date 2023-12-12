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

@Injectable()
export class GameService {

	constructor (
		private readonly emitGAteway: EmitGateway,
		private readonly authService: AuthService,
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

		if (this.getLobbyByUserId(userId) !== undefined) {
			this.logger.debug('User already in lobby');
			throw new BadRequestException('User already in lobby');
		}

		const newRoomId = this.generateUniqueRoomId(6);

		const newLobby = new LobbyInstance(newRoomId, userId, this.gameStateManager);
		this.lobbys[newRoomId] = newLobby;

		this.users[userId] = {
			room_id: newRoomId,
		};

		return newRoomId;
	}

	async deleteLobby(roomId: string) {
		this.logger.debug(`try deleteLobby ${roomId}`);
		if (this.lobbys[roomId] === undefined) {
			this.logger.debug('Room does not exist');
			throw new NotFoundException('Room does not exist');
		}
		delete this.lobbys[roomId];
		this.lobbys[roomId] = undefined;
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
	}

	async addPlayerToLobby(req: JoinGameRoomRequestDto) {
	}

	async removePlayerFromLobby(roomId: string ,userId: number): Promise<void> {
	}
	
	
	async reconnectPlayerToRoom(userId: number) {
	}

	getLobby(roomId: string): LobbyInstance | undefined{
		return this.lobbys[roomId];
	}

	getLobbyByUserId(userId: number): LobbyInstance | undefined {
		const user = this.users[userId];
		if (user === undefined) {
			return undefined;
		}
		return this.lobbys[user.room_id];
	}

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