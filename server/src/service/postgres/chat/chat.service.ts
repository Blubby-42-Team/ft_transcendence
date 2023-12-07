import { Injectable, Logger, NotFoundException, InternalServerErrorException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetadataAlreadyExistsError, Repository } from 'typeorm';
import { User } from '../../../model/user/user.class';
import { Chat } from '../../../model/chat/chat.class';
import { EChatType } from '@shared/types/chat';
import { PostgresUserService } from "../user/user.service"


@Injectable()
export class PostgresChatService {

	private readonly logger = new Logger(PostgresChatService.name);

	constructor (
		@InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
		@Inject(forwardRef(() => PostgresUserService))
		private readonly postgresUserService: PostgresUserService,
	  ) {}

	async createChat(
			user: User,
			type: EChatType,
			name: string
		) {
		let chat = new Chat;
		chat.users = [];
		chat.users.push(user);
		chat.type = type;
		chat.name = name;
		chat.messages = [];
		chat.chat_picture = 'DEFAULT';
		
		await this.chatRepository.save(chat)
		.catch((err) => {
			this.logger.debug("Could not create");
			throw new InternalServerErrorException("Could not create");
		})
		return chat
	}

	async getChats(
			user: User,
			type: EChatType,
		) {
		this.logger.log(user, type);
		return await this.chatRepository.query(`
			SELECT
				ch.id,
				ch.name,
				ch.chat_picture
			FROM chat ch
			JOIN custom_users_chat cuc ON ch.id = cuc.chat_id
			WHERE cuc.user_id = $1
			AND ch.type = $2`,
			[user.id, type]
		)
		.catch((err) => {
			this.logger.debug("Could not get chats");
			throw new InternalServerErrorException("Could not get chats");
		})
		.then((res) => {
			return res;
		})
	}

	async getChatById(
		chatId: number,
		userId: number,
		): Promise<Chat> {
		return await this.chatRepository.query(`
			SELECT 
			c.id AS chat_id,
			c.name AS chat_name,
			c.type AS chat_type,
			c.chat_picture,
			json_agg(DISTINCT json_build_object(
				'userId', usr.id,
				'userName', usr.display_name
			)::jsonb) AS users,
			json_agg(DISTINCT json_build_object(
				'messageId', msg.id,
				'userId', msg."userId",
				'content', msg.content,
				'type', msg.type
			)::jsonb) AS messages
			FROM 
				public.chat AS c
			LEFT JOIN 
				messages AS msg ON msg."chatId" = c.id
			LEFT JOIN 
				custom_users_chat AS cuc ON cuc.chat_id = c.id
			LEFT JOIN 
				public.user AS usr ON usr.id = cuc.user_id
			WHERE 
				c.id = $1
			GROUP BY 
				c.id, c.name, c.type, c.chat_picture;`,
			[chatId],
		)
		.catch((err) => {
			this.logger.debug("Could not get chat: " + err);
			throw new InternalServerErrorException("Could not get chat by id:" + err);
		})
		.then(async (res) => {
			if (!res[0])
				throw new NotFoundException(`No chat with id ${chatId}`)
			let chat = new Chat;
			chat.chat_picture = res[0].chat_picture;
			chat.id = res[0].chat_id;
			chat.messages = [];
			for (const msg of res[0].messages) {
				if (!(await this.postgresUserService.isInBlacklistById(userId, msg.userId)) && msg.type !== null) {
					chat.messages.push(msg);
				}
			}
			chat.name = res[0].chat_name;
			chat.type = res[0].chat_type;
			chat.users = [];
			res[0].users.forEach((usr) => {
				chat.users.push(usr)
			})
			if (chat.type === EChatType.friends) {
				chat.users.forEach((usr: any) => {
					if (usr.userId !== userId) {
						console.log(usr)
						chat.name = usr.userName;
					}
				})
			}
			return chat;
		})
	}

	async changeChatType(
		chat: Chat,
		type: EChatType
		) {
		return this.chatRepository.update(chat.id, {
			type: type
		})
		.catch((err) => {
			this.logger.debug("Could not update chat: " + err);
			throw new InternalServerErrorException("Could not update chat:" + err);
		})
		.then((res) => {
			return res;
		})
	}

	async changeChatName(
		chat: Chat,
		name: string
		) {
		return this.chatRepository.update(chat.id, {
			name: name
		})
		.catch((err) => {
			this.logger.debug("Could not update chat: " + err);
			throw new InternalServerErrorException("Could not update chat:" + err);
		})
		.then((res) => {
			return res;
		})
	}

	async changeChatPicture(
		chat: Chat,
		picture: string
		) {
		return this.chatRepository.update(chat.id, {
			chat_picture: picture
		})
		.catch((err) => {
			this.logger.debug("Could not update chat: " + err);
			throw new InternalServerErrorException("Could not update chat:" + err);
		})
		.then((res) => {
			return res;
		})
	}

	async isInChat(
		userId: number,
		chatId: number
		): Promise<Chat> {
		const res = await this.chatRepository.query(`
			SELECT c.*
			FROM chat c
			JOIN custom_users_chat cuc ON cuc.chat_id = c.id
			WHERE cuc.user_id = $1 AND cuc.chat_id = $2`,
		[userId, chatId],
		)
		console.log(res)
		if (!res[0])
			throw new NotFoundException('Not in chat');
		else
			return res[0];
	}

	async addInChat(
		userId: number,
		chatId: number
		) {
		return await this.chatRepository.query(`
			INSERT INTO custom_users_chat (user_id, chat_id)
			VALUES ($1, $2)
			ON CONFLICT (user_id, chat_id) DO NOTHING;`,
			[userId, chatId],
		)
		.catch((err) => {
			this.logger.debug("Could not add in chat: " + err);
			throw new InternalServerErrorException("Could not add in chat:" + err);
		})
		.then((res) => {
			//if (!res[0])
			//	throw new UnauthorizedException("User already added")
			return 'ok';
		})
	}

	async removeFromChat(
		userId: number,
		chatId: number
		) {
		const res = await this.chatRepository.query(`
			SELECT c.*
			FROM chat c
			JOIN custom_users_chat cuc ON cuc.chat_id = c.id
			WHERE cuc.user_id = $1 AND cuc.chat_id = $2`,
		[userId, chatId],
		)
		console.log(res)
		if (!res[0])
			throw new NotFoundException('Not in chat');
		else
			return 'ok'
	}
}

