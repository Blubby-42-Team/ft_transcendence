
import {Server} from 'socket.io';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: ['https://admin.socket.io', 'http://localhost:3000'],
		credentials: true
	},
})
export class EmitGateway {
	@WebSocketServer()
	server: Server;
}
