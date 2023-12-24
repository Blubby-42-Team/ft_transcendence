import { Controller, Param, Body, Post } from '@nestjs/common';
import { DTO_getUserById, DTO_messageFormat } from './messages.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { MessagesService } from './messages.service';
import { log } from 'console';

@Controller('messages')
export class MessagesController {

	constructor (
		private readonly messagesService: MessagesService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Post('/:id')
	async postMessage(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_messageFormat,
	) {
		log(`Post message by user id ${params.id}`);
		return await this.messagesService.postMessage(params.id, body.chatId, body.type, body.content);
	}
}
