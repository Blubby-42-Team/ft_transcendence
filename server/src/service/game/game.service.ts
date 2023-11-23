import { Injectable, Logger } from '@nestjs/common';
import { GameOptDto } from '@shared/dto/game.dto';
import { Server } from 'socket.io';
import { GameInstance } from '../../model/game/game.class';
import { WebSocketServer } from '@nestjs/websockets';
import { EmitGateway } from './emit.gateway';

@Injectable()
export class GameService {

	constructor (
		private readonly emitGAteway: EmitGateway,
	) {}

	private readonly logger = new Logger(GameService.name);

	private rooms: {
		[key: string]: GameInstance;
	} = {};

	async startRoom(roomName: string, opt: GameOptDto, io: Server) {
	}

	async stopRoom(roomName: string) {
	}


	async createRoom(userId: string) {
	}

	addPlayerToRoom(roomName: string, userId: string) {
	}

	removePlayerFromRoom(userId: string) {
	}
	
	disconnectPlayerFromRoom(userId: string) {
	}
	
	reconnectPlayerToRoom(userId: string) {
	}

	test(){
		this.logger.log('test');
		this.emitGAteway.server.emit('test', 'test');
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
}