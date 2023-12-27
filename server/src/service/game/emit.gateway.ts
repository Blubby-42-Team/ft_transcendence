import {Server, Socket} from 'socket.io';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: '*',
	}
})
export class EmitGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	readonly logger = new Logger(EmitGateway.name);

	// When a client connect to the server
	handleConnection(client: Socket) {
		this.logger.debug(`Client ${client.id} connected`);
	}

	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		//TODO remove the client from the game room
		//TODO remove the client from the matchmaking
		this.logger.debug(`Client ${client.id} disconnected`);
	}
}
