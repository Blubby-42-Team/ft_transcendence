import { Server, Socket } from 'socket.io';

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BadGatewayException, ForbiddenException, BadRequestException, HttpException, Logger } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as cookie from 'cookie'

import { IdManagerService } from '../idManager.service';
import { AuthService } from 'src/auth/auth.service';
import { GameService } from '../game.service';

import { WS } from '@shared/types/ws';
import { ESocketActionType, ESocketServerEventName, ESocketClientEventName } from '@shared/types/game/socket';
import { UserAuthTokenDto } from 'src/auth/auth.class';
import { DTO_PlayerMove, DTO_StartRound, InviteToPartyDTO, JoinPartyDto } from '../game.dto';


@WebSocketGateway({
	namespace: '/api/game',
})
export class InGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly authService: AuthService,
		private readonly idManagerService: IdManagerService,
		private readonly gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server;

	readonly logger = new Logger(InGameGateway.name);

	async handleAuth(socket: Socket) {
		// this.logger.debug(socket?.handshake?.headers);

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
		}
		else {
			this.logger.debug(`raw cookie: ${rawCookie}`);

			try {
				const cookiePars = cookie.parse(rawCookie);
				authorization = cookiePars['user_auth']
			}
			catch (error) {
				this.logger.error(error);
				throw new ForbiddenException('invalid cookie');
			}
		}

		this.logger.debug(`authorization: ${authorization}`);

		if (!authorization) {
			throw new ForbiddenException('missing authorization header');
		}

		// Check if the jwt is valid and get the payload
		return this.authService.validateUserJwtAndGetPayload(authorization);
	}

	/**
	 * Handle a request from a client and return an acknowledgment
	 * @param socket ws client
	 * @param req client request
	 * @param dtoClass dto class to validate the request
	 * @param isPrimary if true, the request will be executed only if the socket is the primary socket of the user
	 * @param callback callback to handle the request and return the response
	 * @returns WS<string> with the response
	 */
	async handleRequest<InputDTO extends object, OutputType>(
		socket: Socket,
		req: any,
		dtoClass: new () => InputDTO,
		actionType: ESocketActionType,
		callback: (user: UserAuthTokenDto, data: InputDTO) => Promise<OutputType>
	): Promise<WS<OutputType>> {
		try {
			const user = await this.handleAuth(socket);

			if (!req) {
				throw new BadRequestException('empty payload');
			}

			if (typeof req !== 'object') {
				throw new BadRequestException(`invalid payload type: ${typeof req}, expected json`);
			}

			const execCallback = async (dto: InputDTO | undefined) => {
				switch (actionType) {
					case ESocketActionType.Primary:
						this.idManagerService.setUserPrimarySocket(socket, user.userId);
					case ESocketActionType.WeakPrimary:
						return this.idManagerService.executePrimaryAction(socket, user.userId, async () => {
							return callback(user, dto);
						});
					case ESocketActionType.Secondary:
						return this.idManagerService.executeSecondaryAction(socket, user.userId, async () => {
							return callback(user, dto);
						});
				}
			}

			if (!dtoClass) {
				const res = await execCallback(undefined);
				return {
					status: 'ok',
					message: res,
				};
			}
			const dto = plainToInstance(dtoClass, req);
			await validateOrReject(dto)
				.catch(errors => {
					this.logger.debug(`validation error: ${errors}`)
					throw errors.map(error => Object.values(error.constraints)).join(', ');
				});

			const res = await execCallback(dto);
			return {
				status: 'ok',
				message: res,
			};
		}
		catch (error) {
			this.logger.error(error);

			// Check if the error is a HttpException
			if (error instanceof HttpException) {
				return {
					status: 'error',
					message: error?.message ?? 'unknown error, check logs',
				};
			}

			return {
				status: 'error',
				message: error,
			};
		}
	}

	// When a client connect to the server
	async handleConnection(client: Socket) {
		await this.handleAuth(client)
		.then( async (user) => {
			await this.idManagerService.connect(client, user.userId);
		})
		.catch(error => {
			this.logger.debug(`error: ${error}`);
			const ack: WS<string> = {
				status: 'error',
				message: error?.message ?? 'unknown error, check logs or contact the administrator'
			};
			client.emit(ESocketServerEventName.error, ack);
			client.disconnect();
		});
	}

	// When a client disconnect from the server
	async handleDisconnect(client: Socket) {
		await this.idManagerService.disconnect(client);
	}

	/************************************************************************ */
	/*							 MatchMaking                               */
	/************************************************************************ */

	@SubscribeMessage(ESocketClientEventName.joinMatchMaking)
	async joinMatchMaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} join the matchmaking`);
		return await this.handleRequest(client, req, undefined, ESocketActionType.Primary, async (user) => {
			return this.gameService.joinMatchmaking(user.userId);
		});
	}

	@SubscribeMessage(ESocketClientEventName.leaveMatchMaking)
	leaveMatchMaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} leave the matchmaking`);
		return this.handleRequest(client, req, undefined, ESocketActionType.Primary, async (user) => {
			this.gameService.leaveMatchmaking(user.userId);
			this.idManagerService.resetUserPrimarySocket(user.userId);
			return "ok"
		});
	}

	@SubscribeMessage(ESocketClientEventName.readyToPlay)
	ready(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} is ready`);
		return this.handleRequest(client, req, undefined, ESocketActionType.WeakPrimary, async (user) => {
			return this.gameService.isReady(user.userId);
		});
	}

	/************************************************************************ */
	/*								 Party                      	         */
	/************************************************************************ */

	@SubscribeMessage(ESocketClientEventName.joinParty)
	joinParty(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} join the party`);
		return this.handleRequest(client, req, JoinPartyDto, ESocketActionType.Primary, async (user, data) => {
			return this.gameService.joinPrivateParty(data.roomId, user.userId);
		});
	}

	@SubscribeMessage(ESocketClientEventName.inviteToParty)
	inviteToParty(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} leave the party`);
		return this.handleRequest(client, req, InviteToPartyDTO, ESocketActionType.WeakPrimary, async (user, data) => {
			return this.gameService.inviteToPrivateParty(data.roomId, data.userId, user.userId);
		});
	}

	/************************************************************************ */
	/*								 Game                	               */
	/************************************************************************ */

	@SubscribeMessage(ESocketClientEventName.movePlayer)
	movePlayer(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} send a game event`);
		return this.handleRequest(client, req, DTO_PlayerMove, ESocketActionType.WeakPrimary, async (user, data) => {
			return this.gameService.move(user.userId, data.direction, data.press);
		});
	}

	@SubscribeMessage(ESocketClientEventName.startRound)
	startRound(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} start the round`);
		return this.handleRequest(client, req, DTO_StartRound, ESocketActionType.WeakPrimary, async (user, data) => {
			return this.gameService.startRound(user.userId, data.press);
		});
	}

	@SubscribeMessage(ESocketClientEventName.leaveGame)
	leaveGame(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} leave the game`);
		return this.handleRequest(client, req, undefined, ESocketActionType.Primary, async (user) => {
			await this.idManagerService.resetUserPrimarySocket(user.userId);
			await this.gameService.leaveMatch(user.userId);
			return "ok"
		});
	}
}
