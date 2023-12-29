import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PostgresMessagesService } from 'src/service/postgres/messages/messages.service';
import { EMsgType } from '@shared/types/messages';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { PostgresMuteService } from 'src/service/postgres/mute/mute.service';
import { UserRoleType } from 'src/auth/auth.class';

@Injectable()
export class ModelMessagesService {
	constructor (
		private readonly postgresMessagesService: PostgresMessagesService,
		private readonly postgresUserService: PostgresUserService,
		private readonly postgresChatService: PostgresChatService,
		private readonly postgresMuteService: PostgresMuteService,
	) {}
	
	private readonly logger = new Logger(ModelMessagesService.name);
	
	async postMessage(
			userId: number,
			chatId: number,
			type: EMsgType,
			content: string,
		) {
		const user = await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		if (type === EMsgType.sys && user.role !== UserRoleType.System) {
			throw new UnauthorizedException('Not authorized to send a system message.')
		}
		await this.postgresChatService.isInChat(userId, chatId);
		if (await this.postgresMuteService.isMuted(userId, chatId))
			throw new UnauthorizedException("You're muted.");
		return await this.postgresMessagesService.postMessage(user, chat, type, content);
	}
}