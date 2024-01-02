import { Injectable } from '@nestjs/common';
import { MessageBrokerService } from 'src/service/message-broker/message-broker.service';
import { Socket } from 'socket.io'
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';

@Injectable()
export class ModelMessageBrokerService {
	constructor(
		private readonly messageBrokerService: MessageBrokerService,
		private readonly chatService: PostgresChatService,
	) {}

	/**
	 * Subribe user to chat updates
	 */
	async subscribeToChatUpdates(userId: number, chatId: number, socketClient: Socket) {
		await this.chatService.isInChat(userId, chatId);
		return this.messageBrokerService.subscribeChannel(userId, socketClient);
	}
}
