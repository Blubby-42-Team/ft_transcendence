import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	namespace: '/api/message-broker',
})
export class EmitMessageBrokerGateway {
	@WebSocketServer()
	server: Server;
}
