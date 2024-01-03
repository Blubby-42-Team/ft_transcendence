import { BadGatewayException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { EChatType } from '@shared/types/chat';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { Chat } from './chat.class';
import * as bcrypt from 'bcrypt'
import { PostgresMessagesService } from 'src/service/postgres/messages/messages.service';
import { EMsgType } from '@shared/types/messages';

@Injectable()
export class ModelChatService {
	constructor (
		private readonly postgresChatService: PostgresChatService,
		private readonly postgresUserService: PostgresUserService,
		private readonly postgresMessageService: PostgresMessagesService,
	) {}
	
	private readonly logger = new Logger(ModelChatService.name);
	
	async createChat(
			userId: number,
			type: EChatType,
			name: string,
		): Promise<Number> {
		const user = await this.postgresUserService.getUserById(userId);
		return await this.postgresChatService.createChat(user, type, name);
	}

	async createChatProtected(
		userId: number,
		type: EChatType,
		name: string,
		password: string,
	) {
	const user = await this.postgresUserService.getUserById(userId);
	const chatId = await this.postgresChatService.createChat(user, type, name);
	const hash = await this.hashPassword(password);
	await this.postgresChatService.setPassword(chatId, hash);
	return chatId;
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
		const friend = await this.postgresUserService.getUserById(friendId);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		await this.postgresChatService.isInChat(userId, chatId);
		await this.postgresUserService.isInFriendById(userId, friendId)
		if (!await this.postgresChatService.isBan(friendId, chatId)) {
			return await this.postgresChatService.addInChat(friendId, chatId)
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${friend.display_name} joined the chat.`)
				return res;
			})
		}
		else
			throw new UnauthorizedException("This user is banned from the chat.");
	}

	async joinChat (
		userId: number,
		chatId: number,
	) {
		const user = await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatByIdSystem(chatId);
		if ((chat.type === EChatType.public) && !(await this.postgresChatService.isBan(userId, chatId)))
			return await this.postgresChatService.addInChat(userId, chatId)
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} joined the chat.`)
				return res;
			})
		else if (await this.postgresChatService.isBan(userId, chatId))
			throw new UnauthorizedException("You are banned from this chat.");
		else
			throw new UnauthorizedException("You are not allowed to join this chat.");
	}

	async joinChatProtected (
		userId: number,
		chatId: number,
		password: string,
	) {
		const user = await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatByIdSystem(chatId);
		if ((chat.type === EChatType.protected) && !(await this.postgresChatService.isBan(userId, chatId)))
			if (await this.postgresChatService.isGoodPassword(chatId, password))
				return await this.postgresChatService.addInChat(userId, chatId)
				.then(res => {
					if (res === 'ok')
						this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} joined the chat.`)
					return res;
				})
			else
				throw new UnauthorizedException("Wrong password.")
		else if (await this.postgresChatService.isBan(userId, chatId))
			throw new UnauthorizedException("You are banned from this chat.");
		else
			throw new UnauthorizedException("You are not allowed to join this chat.");
	}

	async setPassword (
		userId: number,
		chatId: number,
		password: string,
	) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresChatService.getChatByIdSystem(chatId);
		if (await this.postgresChatService.isOwner(userId, chatId))
			return await this.postgresChatService.setPassword(chatId, password);
		else
			throw new UnauthorizedException("You are not allowed to change the password of this chat.");
	}

	async leaveChat(
		userId: number,
		chatId: number,
	) {
		const user = await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		if (chat.type === EChatType.friends)
			throw new UnauthorizedException("Can't leave a friends chat.")
		await this.postgresChatService.isInChat(userId, chatId).catch((err) => {throw err});
		if (await this.postgresChatService.isOwner(userId, chatId).catch((err) => {throw err})) {
			await this.postgresChatService.removeFromChat(userId, chatId).catch((err) => {throw err});
			let chat = await this.postgresChatService.getChatByIdSystem(chatId);
			let newOwner: number;
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
			return await this.postgresChatService.removeFromChat(userId, chatId)
			.catch((err) => {throw err})
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} left the chat.`)
				return res;
			})
		else
			throw new UnauthorizedException("Not authorized to leave this chat.")
	}

	async removeFromChat(
		userId: number,
		toRemoveId: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		const user = await this.postgresUserService.getUserById(toRemoveId);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		if (chat.type === EChatType.friends) {
			throw new UnauthorizedException("Can't remove someone from your friends chat.")
		}
		await this.postgresChatService.isInChat(userId, chatId).catch((err) => {throw err});
		if (await this.postgresChatService.isAdmin(userId, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isOwner(toRemoveId, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isAdmin(toRemoveId, chatId).catch((err) => {throw err}))
			return await this.postgresChatService.removeFromChat(toRemoveId, chatId)
			.catch((err) => {throw err})
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} has been kicked from the chat.`)
				return res;
			})
		else if (await this.postgresChatService.isOwner(userId, chatId).catch((err) => {throw err}))
			return await this.postgresChatService.removeFromChat(toRemoveId, chatId)
			.catch((err) => {throw err})
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} has been kicked from the chat.`)
				return res;
			})
		else
			throw new UnauthorizedException("Not authorized to remove this user.")
	}

	async addAdmin(
		userId: number,
		toAdd: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		const user = await this.postgresUserService.getUserById(toAdd);
		const chat = await this.postgresChatService.getChatByIdSystem(chatId);
		if (userId === toAdd)
			throw new UnauthorizedException("Can't add yourself to admin position.")
		else if (await this.postgresChatService.isOwner(userId, chatId) && await this.isInChat(toAdd, chatId))
			return await this.postgresChatService.addAdmin(toAdd, chatId)
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} is now an admin.`)
				return res
			})
		else
			throw new UnauthorizedException("You have to be the owner of the chat");
	}

	async removeAdmin(
		userId: number,
		toRemove: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		const user = await this.postgresUserService.getUserById(toRemove);
		const chat = await this.postgresChatService.getChatByIdSystem(chatId);
		if (userId === toRemove)
			throw new UnauthorizedException("Can't remove yourself from admin position.")
		else if (await this.postgresChatService.isOwner(userId, chatId))
			await this.postgresChatService.removeAdmin(toRemove, chatId)
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} is no longer an admin.`)
				return res
			})
		else
			throw new UnauthorizedException("You have to be the owner of the chat.");
	}

	async banUser (
		userId: number,
		toBan: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		const user = await this.postgresUserService.getUserById(toBan);
		const chat = await this.postgresChatService.getChatById(chatId, userId);
		await this.postgresChatService.isInChat(userId, chatId).catch((err) => {throw err});
		if (await this.postgresChatService.isAdmin(userId, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isOwner(toBan, chatId).catch((err) => {throw err})
			&& !await this.postgresChatService.isAdmin(toBan, chatId).catch((err) => {throw err})) {
			await this.postgresChatService.removeFromChat(toBan, chatId)
			return await this.postgresChatService.banUser(toBan, chatId)
			.catch((err) => {throw err})
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} has been ban.`)
				return res
			})
		}
		else if (await this.postgresChatService.isOwner(userId, chatId).catch((err) => {throw err})) {
			await this.postgresChatService.removeFromChat(toBan, chatId)
			await this.postgresChatService.removeAdmin(toBan, chatId);
			return await this.postgresChatService.banUser(toBan, chatId)
			.catch((err) => {throw err})
			.then(res => {
				if (res === 'ok')
					this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `${user.display_name} has been ban.`)
				return res
			})
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
		if (chat.type === EChatType.friends || chat.type === EChatType.inactive)
			throw new UnauthorizedException("Can't delete a friends chat.")
		if (!await this.postgresChatService.isInChat(userId, chatId))
			throw new UnauthorizedException("You are not in this chat")
		if (await this.postgresChatService.isOwner(userId, chatId)) {
			return await this.postgresChatService.deleteChat(chatId);
		}
		else
			throw new UnauthorizedException("Not authorized to delete this chat.")
	}

	async changeType(
		userId: number,
		chatId: number,
		password: string,
	) {
		await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatByIdSystem(chatId);
		if (chat.type !== EChatType.public && chat.type !== EChatType.protected)
			throw new UnauthorizedException("You are not allowed to change the type of this chat.")
		else if (await this.postgresChatService.isOwner(userId, chatId)) {
			if (chat.type === EChatType.public) {
				await this.postgresChatService.setPassword(chatId, password);
				return await this.postgresChatService.changeChatType(chat, EChatType.protected)
				.then(res => {
					if (res === 'ok')
						this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `Chat is now protected.`)
					return res
				})
			}
			else if (chat.type === EChatType.protected)
				return await this.postgresChatService.changeChatType(chat, EChatType.public)
				.then(res => {
					if (res === 'ok')
						this.postgresMessageService.postMessage(null, chat, EMsgType.sys, `Chat is now public.`)
					return res
				})
		}
		else
			throw new UnauthorizedException("You are not the owner of this chat.")
	}

	async hashPassword(
		password: string,
	): Promise<string> {
		try {
			const saltRounds = 12;
		
			const hashedPassword = await bcrypt.hash(password, saltRounds);
		
			return hashedPassword;
		} catch (err) {
			throw new BadGatewayException("Error while hashing: " + err.message);
		}
	}
}