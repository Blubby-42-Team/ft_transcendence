import { Injectable, Logger } from '@nestjs/common';
import { GameOptDto } from '@shared/game.dto';
import { Server } from 'socket.io';
import { roomType } from './game.class';

@Injectable()
export class GameService {

	private readonly logger = new Logger(GameService.name);

	rooms : { [key: string]: roomType} = {};

	users: { [key: string]: {
		room: string,
	} } = {};

	async startRoom(roomName: string, opt: GameOptDto, io: Server) {
		this.rooms[roomName].status = true;

		const id = this.makeid(5);

		console.log(`${id} room ${roomName} started`);

		//infinit loop
		
		while(this.rooms[roomName].status) {

			await new Promise(resolve => setTimeout(resolve, 1000));
		}

	}

	async stopRoom(roomName: string) {
		this.rooms[roomName].status = false;
		console.log(`room ${roomName} stopped`);
	}

	/**
	 *  //TODO remove
	 * @param length 
	 * @returns 
	 */
	private makeid(length) {
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

	async createRoom(userId: string) {
		//TODO generate room id and store in db

		const roomId = this.makeid(5);

		this.rooms[roomId]
		this.rooms[roomId].ownerPlayerId = userId;

		this.users[userId] = {
			room: roomId,
		}

		return roomId;
	}

	addPlayerToRoom(roomName: string, userId: string) {
		if (this.users[userId]) {
			console.log(`user ${userId} already in room ${this.users[userId].room}`);
			return;
		}


		this.users[userId] = {
			room: roomName,
		}

		// this.rooms[roomName]
	}

	removePlayerFromRoom(userId: string) {
		if (!this.users[userId]) {
			console.log(`user ${userId} not in any room`);
			return;
		}

		const roomName = this.users[userId].room;
		//TODO @mkoyamba remove player from active room
		delete this.users[userId];
	}
	
	disconnectPlayerFromRoom(userId: string) {
		if (!this.users[userId]) {
			console.log(`user ${userId} not in any room`);
			return;
		}

		if (!this.rooms[this.users[userId].room]) {
			console.log(`room ${this.users[userId].room} not found`);
			return;
		}

		const room = this.rooms[this.users[userId].room];

		for (const key in room.playerInfo) {
			if (room.playerInfo[key].id === userId) {
				room.playerInfo[key].status = false;
				console.log(`user ${userId} disconnected from room ${this.users[userId].room}`);
				return;
			}
		}

	}
	
	reconnectPlayerToRoom(userId: string) {
		if (!this.users[userId]) {
			console.log(`user ${userId} not in any room`);
			return;
		}
		return this.users[userId].room;
	}

	
}