import { Injectable } from '@nestjs/common';
import { GameOptDto } from '@shared/ws.dto';
import { Server } from 'socket.io';

@Injectable()
export class GameService {
	rooms : { [key: string]: {
		status: boolean,
	} } = {};

	users: { [key: string]: {
		room: string,
	} } = {};
	

	async startRoom(roomName: string, opt: GameOptDto, io: Server) {
		this.rooms[roomName] = {
			status: true,
			//TODO @mkoyamba add user to room
		}

		const id = this.makeid(5);

		console.log(`${id} room ${roomName} started`);

		//infinit loop
		
		while(this.rooms[roomName].status) {
			console.log(`${id} room ${roomName} is running`);
			io.to(roomName).emit('message', `${id} room ${roomName} is running`);
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

	createRoom() {
		//TODO generate room id and store in db

		//return room id
		return this.makeid(5);
	}

	addPlayerToRoom(roomName: string, userId: string) {
		if (this.users[userId]) {
			console.log(`user ${userId} already in room ${this.users[userId].room}`);
			return;
		}


		this.users[userId] = {
			room: roomName,
		}
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
}