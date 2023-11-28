import { Injectable, Logger } from '@nestjs/common';
import { GameOptDto } from '@shared/dto/game.dto';
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
			lobby: string,
			room_id: string,
		}
	} = {};

	async createLobby(userId: number) {
	}

	async deleteLobby(roomId: string) {
	}

	async startGame(roomName: string, opt: GameOptDto, io: Server) {
	}

	async stopGame(roomName: string) {
	}

	async addPlayerToWhiteList(roomId: string, userId: number) {
	}

	async addPlayerToLobby(req: JoinGameRoomRequestDto) {
	}

	async removePlayerFromLobby(roomId: string ,userId: number): Promise<void> {
	}
	
	
	async reconnectPlayerToRoom(userId: number) {
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