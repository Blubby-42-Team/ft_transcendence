import { Controller, Param, Body, Post, Get, Patch, Delete } from '@nestjs/common';
import { DTO_getUserById, DTO_chatFormat, DTO_chatRequest, DTO_chatAddUser, DTO_chatRemoveUser, DTO_chatAddAdmin, DTO_banUser, DTO_unbanUser, DTO_getChatById, DTO_protectedChatFormat, DTO_chatPassword } from './chat.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { ChatService } from './chat.service';
import { log } from 'console';
import { EChatType } from '@shared/types/chat';

@Controller('chat')
export class ChatController {

	constructor (
		private readonly chatService: ChatService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Post('/:id')
	async createChat(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_chatFormat,
	) {
		log(`Create chat by user id ${params.id}`);
		return await this.chatService.createChat(params.id, body.type, body.name);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Post('/:id/protected')
	async createChatProtected(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_protectedChatFormat,
	) {
		log(`Create protected chat by user id ${params.id}`);
		return await this.chatService.createChatProtected(params.id, EChatType.protected, body.name, body.password);
	}
	
	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id')
	async getAllChats(
		@Param() params: DTO_getUserById,
	) {
		log(`get all chats of user ${params.id}`);
		return await this.chatService.getAllChats(params.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id/type/:type')
	async getChats(
		@Param() params: DTO_chatRequest,
	) {
		log(`get chats of user ${params.id}`);
		return await this.chatService.getChats(params.id, params.type);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id/chat/:chatId')
	async getChatById(
		@Param() params: DTO_getChatById,
	) {
		log(`get chat ${params.chatId}`);
		return await this.chatService.getChatById(params.id, params.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id/is_in/:chatId')
	async isInChat(
		@Param() params: DTO_getChatById,
	) {
		log(`get chat ${params.chatId}`);
		return await this.chatService.isInChat(params.id, params.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id/add')
	async addInChat(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_chatAddUser,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.addInChat(params.id, body.friendId, body.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Delete('/:id/remove')
	async removeFromChat(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_chatRemoveUser,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.removeFromChat(params.id, body.toRemoveId, body.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Delete('/:id/leave')
	async leaveChat(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_getUserById,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.leaveChat(params.id, body.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id/admin_add')
	async addAdmin(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_chatAddAdmin,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.addAdmin(params.id, body.toAdd, body.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Delete('/:id/admin_remove')
	async removeAdmin(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_chatRemoveUser,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.removeAdmin(params.id, body.toRemoveId, body.chatId);
	}
	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id/ban')
	async banUser(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_banUser,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.banUser(params.id, body.toBan, body.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Delete('/:id/unban')
	async unbanUser(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_unbanUser,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.unbanUser(params.id, body.toUnban, body.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Delete('/:id/delete')
	async deleteChat(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_getUserById,
	) {
		log(`delete chat ${body.id}`);
		return await this.chatService.deleteChat(params.id, body.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id/join/:chatId')
	async joinChat(
		@Param() params: DTO_getChatById,
	) {
		log(`join chat ${params.chatId}`);
		return await this.chatService.joinChat(params.id, params.chatId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id/join_protected/:chatId')
	async joinChatProtected(
		@Param() params: DTO_getChatById,
		@Body() body: DTO_chatPassword,
	) {
		log(`join chat ${params.chatId}`);
		return await this.chatService.joinChatProtected(params.id, params.chatId, body.password);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id/change_type/:chatId')
	async changeType(
		@Param() params: DTO_getChatById,
		@Body() body: DTO_chatPassword,
	) {
		log(`join chat ${params.chatId}`);
		return await this.chatService.changeType(params.id, params.chatId, body.password);
	}
}
