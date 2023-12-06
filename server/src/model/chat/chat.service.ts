import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { EChatType } from '@shared/types/chat';
import { PostgresUserService } from 'src/service/postgres/user/user.service';

@Injectable()
export class ModelChatService {
	constructor (
		private readonly postgresChatService: PostgresChatService,
		private readonly postgresUserService: PostgresUserService,
	) {}
	
	private readonly logger = new Logger(ModelChatService.name);
	
	async createChat(
			userId: number,
			type: EChatType,
			name: string,
		): Promise<string> {
		const user = await this.postgresUserService.getUserById(userId);
		return await this.postgresChatService.createChat(user, type, name);
	}

	async getChats(
		userId: number,
		type: EChatType,
		) {
		const user = await this.postgresUserService.getUserById(userId);
		return await this.postgresChatService.getChats(user, type);
	}

	async getChatById(
		userId: number,
		chatId: number,
		) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresChatService.getChatById(chatId);
		await this.postgresChatService.isInChat(userId, chatId);
		return await this.postgresChatService.getChatById(chatId);
	}

	async isInChat(
		userId: number,
		chatId: number,
		) {
		await this.postgresUserService.getUserById(userId);
		return await this.postgresChatService.isInChat(userId, chatId);
	}

	async addInChat (
		userId: number,
		friendId: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresUserService.getUserById(friendId);
		await this.postgresChatService.getChatById(chatId);
		await this.postgresUserService.isInFriendById(userId, friendId)
		return await this.postgresChatService.addInChat(friendId, chatId);
	}
}