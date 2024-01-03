import {Server} from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
	namespace: 'game',
})
export class EmitGateway {
	@WebSocketServer()
	server: Server;
}
