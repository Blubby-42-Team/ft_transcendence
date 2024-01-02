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
		const chan = `channel-${channelId}`;
		await sockerCliet.join(chan)
		return chan;
	}

	/**
	 * Unsubscribe to a message room
	 * @param channelId The channel id
	 * @param sockerCliet The socket client
	 */
	async unsubscribeChannel(channelId: number, sockerCliet: Socket) {
		return sockerCliet.leave(`channel-${channelId}`);
	}

	/**
	 * Emmit new message alert to a channel
	 */
	async emitMessageAlert(channelId: number, message: string) {
		return this.messageBrokerGateway.server.to(`channel-${channelId}`).emit('message-alert', message);
	}

}
