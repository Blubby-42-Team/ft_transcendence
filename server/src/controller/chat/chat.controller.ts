import { Controller, Param, Body, Post, Get, Patch } from '@nestjs/common';
import { DTO_getUserById, DTO_chatFormat, DTO_chatRequest, DTO_chatAddUser } from './chat.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { ChatService } from './chat.service';
import { log } from 'console';

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
	@Get('/:id/all')
	async getChats(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_chatRequest,
	) {
		log(`get chats of user ${params.id}`);
		return await this.chatService.getChats(params.id, body.type);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id')
	async getChatById(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_getUserById,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.getChatById(params.id, body.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id/in')
	async isInChat(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_getUserById,
	) {
		log(`get chat ${params.id}`);
		return await this.chatService.isInChat(params.id, body.id);
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
}
