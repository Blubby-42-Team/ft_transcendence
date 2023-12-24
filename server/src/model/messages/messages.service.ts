import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PostgresMessagesService } from 'src/service/postgres/messages/messages.service';
import { EMsgType } from '@shared/types/messages';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { UserRoleType } from 'src/auth/auth.class';

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
		if (type === EMsgType.sys && user.role !== UserRoleType.System) {
			throw new UnauthorizedException('Not authorized to send a system message.')
		}
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		await this.postgresChatService.isInChat(userId, chatId);
		return await this.postgresMessagesService.postMessage(user, chat, type, content);
	}
}