import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { log } from 'console';
import { Server, Socket } from 'socket.io'
import {JoinRoomRequest} from '@shared/ws.dto'

@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: ['https://admin.socket.io', 'http://localhost:3000'],
		credentials: true
	},
})
export class GameGateway implements OnGatewayInit{
	
	@WebSocketServer()
	server: Server;

	afterInit() {
	}

	@SubscribeMessage('connection')
	handleConnection(client: any, payload: any): string {
		log("New ws connextion");
		return 'ok';
	}
	
	// @SubscribeMessage('message')
	// handleMessage(@MessageBody() data: any) {
	// 	log("Recieve new message")
	// 	log(JSON.stringify(data))
	// 	this.server.emit('message', {
	// 		res: "Hello world!"
	// 	})
	// }

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: any) : WsResponse<string>{
		log("Recieve new message")
		log(JSON.stringify(data))
		// this.server.emit('message', {
		// 	res: "Hello world!"
		// })
		return ({
			event: "message",
			data: "test"
		})
	}

	@SubscribeMessage('testRoom')
	testRooms(@ConnectedSocket() client: Socket, req: JoinRoomRequest) {
		// validate(req).then(errors => {
		// 	if (errors.length > 0) {
		// 		log("Error")
		// 		log(errors)
		// 	} else {
		// 		log("No error")
		// 	}
		// }
		// )
		log("Test room")
	}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
    
    // You can also broadcast to the room or emit a message to the client
    this.server.to(room).emit('message', 'Hello from the room!');
    client.emit('message', 'Welcome to the room!');
  }
}
