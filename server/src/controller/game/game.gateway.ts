import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import {AcknowledgmentWsDto, JoinGameRoomRequestDto} from '@shared/dto/ws.dto'
import { validate } from 'class-validator';
import { BadGatewayException, Logger, UseFilters } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GameService } from '../../service/game/game.service';
import { WsBadRequestExceptionFilter } from './game.exception.filter';


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

	constructor(
		private readonly gameService: GameService,
	) {}

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
	readonly server: Server;

	@SubscribeMessage('joinRoom')
	async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() req: JoinGameRoomRequestDto): Promise<AcknowledgmentWsDto> {
		
		const joinGameRoomRequestDto = plainToClass(JoinGameRoomRequestDto, req);
		const errors = await validate(joinGameRoomRequestDto);
		if (errors.length > 0) {
			this.logger.warn(`Client ${client.id} send invalid joinRoom request`);
			return new AcknowledgmentWsDto('error', JSON.stringify(errors));
		}

		//TODO Check jwt and make a decorator to check and return user id

		await this.gameService.addPlayerToLobby

		const room = joinGameRoomRequestDto.game_room_id;
		client.join(room);

		this.logger.log(`Client ${client.id} joined room ${room}`);

		// You can also broadcast to the room or emit a message to the client
		this.server.to(room).emit('message', `Client ${client.id} joined room ${room}`);

		return new AcknowledgmentWsDto('ok', 'ok');
	}

	@SubscribeMessage('move')
	async gameMove(@MessageBody('move') direction: any /**TODO use dto */) {

		// this.gameSErvice.movePlayer(id, direction, room);//TODO 
		this.logger.log(`Client send move ${JSON.stringify(direction)}`);
	}

	@SubscribeMessage('test')
	async test(@ConnectedSocket() client: Socket, @MessageBody() req: any) {
		this.logger.log(`Client ${client.id} send test ${JSON.stringify(req)}`);
		// this.server.emit('test', 'test');
		// throw new WsException(new AcknowledgmentWsDto('error', 'test'));
		// throw new WsException('Errtest');
		throw new BadGatewayException('test');
		return new AcknowledgmentWsDto('ok', 'ok');
	}
}
