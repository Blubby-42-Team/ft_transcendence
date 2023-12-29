import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	namespace: 'user',
	cors: {
		origin: '*',
	}
})
export class TelemetryUserEmitGateway {
	@WebSocketServer()
	server: Server;
}
