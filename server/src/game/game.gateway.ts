import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { log } from 'console';
import { Server, Socket } from 'socket.io'
import {AcknowledgmentWsDto, JoinGameRoomRequestDto} from '@shared/ws.dto'
import { TestDto } from '@shared/test.dto';
import { validate } from 'class-validator';
import { BadRequestException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsBadRequestExceptionFilter } from './game.exception.filter';
import { plainToClass } from 'class-transformer';
import { GameService } from './game.service';

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

	constructor(private readonly gameService: GameService) {}

	// When a client connect to the server
	handleConnection(client: Socket, ...args: any[]) {
		// this.gameService.startRoom(client.id, this.server);
		log(`Client ${client.id} connected`);
	}
	
	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		// this.gameService.stopRoom(client.id);
		log(`Client ${client.id} disconnected`);
	}

	// Inject the server instance
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('joinRoom')
	async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() req: JoinGameRoomRequestDto): Promise<AcknowledgmentWsDto> {
		
		// Check jwt party

		const room = req.game_room_id;
		client.join(room);
		console.log(`Client ${client.id} joined room ${room}`);
		// You can also broadcast to the room or emit a message to the client
		this.server.to(room).emit('message', `Client ${client.id} joined room ${room}`);
		this.gameService.startRoom(room, this.server);

		return new AcknowledgmentWsDto('ok', 'ok');
	}
}
