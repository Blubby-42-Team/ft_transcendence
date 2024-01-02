import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { AcknowledgmentWsDto, MatchMakingRequestDto, ReadyOrNotRequestDto, joinGameResponse, moveRequestDto, moveResponse, readyOrNotResponse } from '@shared/dto/ws.dto'
import { BadGatewayException, BadRequestException, ForbiddenException, HttpException, Logger } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { GatewayGameService } from './gateway.game.service';
import { UserAuthTokenDto } from 'src/auth/auth.class';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as cookie from 'cookie'


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
	async handleDisconnect(client: Socket) {
		this.logger.debug(`Client ${client.id} disconnected`);
		// const checkIsInGame = this.gameService.findUserInLobbys(client.id);
		//TODO remove the client from the game room
		//TODO remove the client from the matchmaking
		await this.gatewayGameService.clientDisconnect(client)
		.catch((err) => {
			this.logger.error(err);
			this.logger.debug(`Error while disconnecting client ${client.id}`);
		})
	}

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

			let authorization: string;

			let rawCookie = socket?.handshake?.headers?.cookie;

			if (rawCookie === undefined) {

				if (!socket?.handshake?.headers?.authorization) {
					throw new ForbiddenException('missing authorization header');
				}
					this.logger.warn(`Authorization was found in the header not in the cookie`)
					this.logger.warn(`If you are using a browser, you should use the cookie instead of the header`)
					this.logger.warn(`If you using a client (postman, insomnia, ...) you can ignore this warning`)
					authorization = socket?.handshake?.headers?.authorization;
			} else {

				this.logger.debug(`raw cookie: ${rawCookie}`);

				try {

					const cookiePars = cookie.parse(rawCookie);
					authorization = cookiePars['user_auth']
				} catch (error) {

					this.logger.error(error);
					throw new ForbiddenException('invalid cookie');
				}
			}

			this.logger.debug(`authorization: ${authorization}`);

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
	 * Ready or not
	 */
	@SubscribeMessage('readyOrNot')
	async readyOrNot(
		@MessageBody() req: any,
		@ConnectedSocket() socket: Socket
	) {
		return this.handleRequest(socket, req, ReadyOrNotRequestDto, async (user, data): Promise<readyOrNotResponse> => {

			await this.gatewayGameService.readyOrNot(user.userId, data.ready);
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
		try {
			this.handleRequest(socket, req, moveRequestDto, async (user, data): Promise<void> => {
				this.logger.debug(`move: ${data.dir}, press: ${data.press}`);
				try {
					this.gatewayGameService.move(user.userId, data.dir, data.press)
				} catch (error) {
					this.logger.error(error);
				}
			});
		} catch (error) {
			this.logger.error(error);
		}
		
	}
}
