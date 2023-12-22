import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { JoinGameRoomRequestDto, addOrRemovePlayerToWhiteListResponse, addPlayerToWhiteListRequestDto, createGameRoomResponse, createRoomRequestDto, deleteGameRoomRequestDto, deleteGameRoomResponse, joinGameResponse } from '@shared/dto/ws.dto'
import { Logger } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { GatewayGameService } from './gateway.game.service';
import { handleRequest } from '../wsHandleRequest';


@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: '*',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	readonly logger = new Logger(GameGateway.name);

	constructor(
		private readonly gatewayGameService: GatewayGameService,
		private readonly authService: AuthService,
	) { }

	// When a client connect to the server
	handleConnection(client: Socket) {
		this.logger.debug(`Client ${client.id} connected`);
	}

	// When a client disconnect from the server
	handleDisconnect(client: Socket) {
		this.logger.debug(`Client ${client.id} disconnected`);
	}

	// Inject the server instance
	@WebSocketServer()
	readonly server: Server;

	// TODO #36 REWORK
	// User should be allowed to join a room only if he is in the white list
	// Only check if there is a client connected to the room
	// If it's the case, disconnect the old client and connect the new one
	@SubscribeMessage('joinGame')
	async joinGame(@MessageBody() req: any) {
		return handleRequest(req, JoinGameRoomRequestDto, async (data): Promise<joinGameResponse> => {

			// TODO check if we can move this to the handleRequest
			const user = await this.authService.validateJwtAndGetPayload(req.auth_token);

			const roomId = await this.gatewayGameService.joinAGame(data.game_room_id, user.userId);
			return {
				game_room_id: roomId
			};
		});
	}

	@SubscribeMessage('createMyGame')
	async createMyGame(@MessageBody() req: any) {
		return handleRequest(req, createRoomRequestDto, async (data): Promise<createGameRoomResponse> => {

			// TODO check if we can move this to the handleRequest
			const user = await this.authService.validateJwtAndGetPayload(req.auth_token);

			const roomId = await this.gatewayGameService.createAGame(user.userId);
			return {
				game_room_id: roomId
			};

		});
	}

	@SubscribeMessage('deleteMyGame')
	async stopMyGame(@MessageBody() req: any) {
		return handleRequest(req, deleteGameRoomRequestDto, async (data): Promise<deleteGameRoomResponse> => {

			// TODO check if we can move this to the handleRequest
			const user = await this.authService.validateJwtAndGetPayload(req.auth_token);

			await this.gatewayGameService.stopMyGame(user.userId);
			return 'ok';
		});
	}

	@SubscribeMessage('addPlayerToMyGame')
	async addPlayerToMyGame(@MessageBody() req: any) {
		return handleRequest(req, addPlayerToWhiteListRequestDto, async (data): Promise<addOrRemovePlayerToWhiteListResponse> => {

			// TODO check if we can move this to the handleRequest
			const user = await this.authService.validateJwtAndGetPayload(req.auth_token);

			await this.gatewayGameService.addPlayerToMyWhiteList(user.userId, data.user_to_white_list);
			return 'ok';
		});
	}

	// @SubscribeMessage('removePlayerFromWhiteList')
}
