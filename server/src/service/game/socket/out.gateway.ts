import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { ELobbyStatus, ESocketServerEventName, GameResponse } from '@shared/dto/ws.dto';
import { gameStateType } from '@shared/types/game/game';

@WebSocketGateway({
	namespace: '/api/game',
})
export class OutGameGateway {
	@WebSocketServer()
	server: Server;


	emitToRoom<T>(
		roomId: string,
		status: ELobbyStatus,
		data: T,
	) {
		this.server.in(roomId)
			.emit(ESocketServerEventName.matchmakingStatus, {
				status: status,
				data: data,
			});
	}
	
	emitGameState(
		roomId: string,
		newGameState: gameStateType
	){
		this.server.to(roomId)
			.emit(ESocketServerEventName.matchState, newGameState);
	}
}
