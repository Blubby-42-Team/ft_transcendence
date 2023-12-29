import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from '../../../model/messages/messages.class';
import { User } from '../../../model/user/user.class';
import { Chat } from '../../../model/chat/chat.class';
import { EMsgType } from '@shared/types/messages';


@Injectable()
export class PostgresMessagesService {

	private readonly logger = new Logger(PostgresMessagesService.name);

	constructor (
		@InjectRepository(Messages) private readonly messagesRepository: Repository<Messages>,
	) {}

	async postMessage(
			user: User,
			chat: Chat,
			type: EMsgType,
			content: string,
		) {
		let msg = new Messages;
		msg.user = user;
		msg.chat = chat;
		msg.type = type;
		msg.content = content;
		msg.date = new Date(Date.now());
		
		return this.messagesRepository.save(msg)
		.catch((err) => {
			this.logger.debug("Could not post message: " + err);
			throw new InternalServerErrorException("Could not post message: " + err);
		})
		.then((res) => {
			return 'ok';
		})
	}
}

