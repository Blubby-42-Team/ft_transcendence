import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	namespace: '/api/user',
})
export class TelemetryUserEmitGateway {
	@WebSocketServer()
	server: Server;
}
