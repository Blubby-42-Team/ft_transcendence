import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class GameService {
	rooms : { [key: string]: {
		status: boolean,
	} } = {};

	async startRoom(roomName: string, server: Server) {
		this.rooms[roomName] = {
			status: true 
		}

		const id = this.makeid(5);

		console.log(`${id} room ${roomName} started`);

		//infinit loop
		
		while(this.rooms[roomName].status) {
			console.log(`${id} room ${roomName} is running`);
			server.to(roomName).emit('message', `${id} room ${roomName} is running`);
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
		//generate room id and store in db

		//return room id
		return this.makeid(5);
	}
}