import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io'
import { EmitMessageBrokerGateway } from './message-broker.gateway';

@Injectable()
export class MessageBrokerService {

	private readonly logger = new Logger(MessageBrokerService.name);

	constructor(
		private readonly messageBrokerGateway: EmitMessageBrokerGateway,
	) {}

	/**
	 * Subscribe to a message room
	 * @param channelId The channel id
	 * @param sockerCliet The socket client
	 * @returns The channel name to subscribe
	 */
	async subscribeChannel(channelId: number, sockerCliet: Socket) {
		await sockerCliet.join(`${channelId}`)

		sockerCliet.emit(`channel-debug`, `You are connected to channel ${channelId}`);

		return `channel-${channelId}`;
	}

	/**
	 * Unsubscribe to a message room
	 * @param channelId The channel id
	 * @param sockerCliet The socket client
	 */
	async unsubscribeChannel(channelId: number, sockerCliet: Socket) {
		
		sockerCliet.emit(`channel-debug`, `You are disconnected to channel ${channelId}`);

		return sockerCliet.leave(`${channelId}`);
	}

	/**
	 * Emmit new message alert to a channel
	 */
	async emitMessageAlert(channelId: number, message: string) {
		return this.messageBrokerGateway.server.to(`${channelId}`).emit(`channel-${channelId}`, message);
	}

}
