import {Server, Socket} from 'socket.io';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { GameService } from './game.service';

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
