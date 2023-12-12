import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { EChatType } from '@shared/types/chat';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { Chat } from './chat.class';
import { User } from '../user/user.class';

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
		): Promise<Chat> {
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

	async getAllChats(
		userId: number,
		) {
		const user = await this.postgresUserService.getUserById(userId);
		return await this.postgresChatService.getAllChats(user);
	}

	async getChatById(
		userId: number,
		chatId: number,
		) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresChatService.getChatById(chatId, userId);
		await this.postgresChatService.isInChat(userId, chatId);
		return await this.postgresChatService.getChatById(chatId, userId);
	}

	async isInChat(
		userId: number,
		chatId: number,
		) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresChatService.getChatById(chatId, userId);
		return await this.postgresChatService.isInChat(userId, chatId);
	}

	async addInChat (
		userId: number,
		friendId: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresUserService.getUserById(friendId);
		await this.postgresChatService.getChatById(chatId, userId);
		await this.postgresChatService.isInChat(userId, chatId);
		await this.postgresUserService.isInFriendById(userId, friendId)
		if (!await this.postgresChatService.isBan(friendId, chatId)) {
			return await this.postgresChatService.addInChat(friendId, chatId);
		}
		else
			throw new UnauthorizedException("This user is banned from the chat.");
	}

	async leaveChat(
		userId: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		if (chat.type === EChatType.friends)
			throw new UnauthorizedException("Can't leave a friends chat.")
		await this.postgresChatService.isInChat(userId, chatId).catch((err) => {throw err});
		if (await this.postgresChatService.isOwner(userId, chatId).catch((err) => {throw err})) {
			await this.postgresChatService.removeFromChat(userId, chatId).catch((err) => {throw err});
			let chat = await this.postgresChatService.getChatByIdSystem(chatId);
			let newOwner: number;
			console.log(chat.users, chat.admins)
			if (chat.admins.length > 0) {
				newOwner = chat.admins[0].id;
			}
			else if (chat.users.length > 0){
				newOwner = chat.users[0].id;
				await this.postgresChatService.addAdmin(newOwner, chatId);
			}
			else
				return await this.postgresChatService.deleteChat(chatId);
			return await this.postgresChatService.updateOwner(newOwner, chatId);
		}
		else if (await this.postgresChatService.isInChat(userId, chatId).catch((err) => {throw err}))
			return await this.postgresChatService.removeFromChat(userId, chatId).catch((err) => {throw err});
		else
			throw new UnauthorizedException("Not authorized to leave this chat.")
	}

	async removeFromChat(
		userId: number,
		toRemoveId: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresUserService.getUserById(toRemoveId);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		if (chat.type === EChatType.friends) {
			throw new UnauthorizedException("Can't remove someone from your friends chat.")
		}
		await this.postgresChatService.isInChat(userId, chatId).catch((err) => {throw err});
		if (await this.postgresChatService.isAdmin(userId, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isOwner(toRemoveId, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isAdmin(toRemoveId, chatId).catch((err) => {throw err}))
			return await this.postgresChatService.removeFromChat(toRemoveId, chatId).catch((err) => {throw err});
		else if (await this.postgresChatService.isOwner(userId, chatId).catch((err) => {throw err}))
			return await this.postgresChatService.removeFromChat(toRemoveId, chatId).catch((err) => {throw err});
		else
			throw new UnauthorizedException("Not authorized to remove this user.")
	}

	async addAdmin(
		userId: number,
		toAdd: number,
		chatId: number,
	) {
		if (userId === toAdd)
			throw new UnauthorizedException("Can't add yourself to admin position.")
		else if (await this.postgresChatService.isOwner(userId, chatId) && await this.isInChat(toAdd, chatId))
			return await this.postgresChatService.addAdmin(toAdd, chatId);
		else
			throw new UnauthorizedException("You have to be the owner of the chat");
	}

	async removeAdmin(
		userId: number,
		toRemove: number,
		chatId: number,
	) {
		if (userId === toRemove)
			throw new UnauthorizedException("Can't remove yourself from admin position.")
		else if (await this.postgresChatService.isOwner(userId, chatId))
			await this.postgresChatService.removeAdmin(toRemove, chatId);
		else
			throw new UnauthorizedException("You have to be the owner of the chat.");
	}

	async banUser (
		userId: number,
		toBan: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresUserService.getUserById(toBan);
		await this.postgresChatService.getChatById(chatId, userId);
		await this.postgresChatService.isInChat(userId, chatId).catch((err) => {throw err});
		if (await this.postgresChatService.isAdmin(userId, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isOwner(toBan, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isAdmin(toBan, chatId).catch((err) => {throw err})) {
			await this.postgresChatService.removeFromChat(toBan, chatId)
			return await this.postgresChatService.banUser(toBan, chatId).catch((err) => {throw err});
		}
		else if (await this.postgresChatService.isOwner(userId, chatId).catch((err) => {throw err})) {
			await this.postgresChatService.removeFromChat(toBan, chatId)
			await this.postgresChatService.removeAdmin(toBan, chatId);
			return await this.postgresChatService.banUser(toBan, chatId).catch((err) => {throw err});
		}
		else
			throw new UnauthorizedException("Not authorized to ban this user.")
	}

	async unbanUser(
		userId: number,
		toUnban: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresUserService.getUserById(toUnban);
		await this.postgresChatService.getChatById(chatId, userId);
		await this.postgresChatService.isInChat(userId, chatId);
		if (await this.postgresChatService.isAdmin(userId, chatId)
			|| await this.postgresChatService.isOwner(userId, chatId))
			return await this.postgresChatService.unbanUser(toUnban, chatId).catch((err) => {throw err});
		else
			throw new UnauthorizedException("Not authorized to ban this user.")
	}

	async deleteChat(
		userId: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		if (chat.type === EChatType.friends)
			throw new UnauthorizedException("Can't delete a friends chat.")
		if (!await this.postgresChatService.isInChat(userId, chatId))
			throw new UnauthorizedException("You are not in this chat")
		if (await this.postgresChatService.isOwner(userId, chatId)) {
			return await this.postgresChatService.deleteChat(chatId);
		}
		else
			throw new UnauthorizedException("Not authorized to delete this chat.")
	}
}