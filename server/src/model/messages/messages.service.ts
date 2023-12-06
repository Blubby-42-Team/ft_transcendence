import { Injectable, Logger } from '@nestjs/common';
import { PostgresMessagesService } from 'src/service/postgres/messages/messages.service';
import { EMsgType } from '@shared/types/messages';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';

@Injectable()
export class ModelMessagesService {
	constructor (
		private readonly postgresMessagesService: PostgresMessagesService,
		private readonly postgresUserService: PostgresUserService,
		private readonly postgresChatService: PostgresChatService,
	) {}
	
	private readonly logger = new Logger(ModelMessagesService.name);
	
	async postMessage(
			userId: number,
			chatId: number,
			type: EMsgType,
			content: string,
		) {
		const user = await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatById(chatId);
		return await this.postgresMessagesService.postMessage(user, chat, type, content);
	}
}