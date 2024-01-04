import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelChatService } from 'src/model/chat/chat.service';
import { ModelMuteService } from 'src/model/mute/mute.service';
import { ModelPictureService } from 'src/model/picture/picture.service';
import { EChatType } from '@shared/types/chat'
import { ModelMessageBrokerService } from 'src/model/message-broker/message-broker.service';
import { Socket } from 'socket.io'

@Injectable()
export class ChatService {

	constructor(
		private readonly modelChatService: ModelChatService,
		private readonly modelMuteService: ModelMuteService,
		private readonly modelPictureService: ModelPictureService,
		private readonly modelMessageBrokerService: ModelMessageBrokerService,
	) {}

	async createChat(
		userId: number,
		type: EChatType,
		name: string,
		) {
		if (type === EChatType.friends || type === EChatType.inactive || type === EChatType.protected)
			throw new UnauthorizedException("Cannot create a chat of this type.");
		return await this.modelChatService.createChat(userId, type, name);
	}

	async createChatProtected(
		userId: number,
		type: EChatType,
		name: string,
		password: string,
		) {
		if (type !== EChatType.protected)
			throw new UnauthorizedException("Cannot create a chat of this type.");
		return await this.modelChatService.createChatProtected(userId, type, name, password);
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

	async joinChat(
		userId: number,
		chatId: number,
	) {
		return await this.modelChatService.joinChat(userId, chatId);
	}

	async joinChatProtected(
		userId: number,
		chatId: number,
		password: string,
	) {
		return await this.modelChatService.joinChatProtected(userId, chatId, password);
	}

	async setPassword(
		userId: number,
		chatId: number,
		password: string,
	) {
		return await this.modelChatService.setPassword(userId, chatId, password);
	}

	async changeType(
		userId: number,
		chatId: number,
		password: string,
	) {
		return await this.modelChatService.changeType(userId, chatId, password);
	}

	async muteUserById(
		userId: number,
		toMuteId: number,
		chatId: number,
		length: number,
	) {
		return await this.modelMuteService.muteUserById(userId, toMuteId, chatId, length);
	}

	async isMuted(
		userId: number,
		chatId: number,
	) {
		return await this.modelMuteService.isMuted(userId, chatId);
	}

	async subscribteToChatUpdates(
		userId: number,
		chatId: number,
		socketClient: Socket,
	) {
		return await this.modelMessageBrokerService.subscribeToChatUpdates(userId, chatId, socketClient);
	}

	async uploadPictureChat(data: Buffer, filename: string, userId: number, chatId: number) {
		const id = await this.modelPictureService.uploadPicture(data, filename);
		return await this.modelChatService.uploadPictureChat(data, filename, userId, chatId, id);
	}

	async changeName(userId: number, chatId: number, name:string) {
		return await this.modelChatService.changeName(userId, chatId, name);
	}
}
