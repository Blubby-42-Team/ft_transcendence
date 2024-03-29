/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { BadGatewayException, BadRequestException, ForbiddenException, HttpException, Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Server, Socket } from 'socket.io'
import { UserAuthTokenDto } from 'src/auth/auth.class';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UserTelemetryStatus } from '@shared/types/user/user';
import { GetUserStatusOfWsDto, UserTelemetryStatusWsDto } from '@shared/types/user/ws';
import { UserService } from 'src/controller/user/user.service';
import * as cookie from 'cookie'
import { WS } from '@shared/types/ws';


@WebSocketGateway({
	namespace: '/api/user',
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {

	readonly logger = new Logger(UserGateway.name);

	constructor(
		private readonly authService: AuthService,
		private readonly userControllerService: UserService,
	) { }

	// When a client connect to the server
	handleConnection(client: Socket) {
		this.logger.debug(`Client ${client.id} connected`);
	}

	// When a client disconnect from the server
	async handleDisconnect(client: Socket) {
		this.logger.debug(`Client ${client.id} disconnected`);
	}

	/**
	 * Handle a request from a client and return an acknowledgment
	 * @param socket ws client
	 * @param req client request
	 * @param dtoClass dto class to validate the request
	 * @param callback callback to handle the request and return the response
	 * @returns WS with the response
	 */
	async handleRequest<InputDTO extends object, OutputType>(
		socket: Socket,
		req: any,
		dtoClass: new () => InputDTO,
		callback: (user: UserAuthTokenDto, data: InputDTO) => Promise<OutputType>
	): Promise<WS<OutputType>> {
		try {

			// this.logger.debug(req, socket?.handshake?.headers);

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
				try {
					const cookiePars = cookie.parse(rawCookie);
					authorization = cookiePars['user_auth']
				}
				catch (error) {
					this.logger.error(error);
					throw new ForbiddenException('invalid cookie');
				}
			}

			if (!authorization) {
				throw new ForbiddenException('missing authorization header');
			}

			// Check if the jwt is valid and get the payload
			const user = await this.authService.validateUserJwtAndGetPayload(authorization);

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
	// Inject the server instance
	@WebSocketServer()
	readonly server: Server;

	/**
	 * User status telemetry
	 */
	@SubscribeMessage('telemetry.status')
	async handleStatus(
		@MessageBody() req: any,
		@ConnectedSocket() socket: Socket
	) {
		try {
			this.handleRequest(socket, req, UserTelemetryStatusWsDto, async (user, data) : Promise<void>=> {
				this.logger.debug(`User ${user.login42}:${user.userId} set status to ${data.status}`);
				this.userControllerService.setStatusTelemitry(user.userId, data.status);
			});
		} catch (error) {
			this.logger.error(error);
		}
	}

	/**
	 * Ask for user status
	 */
	@SubscribeMessage('getStatusOf')
	async handleGetStatusOf(
		@MessageBody() req: any,
		@ConnectedSocket() socket: Socket
	) {
		return this.handleRequest(socket, req, GetUserStatusOfWsDto, async (user, data) : Promise<UserTelemetryStatus>=> {
			return this.userControllerService.getStatusTelemitry(data.id);
		});
	}
}
