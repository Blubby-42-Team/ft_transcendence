import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import {createGameRoomResponse, createRoomRequestDto, deleteGameRoomRequestDto, deleteGameRoomResponse} from '@shared/dto/ws.dto'
import { Logger } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { GatewayGameService } from './gateway.game.service';
import { handleRequest } from '../wsHandleRequest';


@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: '*',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	private readonly logger = new Logger(GameGateway.name);

	constructor(
		private readonly gatewayGameService: GatewayGameService,
		private readonly authService: AuthService,
	) {}

	// When a client connect to the server
	handleConnection(client: Socket) {
		this.logger.debug(`Client ${client.id} connected`);
	}
	
	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		this.logger.debug(`Client ${client.id} disconnected`);
	}

	// Inject the server instance
	@WebSocketServer()
	readonly server: Server;

	@SubscribeMessage('joinRoom')
	async joinRoom(@MessageBody() req: any) {
		return handleRequest(req, deleteGameRoomRequestDto, async (data): Promise<deleteGameRoomResponse> => {
		
			// TODO check if we can move this to the handleRequest
			const user = await this.authService.validateJwtAndGetPayload(req.auth_token);
			
			await this.gatewayGameService.joinALobby(data.game_room_id, user.userId);
			return 'ok';
		});
	}

	@SubscribeMessage('createRoom')
	async createRoom(@MessageBody() req: any) {
		return handleRequest(req, createRoomRequestDto, async (data): Promise<createGameRoomResponse> => {
		
			// TODO check if we can move this to the handleRequest
			const user = await this.authService.validateJwtAndGetPayload(req.auth_token);

			const roomId = await this.gatewayGameService.createLobby(user.userId);
			return {
				game_room_id: roomId
			};

		});
	}

	@SubscribeMessage('deleteRoom')
	async deleteRoom(@MessageBody() req: any) {
		return handleRequest(req, deleteGameRoomRequestDto, async (data): Promise<deleteGameRoomResponse> => {
		
			// TODO check if we can move this to the handleRequest
			const user = await this.authService.validateJwtAndGetPayload(req.auth_token);
			
			await this.gatewayGameService.deleteLobby(data.game_room_id, user.userId);
			return 'ok';
		});
	}

}
