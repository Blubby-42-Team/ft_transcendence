import {Server} from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { GameResponse } from '@shared/dto/ws.dto';
import { ESocketEventName } from '@shared/dto/ws.dto';
import { gameStateType } from '@shared/types/game/game';

@WebSocketGateway({
	namespace: '/api/game',
})
export class EmitGateway {
	@WebSocketServer()
	server: Server;

	emitToRoom<T>(
		roomId: string,
		data: GameResponse<T>,
	) {
		this.server.in(roomId)
			.emit(ESocketEventName.matchMakingStatus, data);
	}
	
	emitGameState(
		roomId: string,
		newGameState: gameStateType
	){
		this.server.to(roomId)
			.emit(ESocketEventName.stateGame, newGameState);
	}
}
