import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	namespace: 'user',
})
export class TelemetryUserEmitGateway {
	@WebSocketServer()
	server: Server;
}
