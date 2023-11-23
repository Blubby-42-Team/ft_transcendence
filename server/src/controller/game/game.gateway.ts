import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { log } from 'console';
import { Server, Socket } from 'socket.io'
import {AcknowledgmentWsDto, JoinGameRoomRequestDto} from '@shared/dto/ws.dto'
import { validate } from 'class-validator';
import { BadRequestException, Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsBadRequestExceptionFilter } from './game.exception.filter';
import { plainToClass } from 'class-transformer';
import { GameService } from '../../service/game/game.service';

@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: ['https://admin.socket.io', 'http://localhost:3000'],
		credentials: true
	},
})

// Catch all BadRequestException and send it to the client by emitting an error `event`
@UseFilters(new WsBadRequestExceptionFilter())
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	private readonly logger = new Logger(GameGateway.name);

	constructor(private readonly gameService: GameService) {}

	// When a client connect to the server
	handleConnection(client: Socket, ...args: any[]) {
		// this.gameService.reconnectPlayerToRoom(client.id);
		this.logger.log(`Client ${client.id} connected`);
	}
	
	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		// this.gameService.removePlayerFromRoom(client.id);
		this.logger.log(`Client ${client.id} disconnected`);
	}

	// Inject the server instance
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('joinRoom')
	async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() req: JoinGameRoomRequestDto): Promise<AcknowledgmentWsDto> {
		
		const joinGameRoomRequestDto = plainToClass(JoinGameRoomRequestDto, req);
		const errors = await validate(joinGameRoomRequestDto);
		if (errors.length > 0) {
			this.logger.warn(`Client ${client.id} send invalid joinRoom request`);
			return new AcknowledgmentWsDto('error', JSON.stringify(errors));
		}

		//TODO Check jwt

		const room = joinGameRoomRequestDto.game_room_id;
		client.join(room);

		this.gameService.addPlayerToRoom(client.id, room);
		this.logger.log(`Client ${client.id} joined room ${room}`);

		// You can also broadcast to the room or emit a message to the client
		this.server.to(room).emit('message', `Client ${client.id} joined room ${room}`);

		return new AcknowledgmentWsDto('ok', 'ok');
	}

	@SubscribeMessage('move')
	async gameMove() {
		this.logger.log(`Client send move`);
	}
}
