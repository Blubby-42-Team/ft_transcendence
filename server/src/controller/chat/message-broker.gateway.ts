import { BadGatewayException, BadRequestException, ForbiddenException, HttpException, Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Server, Socket } from 'socket.io'
import { UserAuthTokenDto } from 'src/auth/auth.class';
import { AcknowledgmentWsDto } from '@shared/dto/ws.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { WSDTO_subcribeToChatUpdates } from './chat.dto';
import { ChatService } from './chat.service';
import * as cookie from 'cookie'

type subscribeToChatUpdatesWSResponse = {
	listenTo: string;
}

@WebSocketGateway({
	namespace: 'message-broker',
	cors: {
		origin: '*',
	},
})
export class MessageBrokerGateway implements OnGatewayConnection, OnGatewayDisconnect {

	readonly logger = new Logger(MessageBrokerGateway.name);

	constructor(
		private readonly authService: AuthService,
		private readonly chatService: ChatService,
	) {}

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
	 * User status telemetry
	 */
	@SubscribeMessage('subcribe-to')
	async handleStatus(
		@MessageBody() req: any,
		@ConnectedSocket() socket: Socket
	) {
		return this.handleRequest(socket, req, WSDTO_subcribeToChatUpdates, async (user, data): Promise<subscribeToChatUpdatesWSResponse> => {
			this.logger.debug(`subcribe-to: ${user?.displayName} try to subcribe to ${data.chatId}`)
			const chan =  await this.chatService.subscribteToChatUpdates(user.userId, data.chatId, socket);
			return {
				listenTo: chan
			}
		});
	}
}

