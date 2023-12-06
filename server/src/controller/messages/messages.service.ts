import { Injectable } from '@nestjs/common';
import { ModelMessagesService } from 'src/model/messages/messages.service';
import { EMsgType } from '@shared/types/messages'

@Injectable()
export class MessagesService {

	constructor(
		private readonly modelMessagesService: ModelMessagesService,
	) {}

	async postMessage(
		userId: number,
		chatId: number,
		type: EMsgType,
		content: string,
		) {
		return await this.modelMessagesService.postMessage(userId, chatId, type, content);
	}
}
