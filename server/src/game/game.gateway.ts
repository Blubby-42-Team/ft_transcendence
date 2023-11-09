import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { log } from 'console';
import { Server, Socket } from 'socket.io'
import {JoinRoomRequest} from '@shared/ws.dto'
import { TestDto } from '@shared/test.dto';
import { validate } from 'class-validator';
import { BadRequestException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsBadRequestExceptionFilter } from './game.exception.filter';
import { plainToClass } from 'class-transformer';

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

	// When a client connect to the server
	handleConnection(client: Socket, ...args: any[]) {
		log(`Client ${client.id} connected`);
	}
	
	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		log(`Client ${client.id} disconnected`);
	}

	// Inject the server instance
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: any) : WsResponse<string>{
		log("Recieve new message")
		log(JSON.stringify(data))
		// this.server.emit('message', {
		// 	res: "Hello world!"
		// })
		return ({
			event: "message",
			data: "test"
		})
	}

	@SubscribeMessage('testRoom')
	@UsePipes(new ValidationPipe())
	async testRooms(@ConnectedSocket() client: Socket, @MessageBody() req: JoinRoomRequest) {
		log(req)
	}

//   @SubscribeMessage('joinRoom')
//   handleJoinRoom(client: Socket, room: string) {
//     client.join(room);
//     console.log(`Client ${client.id} joined room ${room}`);
    
//     // You can also broadcast to the room or emit a message to the client
//     this.server.to(room).emit('message', 'Hello from the room!');
//     client.emit('message', 'Welcome to the room!');
//   }
}
