import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import {AcknowledgmentWsDto, JoinGameRoomRequestDto} from '@shared/dto/ws.dto'
import { validate, validateOrReject } from 'class-validator';
import { BadGatewayException, Logger, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { GameService } from '../../service/game/game.service';
import { WsBadRequestExceptionFilter } from './game.exception.filter';
import { GamePipe } from './game.pipe';
import { GameInterceptor } from './game.interceptor';


@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: '*',
	},
})

// Catch all BadRequestException and send it to the client by emitting an error `event`
@UseFilters(new WsBadRequestExceptionFilter())
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	private readonly logger = new Logger(GameGateway.name);

	constructor(
		private readonly gameService: GameService,
	) {}

	// When a client connect to the server
	handleConnection(client: Socket) {
		// this.gameService.reconnectPlayerToRoom(client.id);
		this.logger.log(`Client ${client.id} connected`);
	}
	
	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		// this.gameService.removePlayerFromRoom(client.id);
		this.logger.log(`Client ${client.id} disconnected`);
		return 'urmom the sequel'; 
	}

	// Inject the server instance
	@WebSocketServer()
	readonly server: Server;

	@SubscribeMessage('createRoom')
	async createRoom(@ConnectedSocket() client: Socket, @MessageBody() req: JoinGameRoomRequestDto): Promise<AcknowledgmentWsDto> {
		const room = '0000';
		client.join(room);

		this.logger.log(`Client ${client.id} joined room ${room}`);

		// You can also broadcast to the room or emit a message to the client
		this.server.to(room).emit('message', `Client ${client.id} joined room ${room}`);

		return new AcknowledgmentWsDto('ok', 'ok');
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
