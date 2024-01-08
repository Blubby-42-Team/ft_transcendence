import { Server, Socket } from 'socket.io';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { WS } from '@shared/dto/ws.dto';
import { ESocketClientEventName } from '@shared/dto/ws.dto';
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
		this.logger.debug(socket?.handshake?.headers);

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
	 * @param callback callback to handle the request and return the response
	 * @returns AcknowledgmentWsDto with the response
	 */
	async handleRequest<InputDTO extends object, OutputType>(
		socket: Socket,
		req: any,
		dtoClass: new () => InputDTO,
		callback: (user: UserAuthTokenDto, data: InputDTO) => Promise<OutputType>
	): Promise<WS<OutputType | string>> {
		try {
			const user = await this.handleAuth(socket);

			if (!req) {
				throw new BadRequestException('empty payload');
			}

			if (typeof req !== 'object') {
				throw new BadRequestException(`invalid payload type: ${typeof req}, expected json`);
			}

			if (!dtoClass) {
				const res = await callback(user, req);
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

			const res = await callback(user, dto);
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
		const user = await this.handleAuth(client);
		this.idManagerService.connect(client, user.userId);
	}

	// When a client disconnect from the server
	async handleDisconnect(client: Socket) {
		this.idManagerService.disconnect(client);
	}

	/************************************************************************ */
	/*							 MatchMaking                               */
	/************************************************************************ */

	@SubscribeMessage(ESocketClientEventName.joinMatchMaking)
	joinMatchMaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} join the matchmaking`);
		return this.handleRequest(client, req, undefined, async (user) => {
			this.idManagerService.executePrimaryAction(client, user.userId, async () => {
				this.gameService.joinMatchmaking(user.userId);
			});
			return "ok"
		});
	}

	@SubscribeMessage(ESocketClientEventName.leaveMatchMaking)
	leaveMatchMaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} leave the matchmaking`);
		return this.handleRequest(client, req, undefined,
			async (user) => {
				this.gameService.leaveMatchmaking(user.userId);
				this.idManagerService.resetUserPrimarySocket(client, user.userId);
				return "ok"
			}
		);
	}

	@SubscribeMessage(ESocketClientEventName.ready)
	ready(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} is ready`);
		return this.handleRequest(client, req, JoinPartyDto,
			async (user, data): Promise<string> => {
				return "ok"
			}
		);
	}

	/************************************************************************ */
	/*								 Party                               */
	/************************************************************************ */

	@SubscribeMessage(ESocketClientEventName.joinParty)
	joinParty(
		@ConnectedSocket() client: Socket,
		@MessageBody() req: any,
	) {
		this.logger.debug(`client ${client.id} join the party`);
		this.handleRequest(
			client,
			req,
			JoinPartyDto,
			async (user, data): Promise<string> => {
				return "ok"
			}
		);
	}
}
