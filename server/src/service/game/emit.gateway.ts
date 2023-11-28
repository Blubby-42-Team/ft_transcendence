
import {Server} from 'socket.io';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: '*',
	}
})
export class EmitGateway {
	@WebSocketServer()
	server: Server;
}
