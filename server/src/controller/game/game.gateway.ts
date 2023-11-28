import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import {AcknowledgmentWsDto, JoinGameRoomRequestDto} from '@shared/dto/ws.dto'
import { validate, validateOrReject } from 'class-validator';
import { BadGatewayException, Logger, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { GameService } from '../../service/game/game.service';
import { AuthService } from '../../auth/auth.service';
import { GatewayGameService } from './gateway.game.service';


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
		this.logger.log(`Client ${client.id} connected`);
	}
	
	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		this.logger.log(`Client ${client.id} disconnected`);
	}

	// Inject the server instance
	@WebSocketServer()
	readonly server: Server;

	@SubscribeMessage('createRoom')
	async createRoom(@ConnectedSocket() client: Socket, @MessageBody() req: any): Promise<AcknowledgmentWsDto> {
		try {
			validateOrReject(plainToInstance(AcknowledgmentWsDto, req))
			this.authService.validateJwtAndGetPayload(req.auth_token);
			this
			return new AcknowledgmentWsDto('ok', {
				game_room_id: '0000',
			});
		} catch (error) {
			return new AcknowledgmentWsDto('error', error);
		}
	}

	// @UsePipes(new GamePipe())
	// @UseInterceptors(new GameInterceptor())
	@SubscribeMessage('joinRoom')
	async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() req: JoinGameRoomRequestDto): Promise<AcknowledgmentWsDto> {
		
		throw new WsException('urmom');
		const room = '0000';
		client.join(room);

		this.logger.log (req);
		try {
			await validateOrReject(plainToClass(JoinGameRoomRequestDto, req))
		} catch (errors) {
			this.logger.error(errors);
			return new AcknowledgmentWsDto('error', errors);
		}
		this.logger.log(`Client ${client.id} joined room ${room}`);

		// You can also broadcast to the room or emit a message to the client
		this.server.to(room).emit('message', `Client ${client.id} joined room ${room}`);

		return new AcknowledgmentWsDto('ok', 'ok');
	}

	@SubscribeMessage('leaveRoom')
	async leftRoom(@ConnectedSocket() client: Socket, @MessageBody() req: JoinGameRoomRequestDto): Promise<AcknowledgmentWsDto> {
		const room = '0000';
		client.leave(room);

		this.logger.log(`Client ${client.id} left room ${room}`);

		// You can also broadcast to the room or emit a message to the client
		this.server.to(room).emit('message', `Client ${client.id} left room ${room}`);

		return new AcknowledgmentWsDto('ok', 'ok');
	}

	@SubscribeMessage('move')
	async gameMove(@MessageBody('move') direction: any /**TODO use dto */) {
	}
}
