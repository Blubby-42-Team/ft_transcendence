import {Server} from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
	namespace: '/api/game',
})
export class EmitGateway {
	@WebSocketServer()
	server: Server;
}
