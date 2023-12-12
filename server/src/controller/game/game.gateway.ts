import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import {AcknowledgmentWsDto, JoinGameRoomRequestDto, createGameRoomResponse, createRoomRequestDto} from '@shared/dto/ws.dto'
import { validate, validateOrReject } from 'class-validator';
import { BadGatewayException, Logger, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { GameService } from '../../service/game/game.service';
import { AuthService } from '../../auth/auth.service';
import { GatewayGameService } from './gateway.game.service';
import { handleRequest } from '../wsHandleRequest';
import { log } from 'console';


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

	@SubscribeMessage('createRoom')
	async createRoom(@MessageBody() req: any) {
		return handleRequest(req, createRoomRequestDto, async (data): Promise<createGameRoomResponse> => {
		
			// TODO check if we can move this to the handleRequest
			await this.authService.validateJwtAndGetPayload(req.auth_token);

			return {
				game_room_id: '0000',
			};

		});
	}

}
