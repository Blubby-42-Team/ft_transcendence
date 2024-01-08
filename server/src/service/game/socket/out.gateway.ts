import { Server, Socket } from 'socket.io';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { ESocketServerEventName, GameResponse, WS } from '@shared/dto/ws.dto';
import { ESocketClientEventName } from '@shared/dto/ws.dto';
import { gameStateType } from '@shared/types/game/game';
import { BadGatewayException, ForbiddenException, BadRequestException, HttpException, Logger } from '@nestjs/common';
import { UserAuthTokenDto } from 'src/auth/auth.class';
import { AuthService } from 'src/auth/auth.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as cookie from 'cookie'
import { IdManagerService } from '../idManager.service';
import { JoinPartyDto } from '../game.dto';
import { GameService } from '../game.service';

@WebSocketGateway({
	namespace: '/api/game',
})
export class OutGameGateway {
	@WebSocketServer()
	server: Server;


	emitToRoom<T>(
		roomId: string,
		data: GameResponse<T>,
	) {
		this.server.in(roomId)
			.emit(ESocketServerEventName.matchmakingStatus, data);
	}
	
	emitGameState(
		roomId: string,
		newGameState: gameStateType
	){
		this.server.to(roomId)
			.emit(ESocketServerEventName.matchState, newGameState);
	}
}
