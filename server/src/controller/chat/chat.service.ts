import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelChatService } from 'src/model/chat/chat.service';
import { EChatType } from '@shared/types/chat'

@Injectable()
export class ChatService {

	constructor(
		private readonly modelChatService: ModelChatService,
	) {}

	async createChat(
		userId: number,
		type: EChatType,
		name: string,
		) {
		if (type === EChatType.friends || type === EChatType.inactive)
			throw new UnauthorizedException("Cannot create a chat of this type.");
		return await this.modelChatService.createChat(userId, type, name);
	}

	async getChats(
		userId: number,
		type: EChatType,
		) {
		if (type === EChatType.inactive)
			throw new UnauthorizedException("Cannot get a chat of this type.");
		return await this.modelChatService.getChats(userId, type);
	}

	async getChatById(
		userId: number,
		chatId: number,
		) {
		return await this.modelChatService.getChatById(userId, chatId);
	}

	async isInChat(
		userId: number,
		chatId: number,
		) {
		return await this.modelChatService.isInChat(userId, chatId);
	}

	async addInChat(
		userId: number,
		friendId: number,
		chatId: number,
	) {
		return await this.modelChatService.addInChat(userId, friendId, chatId);
	}

	async removeFromChat(
		userId: number,
		chatId: number,
	) {
		return await this.modelChatService.removeFromChat(userId, chatId);
	}
}
