import { Injectable, Logger, NotFoundException, InternalServerErrorException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../model/user/user.class';
import { Chat } from '../../../model/chat/chat.class';
import { EChatType } from '@shared/types/chat';
import { PostgresUserService } from "../user/user.service";
import * as bcrypt from 'bcrypt'


@Injectable()
export class PostgresChatService {

	private readonly logger = new Logger(PostgresChatService.name);

	constructor (
		@InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
		//TODO #79 Need to rework https://docs.nestjs.com/fundamentals/circular-dependency
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
		chat.owner = user;
		chat.admins = [];
		chat.admins.push(user);
		chat.chat_picture = '/chat_default.png';
		chat.blacklist = [];
		chat.password = "default";
		
		await this.chatRepository.save(chat)
		.catch((err) => {
			this.logger.debug("Could not create");
			throw new InternalServerErrorException("Could not create");
		})
		return chat
	}

	async deleteChat(
		chatId: number
	) {
		await this.chatRepository.query(`
			DELETE FROM chat
			WHERE chat.id = $1`,
			[chatId])
		.catch((err) => {
			this.logger.debug("Could not delete chat");
			throw new InternalServerErrorException("Could not delete chat");
		})
		return 'ok'
	}

	async updateOwner(
		newOwner: number,
		chatId: number
	) {
		this.chatRepository.query(`
			UPDATE chat
			SET "ownerId" = $1
			WHERE chat.id = $2;
		`,
		[newOwner, chatId])
		.catch(err => {
			throw err
		})
		return 'ok'
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
				ch.chat_picture,
				ch.type
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

	async getAllChats(
		user: User,
	) {
	return await this.chatRepository.query(`
		SELECT * FROM (
			SELECT
				ch.id,
				ch.name,
				ch.chat_picture,
				ch.type
			FROM chat AS ch
			JOIN custom_users_chat AS cuc
				ON ch.id = cuc.chat_id
			WHERE cuc.user_id = $1
				AND ch.type != 'inactive'
				AND ch.type != 'friends'
		)
		UNION
		SELECT * FROM (
			SELECT 
				ch.id,
				cu2.display_name as name,
				cu2.profile_picture as chat_picture,
				ch.type
			FROM chat AS ch
			JOIN custom_users_chat AS cuc
				ON ch.id = cuc.chat_id
			JOIN "user" AS cu
				ON cuc.user_id = cu.id
			JOIN custom_users_chat AS cuc2
				ON ch.id = cuc2.chat_id
			JOIN "user" AS cu2
				ON cuc2.user_id = cu2.id
			WHERE cuc.user_id = $1
				AND ch.type = 'friends'
				AND cuc2.user_id != $1
			);`,
		[user.id]
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
	) {
		return await this.chatRepository.query(`
		SELECT
			c.id AS chat_id,
			c.name AS chat_name,
			c.type AS chat_type,
			c.chat_picture,
			c."ownerId" AS owner,
			json_agg(DISTINCT json_build_object(
				'userId', usr.id,
				'userName', usr.display_name,
				'profile_picture', usr.profile_picture
			)::jsonb) AS users,
			json_agg(DISTINCT usr_admin.id) AS admins,
			json_agg(DISTINCT usr_blacklist.id) AS blacklist,
			(
				SELECT jsonb_agg(
					json_build_object(
						'messageId', msg.id,
						'userId', msg."userId",
						'content', msg.content,
						'type', msg.type,
						'date', msg.date
					) ORDER BY msg.id
				)
				FROM (
					SELECT DISTINCT ON (m.id)
						m.id,
						m."userId",
						m.content,
						m.type,
						m.date
					FROM messages m
					WHERE m."chatId" = c.id
					ORDER BY m.id, m."userId"
				) AS msg
			) AS messages
		FROM public.chat AS c
		LEFT JOIN custom_users_chat AS cuc
			ON cuc.chat_id = c.id
		LEFT JOIN custom_admins_chat AS cac
			ON cac.chat_id = c.id
		LEFT JOIN custom_blacklist_chat AS cbc
			ON cbc.chat_id = c.id
		LEFT JOIN public.user AS usr
			ON usr.id = cuc.user_id
		LEFT JOIN public.user AS usr_admin
			ON usr_admin.id = cac.admin_id
		LEFT JOIN public.user AS usr_blacklist
			ON usr_blacklist.id = cbc.blacklist_id
		WHERE c.id = $1
		GROUP BY c.id, c.name, c.type, c.chat_picture, c."ownerId";`,
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
			if (res[0].messages) {
				for (const msg of res[0].messages) {
					if (!(await this.postgresUserService.isInBlacklistById(userId, msg.userId)) && msg.type !== null) {
						chat.messages.push(msg);
					}
				}
			}
			chat.name = res[0].chat_name;
			chat.owner = res[0].owner;
			chat.type = res[0].chat_type;
			chat.users = [];
			res[0].users.forEach((usr) => {
				chat.users.push(usr)
			})
			chat.admins = [];
			res[0].admins.forEach((usr) => {
				chat.admins.push(usr)
			})
			chat.blacklist = [];
			res[0].blacklist.forEach((usr) => {
				if (usr !== null && usr.userId !== null)
					chat.blacklist.push(usr)
			})
			if (chat.type === EChatType.friends) {
				chat.users.forEach((usr: any) => {
					if (usr.userId !== userId) {
						chat.name = usr.userName;
						chat.chat_picture = usr.profile_picture;
					}
				})
			}
			return chat;
		})
	}

	async getChatByIdSystem(
		chatId: number,
		) {
		return await this.chatRepository.query(`
		SELECT
			c.id AS chat_id,
			c.name AS chat_name,
			c.type AS chat_type,
			c.chat_picture,
			c."ownerId" AS owner,
			json_agg(DISTINCT json_build_object(
				'id', usr.id,
				'userName', usr.display_name,
				'profile_picture', usr.profile_picture
			)::jsonb) AS users,
			json_agg(DISTINCT json_build_object(
				'id', usr_admin.id,
				'userName', usr_admin.display_name,
				'profile_picture', usr_admin.profile_picture
			)::jsonb) AS admins,
			json_agg(DISTINCT json_build_object(
				'id', usr_blacklist.id,
				'userName', usr_blacklist.display_name,
				'profile_picture', usr_blacklist.profile_picture
			)::jsonb) AS blacklist,
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
			custom_admins_chat AS cac ON cac.chat_id = c.id
		LEFT JOIN
			custom_blacklist_chat AS cbc ON cbc.chat_id = c.id
		LEFT JOIN 
			public.user AS usr ON usr.id = cuc.user_id
		LEFT JOIN 
			public.user AS usr_admin ON usr_admin.id = cac.admin_id
		LEFT JOIN 
			public.user AS usr_blacklist ON usr_blacklist.id = cbc.blacklist_id
		WHERE
			c.id = $1
		GROUP BY 
			c.id, c.name, c.type, c.chat_picture, c."ownerId"`,
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
			for (const msg of res[0].messages)
				chat.messages.push(msg);
			chat.name = res[0].chat_name;
			chat.owner = await this.postgresUserService.getUserById(res[0].owner);
			chat.type = res[0].chat_type;
			chat.users = [];
			res[0].users.forEach((usr) => {
				if (usr.id !== null)
					chat.users.push(usr)
			})
			chat.admins = [];
			res[0].admins.forEach((usr) => {
				if (usr.id !== null)
					chat.admins.push(usr)
			})
			chat.blacklist = [];
			res[0].blacklist.forEach((usr) => {
				if (usr.id !== null)
					chat.blacklist.push(usr)
			})
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
			return 'ok';
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
			return 'ok';
		})
	}

	async removeFromChat(
		userId: number,
		chatId: number
		) {
		await this.chatRepository.query(`
			DELETE FROM custom_users_chat
			WHERE user_id = $1 AND chat_id = $2;`,
		[userId, chatId],
		).catch((err) => {
			throw err
		})
		await this.chatRepository.query(`
			DELETE FROM custom_admins_chat
			WHERE admin_id = $1 AND chat_id = $2;`,
		[userId, chatId],
		).catch((err) => {
			throw err
		})
		return 'ok'
	}

	async isAdmin(
			userId: number,
			chatId: number,
	) {
		let is_in = false;

		let chat = await this.getChatByIdSystem(chatId);
		let user = await this.postgresUserService.getUserById(userId);
		console.log(chat.admins, " ==>> ", user.id)
		chat.admins.forEach(usr => {
			if (usr.id === user.id)
				is_in = true;
		});
		return is_in;
	}

	async isOwner(
		userId: number,
		chatId: number,
	) {
		let chat = await this.getChatByIdSystem(chatId);
		await this.postgresUserService.getUserById(userId);
		return (userId === chat.owner.id);
	}

	async addAdmin(
		userId: number,
		chatId: number
		) {
		return await this.chatRepository.query(`
			INSERT INTO custom_admins_chat (admin_id, chat_id)
			VALUES ($1, $2)
			ON CONFLICT (admin_id, chat_id) DO NOTHING;`,
			[userId, chatId],
		)
		.catch((err) => {
			this.logger.debug("Could not add in admins: " + err);
			throw new InternalServerErrorException("Could not add in admins:" + err);
		})
		.then((res) => {
			return 'ok';
		})
	}

	async removeAdmin(
		userId: number,
		chatId: number
		) {
		await this.chatRepository.query(`
			DELETE FROM custom_admins_chat
			WHERE admin_id = $1 AND chat_id = $2;`,
		[userId, chatId],
		).catch((err) => {
			throw err
		})
		return 'ok'
	}

	async banUser(
		userId: number,
		chatId: number
		) {
		return await this.chatRepository.query(`
			INSERT INTO custom_blacklist_chat (blacklist_id, chat_id)
			VALUES ($1, $2)
			ON CONFLICT (blacklist_id, chat_id) DO NOTHING;`,
			[userId, chatId],
		)
		.catch((err) => {
			this.logger.debug("Could not ban user: " + err);
			throw new InternalServerErrorException("Could not ban user:" + err);
		})
		.then((res) => {
			return 'ok';
		})
	}

	async unbanUser(
		userId: number,
		chatId: number
		) {
		await this.chatRepository.query(`
			DELETE FROM custom_blacklist_chat
			WHERE blacklist_id = $1 AND chat_id = $2;`,
		[userId, chatId],
		).catch((err) => {
			throw err
		})
		return 'ok'
	}

	async isBan(
		userId: number,
		chatId: number,
	) {
		let is_in = false;

		let chat = await this.getChatByIdSystem(chatId);
		let user = await this.postgresUserService.getUserById(userId);
		chat.blacklist.forEach(usr => {
			if (usr.id === user.id)
				is_in = true;
		});
		return is_in;
	}

	async setPassword(
		chatId: number,
		password: string,
	) {
		return this.chatRepository.update(chatId, {
			password: password
		})
		.catch((err) => {
			this.logger.debug("Could not update chat: " + err);
			throw new InternalServerErrorException("Could not update chat:" + err);
		})
		.then((res) => {
			return res;
		})
	}

	async getPassword(
		chatId: number,
	) {
		const res = await this.chatRepository.query(`
			SELECT chat.password
			FROM chat
			WHERE chat.id = $1
		`,
		[chatId]);
		return res[0].password;
	}

	async isGoodPassword(
		chatId: number,
		password: string,
	) {
		const password_db = await this.getPassword(chatId);
		console.log(password_db)
		return await bcrypt.compare(password, password_db)
		.catch(err => {
			throw new InternalServerErrorException("Failed to compare passwords: " + err);
		})
	}
}
