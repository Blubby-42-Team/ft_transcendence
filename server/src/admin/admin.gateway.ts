import { SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { log } from 'console';

@WebSocketGateway({
	undefined,
	cors: {
		origin: ['https://admin.socket.io', 'http://localhost:3000'],
		credentials: true
	},
})

export class AdminGateway {
	@WebSocketServer()
	server: Server;


	afterInit() {
		instrument(this.server, {
			auth: false,
			mode: "development",
			// namespaceName: "game_admin"
		});
		console.log(`Listen WS: $url$port `)
	}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
	log("testsafd")
    return 'Hello world!';
  }
}
