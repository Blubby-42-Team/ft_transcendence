import { SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { log } from 'console';

@WebSocketGateway({
	undefined,
	cors: {
		origin: '*',
	},
})

export class AdminGateway {
	@WebSocketServer()
	server: Server;


	afterInit() {
		instrument(this.server, {
			auth: false,
			mode: "development",
		});
	}
}
