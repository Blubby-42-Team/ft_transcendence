import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	namespace: 'message-broker',
	cors: {
		origin: '*',
	}
})
export class MessageBrokerGateway {
	@WebSocketServer()
	server: Server;
}
