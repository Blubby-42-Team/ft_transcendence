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

	async getAllChats(
		userId: number,
		) {
		return await this.modelChatService.getAllChats(userId);
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
		toRemoveId: number,
		chatId: number,
	) {
		if (userId === toRemoveId)
			throw new UnauthorizedException("Can't remove yourself!");
		return await this.modelChatService.removeFromChat(userId, toRemoveId, chatId);
	}

	async leaveChat(
		userId: number,
		chatId: number,
	) {
		return await this.modelChatService.leaveChat(userId, chatId);
	}

	async addAdmin(
		userId: number,
		toAdd: number,
		chatId: number,
	) {
		return await this.modelChatService.addAdmin(userId, toAdd, chatId);
	}

	async removeAdmin(
		userId: number,
		toRemove: number,
		chatId: number,
	) {
		return await this.modelChatService.removeAdmin(userId, toRemove, chatId);
	}

	async banUser(
		userId: number,
		toBan: number,
		chatId: number,
	) {
		return await this.modelChatService.banUser(userId, toBan, chatId);
	}

	async unbanUser(
		userId: number,
		toUnban: number,
		chatId: number,
	) {
		return await this.modelChatService.unbanUser(userId, toUnban, chatId);
	}

	async deleteChat(
		userId: number,
		chatId: number,
	) {
		return await this.modelChatService.deleteChat(userId, chatId);
	}
}
