import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { AcknowledgmentWsDto, JoinGameRoomRequestDto, MatchMakingRequestDto, addOrRemovePlayerToWhiteListResponse, addPlayerToWhiteListRequestDto, createGameRoomResponse, createRoomRequestDto, deleteGameRoomRequestDto, deleteGameRoomResponse, joinGameResponse, moveRequestDto, moveResponse } from '@shared/dto/ws.dto'
import { BadGatewayException, BadRequestException, ForbiddenException, HttpException, Logger } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { GatewayGameService } from './gateway.game.service';
import { UserAuthTokenDto } from 'src/auth/auth.class';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { subscribe } from 'diagnostics_channel';


@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: '*',
	},
})
export class GameGateway {

	readonly logger = new Logger(GameGateway.name);

	constructor(
		private readonly gatewayGameService: GatewayGameService,
		private readonly authService: AuthService,
	) { }

	/**
	 * Handle a request from a client and return an acknowledgment
	 * @param socket ws client
	 * @param req client request
	 * @param dtoClass dto class to validate the request
	 * @param callback callback to handle the request and return the response
	 * @returns AcknowledgmentWsDto with the response
	 */
	async handleRequest<InputDTO extends object, OutputType>(
		socket: Socket,
		req: any,
		dtoClass: new () => InputDTO,
		callback: (user: UserAuthTokenDto, data: InputDTO) => Promise<OutputType>
	): Promise<AcknowledgmentWsDto<OutputType>> {
		try {

			this.logger.debug(req, socket?.handshake?.headers);

			if (!socket) {
				throw new BadGatewayException('missing socket');
			}

			/**
			 * Check if the socket has the authorization header
			 */
			const authorization = socket?.handshake?.headers?.authorization;

			if (!authorization) {
				throw new ForbiddenException('missing authorization header');
			}

			// Check if the jwt is valid and get the payload
			const user = await this.authService.validateJwtAndGetPayload(authorization);

			if (!req) {
				throw new BadRequestException('empty payload');
			}

			if (typeof req !== 'object') {
				throw new BadRequestException(`invalid payload type: ${typeof req}, expected json`);
			}

			const dto = plainToInstance(dtoClass, req);
			await validateOrReject(dto)
			.catch(errors => {
				this.logger.debug(`validation error: ${errors}`)
				throw errors.map(error => Object.values(error.constraints)).join(', ');
			});

			const res = await callback(user, dto);
			return new AcknowledgmentWsDto<OutputType>('ok', res);

		} catch (error) {

			this.logger.error(error);

			// Check if the error is a HttpException
			if (error instanceof HttpException) {
				return new AcknowledgmentWsDto<any>('error', error?.message ?? 'unknown error, check logs');
			}

			return new AcknowledgmentWsDto<any>('error', error);
		}
	}
	// Inject the server instance
	@WebSocketServer()
	readonly server: Server;

	/**
	 * TODO Feature temporarily disabled #39
	 */
	// @SubscribeMessage('createMyGame')
	// async createMyGame(
	// 	@MessageBody() req: any,
	// 	@ConnectedSocket() socket: Socket
	// ) {
	// 	return this.handleRequest(socket, req, createRoomRequestDto, async (user, data): Promise<createGameRoomResponse> => {

	// 		const roomId = await this.gatewayGameService.createAGame(user.userId);
	// 		return {
	// 			game_room_id: roomId
	// 		};

	// 	});
	// }

	/**
	 * TODO Feature temporarily disabled #39
	 */
	// @SubscribeMessage('stopMyGame')
	// async stopMyGame(
	// 	@MessageBody() req: any,
	// 	@ConnectedSocket() socket: Socket
	// ) {
	// 	return this.handleRequest(socket, req, deleteGameRoomRequestDto, async (user, data): Promise<deleteGameRoomResponse> => {

	// 		await this.gatewayGameService.stopMyGame(user.userId);
	// 		return 'ok';
	// 	});
	// }

	/**
	 * TODO Feature temporarily disabled #39
	 */
	// @SubscribeMessage('addPlayerToMyGame')
	// async addPlayerToMyGame(
	// 	@MessageBody() req: any,
	// 	@ConnectedSocket() socket: Socket
	// ) {
	// 	return this.handleRequest(socket, req, addPlayerToWhiteListRequestDto, async (user, data): Promise<addOrRemovePlayerToWhiteListResponse> => {

	// 		await this.gatewayGameService.addPlayerToMyGame(user.userId, data.user_to_white_list);
	// 		return 'ok';
	// 	});
	// }

	// @SubscribeMessage('removePlayerFromWhiteList')

	// TODO rework for #40 #64 #65 @Matthew-Dreemurr
	// @SubscribeMessage('joinGame')
	// async joinGame(
	// 	@MessageBody() req: any,
	// 	@ConnectedSocket() socket: Socket
	// ) {
	// 	return this.handleRequest(socket, req, JoinGameRoomRequestDto, async (user, data): Promise<joinGameResponse> => {

	// 		await this.gatewayGameService.joinAGame(data.game_room_id, user.userId, socket);
	// 		return 'ok';
	// 	});
	// }

	// WIP @Matthew-Dreemurr #40 #64 #65
	/**
	 * Match makeking
	 */
	@SubscribeMessage('matchmake')
	async matchmake(
		@MessageBody() req: any,
		@ConnectedSocket() socket: Socket
	) {
		return this.handleRequest(socket, req, MatchMakingRequestDto, async (user, data): Promise<joinGameResponse> => {

			await this.gatewayGameService.matchMakingTwoPlayers(user.userId, socket);
			return 'ok';
		});
	}

	/**
	 * Handle player move input
	 */
	@SubscribeMessage('move')
	async move(
		@MessageBody() req: any,
		@ConnectedSocket() socket: Socket
	) {
		return this.handleRequest(socket, req, moveRequestDto, async (user, data): Promise<moveResponse> => {
			
			return 'ok';
		});
	}
}
