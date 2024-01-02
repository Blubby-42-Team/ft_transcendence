import { Injectable, Logger, NotFoundException, InternalServerErrorException, UnauthorizedException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { Repository } from 'typeorm';
import { UserRoleType } from 'src/auth/auth.class';
import { User42 } from 'src/model/user/user42.class';
import { Settings } from 'src/model/settings/settings.class';
import { ETheme } from '@shared/types/settings';
import { Stats } from 'src/model/stats/stats.class';
import { PostgresChatService } from '../chat/chat.service';
import { EChatType } from '@shared/types/chat';


@Injectable()
export class PostgresUserService {

	private readonly logger = new Logger(PostgresUserService.name);

	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		//TODO #79 Need to rework https://docs.nestjs.com/fundamentals/circular-dependency
		@Inject(forwardRef(() => PostgresChatService))
		private readonly postgresChatService: PostgresChatService,
	  ) {}
	
	/**
	 * Get user by id
	 * @param userId id of user
	 * @returns `Promise` user
	 * @throws `NotFoundException` if user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getUserById(userId: number): Promise<User> {
		return this.userRepository.query(`
			SELECT * FROM "user" WHERE id = $1`,
			[userId],
		)
		.catch((err) => {
			this.logger.debug(`Failed to get user by id ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user by id ${userId}`);
		})
		.then((res): User => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user by id ${userId}: not found`);
				throw new NotFoundException(`Failed to get user by id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get user by id ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to get user by id ${userId}: too many results`);
			}
			return res[0];
		})
	}

	async getUserByIdForWilla(userId: number) {
		return this.userRepository.query(`
			SELECT u.id, u.display_name, u.full_name, u.profile_picture, ft.login
			FROM "user" as u
			LEFT JOIN "user42" AS ft
			ON ft.id = u."user42Id"
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err) => {
			this.logger.debug(`Failed to get user by id ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user by id ${userId}`);
		})
		.then((res): User => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user by id ${userId}: not found`);
				throw new NotFoundException(`Failed to get user by id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get user by id ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to get user by id ${userId}: too many results`);
			}
			return res[0];
		})
	}

	async getUserByLogin(login: string) {
		return this.userRepository.query(`
			SELECT u.id, u.display_name, u.full_name, u.profile_picture, ft.login
			FROM "user" as u
			LEFT JOIN "user42" AS ft
			ON ft.id = u."user42Id"
			WHERE ft.login = $1`,
			[login],
		)
		.catch((err) => {
			this.logger.debug(`Failed to get user by login ${login}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user by login ${login}`);
		})
		.then((res): User => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user by login ${login}: not found`);
				throw new NotFoundException(`Failed to get user by login ${login}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get user by login ${login}: too many results`);
				throw new InternalServerErrorException(`Failed to get user by login ${login}: too many results`);
			}
			return res[0];
		})
	}

	/**
	 * Update user in database
	 * @param idUser id of user to update 
	 * @param displayNameUser dipaly name of user
	 * @param roleUser role of user
	 * @returns `Promise` 'ok' if success
	 * @throws `NotFoundException` if user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async updateUser (
		idUser: number,
		displayNameUser: string,
		roleUser: UserRoleType,
		profile_picture_user: string,
	) {
		return this.userRepository.update(idUser, {
			display_name: displayNameUser,
			role: roleUser,
			profile_picture: profile_picture_user, 
		})
		.catch((err) => {
			this.logger.debug(`Failed to update User ${idUser}: ${err}`);
			throw new InternalServerErrorException(`Failed to update User ${idUser}`);
		})
		.then((res)=> {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update User ${idUser}: ${res}`);
				throw new NotFoundException(`Failed to update User ${idUser}`);
			}
			return 'ok';
		})
	}

	/**
	 * Get user by 42 id
	 * @param id42 id of 42 user
	 * @returns `Promise` user
	 * @throws `NotFoundException` if user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getUserBy42Id(id42: number): Promise<User> {
		return this.userRepository.query(`
			SELECT * FROM "user" WHERE "user42Id" = $1`,
			[id42]
		)
		.catch((err) => {
			this.logger.debug(`Failed to get user by 42 id ${id42}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user by 42 id ${id42}`);
		})
		.then((res): User => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user by 42 id ${id42}: not found`);
				throw new NotFoundException(`Failed to get user by 42 id ${id42}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get user by 42 id ${id42}: too many results`);
				throw new InternalServerErrorException(`Failed to get user by 42 id ${id42}: too many results`);
			}
			return res[0];
		})
	}

	/**
	 * Get user roles by id
	 * @param userId id of user
	 * @returns `Promise` user roles
	 * @throws `NotFoundException` if user not found
	 */
	async getUserRoleById(userId: number): Promise<string> {
		return this.userRepository.query(`
			SELECT "role" FROM "user" WHERE id = $1`,
			[userId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to get user role by id ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user role by id ${userId}`);
		})
		.then((res): string => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user role by id ${userId}: not found`);
				throw new NotFoundException(`Failed to get user role by id ${userId}: not found`);
			}
			return res[0].role;
		})
	}

	/**
	 * Create user with 42 data in database
	 * @param id42 id of 42 user
	 * @param login42 login of 42 user
	 * @param displayName42 display name of 42 user
	 * @param accessToken42 access token of 42 user
	 * @param refreshToken42 refresh token of 42 user
	 * @returns `Promise` id of user in database
	 */
	async createUserWith42Data(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
	): Promise<number> {
		const user42 = new User42();
		user42.id = id42;
		user42.login = login42;
		user42.accessToken = accessToken42;
		user42.refreshToken = refreshToken42;

		const settings = new Settings();
		settings.theme = ETheme.Light;
		settings.sound = true;

		const stats = new Stats();
		stats.played_matchs = 0;
		stats.classic_match_won = 0;
		stats.classic_match_lost = 0;
		stats.classic_match_points_won = 0;
		stats.classic_match_points_lost = 0;
		stats.classic_mmr = 1000;
		stats.random_match_won = 0;
		stats.random_match_lost = 0;
		stats.random_match_points_won = 0;
		stats.random_match_points_lost = 0;
		stats.random_mmr = 1000;

		const user = new User();
		user.display_name = login42;
		user.full_name = displayName42;
		user.role = UserRoleType.User;
		user.profile_picture = '/pp.png';
		user.user42 = user42;
		user.settings = settings;
		user.stats = stats;

		return this.userRepository.save(user)
		.then((res: User): number=> {
			return res.id;
		})
	}

	async getFriendsById(userId: number) {
		await this.getUserById(userId);
		return this.userRepository.query(`
			SELECT
				f.id, f.display_name, f.profile_picture
			FROM
				"user" AS u
			JOIN
				custom_user_friends uf ON u.id = uf.user_id
			JOIN
				"user" f ON f.id = uf.friend_id
			WHERE
				u.id = $1`,
			[userId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to get friends by id ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get friends by id ${userId}`);
		})
	}

	async addFriendById(id: number, friendId: number) {
		const user = await this.getUserById(id);
		const friend = await this.getUserById(friendId);

		await this.userRepository.query(`
			INSERT INTO custom_user_friends (user_id, friend_id)
			VALUES ($1, $2)
			ON CONFLICT (user_id, friend_id) DO NOTHING;
		`,
		[id, friendId])

		await this.userRepository.query(`
			INSERT INTO custom_user_friends (user_id, friend_id)
			VALUES ($2, $1)
			ON CONFLICT (user_id, friend_id) DO NOTHING;
		`,
		[id, friendId])

		const chatList = await this.userRepository.query(`
			SELECT *
			FROM chat AS c
			WHERE
				c.id IN (
					SELECT chat_id
					FROM "custom_users_chat"
					WHERE user_id = $1
					INTERSECT
					SELECT chat_id
					FROM "custom_users_chat"
					WHERE user_id = $2
				)
				AND c."type" = 'inactive';`,
			[id, friendId]
		)
		.catch((err) => {
			throw err
		});
		console.log(chatList)
		let chat;
		if (chatList.length === 0){
			chat = await this.postgresChatService.createChat(await this.getUserById(id), EChatType.friends, 'friends')
		}
		else {
			this.userRepository.query(`
				UPDATE "chat" as c
				SET "type" = 'friends'
				WHERE
					c.id IN (
						SELECT chat_id
						FROM "custom_users_chat"
						WHERE user_id = $1
						INTERSECT
						SELECT chat_id
						FROM "custom_users_chat"
						WHERE user_id = $2
					)
					AND c."type" = 'inactive';
			`,
			[id, friendId])
			.catch((err) => {
				throw err
			});
			return 'ok'
		}
		await this.postgresChatService.addInChat(friendId, chat.id)
		return 'ok'
	}

	async deleteFriendById(id: number, friendId: number) {
		await this.getUserById(id);
		await this.getUserById(friendId);

		this.userRepository.query(`
			DELETE FROM custom_user_friends
			WHERE custom_user_friends.user_id = $1
			AND custom_user_friends.friend_id = $2`,
			[id, friendId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to delete friend by id ${id}: ${err}`);
			throw new InternalServerErrorException(`Failed to delete friend by id ${id}`);
		})
		this.userRepository.query(`
			DELETE FROM custom_user_friends
			WHERE custom_user_friends.user_id = $2
			AND custom_user_friends.friend_id = $1`,
			[id, friendId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to delete friend by id ${id}: ${err}`);
			throw new InternalServerErrorException(`Failed to delete friend by id ${id}`);
		})
		this.userRepository.query(`
			UPDATE chat
			SET type = 'inactive'
			WHERE id IN (
				SELECT cuc.chat_id
				FROM custom_user_friends cuf
				JOIN custom_users_chat cuc ON cuf.user_id = cuc.user_id
				WHERE (cuf.user_id = $1 AND cuf.friend_id = $2)
				OR (cuf.user_id = $2 AND cuf.friend_id = $1)
				AND chat."type" = 'friends'
			);`,
		[id, friendId])
		.catch((err) => {
			this.logger.debug(`Failed to delete friend by id ${id}: ${err}`);
			throw new InternalServerErrorException(`Failed to delete friend by id ${id}`);
		})
		return 'ok'
	}

	async isInFriendById(id: number, friendId: number) {
		const friends = await this.getFriendsById(id);
		let is_in = false

		friends.forEach(friend => {
			if (friend.id === friendId) {
				is_in = true;
			}
		});
		if (!is_in)
			throw new NotFoundException(friendId + ' is not a friend.')
		return 'ok';
	}

	async getWhitelistById(userId: number): Promise<Array<{"id": number}>> {
		await this.getUserById(userId);
		return this.userRepository.query(`
			SELECT
				w.id
			FROM
				"user" AS u
			JOIN
				custom_user_whitelist uw ON u.id = uw.user_id
			JOIN
				"user" w ON w.id = uw.whitelist_id
			WHERE
				u.id = $1`,
			[userId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to get whitelist by id ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get whitelist by id ${userId}`);
		})
		.then((res) => {
			return res
		})
	}

	async addWhitelistById(id: number, whitelistId: number) {
		const user = await this.getUserById(id);
		const protec = await this.getUserById(whitelistId);
		let whitelist = await this.getWhitelistById(protec.id)
		let reciprocity = false

		if (whitelist) {
			whitelist.forEach((whitelisted) => {
				if (whitelisted.id === id) {
					reciprocity = true;
				}
			});
		}
		if (!reciprocity) {
			this.userRepository.query(`
			INSERT INTO custom_user_whitelist (user_id, whitelist_id)
			VALUES ($1, $2)
			ON CONFLICT (user_id, whitelist_id) DO NOTHING;
			`,
			[id, whitelistId])

		}
		else {
			await this.addFriendById(id, whitelistId);
			this.userRepository.query(`
				DELETE FROM custom_user_whitelist
				WHERE custom_user_whitelist.user_id = $1
				AND custom_user_whitelist.whitelist_id = $2`,
				[id, whitelistId]
			).catch((err) => {
				return err
			})
			this.userRepository.query(`
				DELETE FROM custom_user_whitelist
				WHERE custom_user_whitelist.user_id = $2
				AND custom_user_whitelist.whitelist_id = $1`,
				[id, whitelistId]
			).catch((err) => {
				throw err
			})
		}
		return 'ok'
	}

	async getBlacklistById(userId: number): Promise<Array<{"id": number}>> {
		await this.getUserById(userId);
		return this.userRepository.query(`
			SELECT
				w.id
			FROM
				"user" AS u
			JOIN
				custom_user_blacklist uw ON u.id = uw.user_id
			JOIN
				"user" w ON w.id = uw.blacklist_id
			WHERE
				u.id = $1`,
			[userId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to get blacklist by id ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get blacklist by id ${userId}`);
		})
		.then((res) => {
			return res
		})
	}

	async addBlacklistById(id: number, blacklistId: number) {
		const user = await this.getUserById(id);
		const blacklist = await this.getUserById(blacklistId);

		if (id === blacklistId)
			throw new UnauthorizedException("Can't add yourself to the block list.")
		if (await this.isInBlacklistById(id, blacklistId)) {
			throw new UnauthorizedException("Already in block list.")
		}

		if (!user.blacklist) {
			user.blacklist = [];
			user.blacklist.push(blacklist);
		}
		else
			user.blacklist.push(blacklist);
		this.userRepository.save(user)
		.catch((err) => {
			return err
		});
		this.userRepository.query(`
			DELETE FROM custom_user_friends
			WHERE user_id = $1 AND friend_id = $2
		`,
		[id, blacklistId])
		.catch((err) => {
			return err
		});
		this.userRepository.query(`
			DELETE FROM custom_user_friends
			WHERE user_id = $2 AND friend_id = $1
		`,
		[id, blacklistId])
		.catch((err) => {
			return err
		})
		this.userRepository.query(`
			DELETE FROM custom_user_whitelist
			WHERE user_id = $1 AND whitelist_id = $2
		`,
		[id, blacklistId])
		.catch((err) => {
			return err
		})

		this.userRepository.query(`
			UPDATE "chat" as c
			SET "type" = 'inactive'
			WHERE
				c.id IN (
					SELECT chat_id
					FROM "custom_users_chat"
					WHERE user_id = $1
					INTERSECT
					SELECT chat_id
					FROM "custom_users_chat"
					WHERE user_id = $2
				)
				AND c."type" = 'friends'
			`,
			[id, blacklistId])
		return 'ok'	
	}

	async deleteBlacklistById(id: number, blacklistId: number) {
		await this.getUserById(id);
		await this.getUserById(blacklistId);
		if (id === blacklistId)
			throw new UnauthorizedException("Can't remove yourself to the block list.")
		this.userRepository.query(`
			DELETE FROM custom_user_blacklist
			WHERE custom_user_blacklist.user_id = $1
			AND custom_user_blacklist.blacklist_id = $2`,
			[id, blacklistId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to delete blacklist by id ${id}: ${err}`);
			throw new InternalServerErrorException(`Failed to delete blacklist by id ${id}`);
		})
		.then((res) => {
			if (!res[0]) {
				this.logger.debug(`Blacklisted ${blacklistId}: not found`);
				throw new NotFoundException(`Blacklisted ${blacklistId}: not found`);
			}
		})
		return 'ok';
	}

	async isInBlacklistById(id: number, blacklistId: number): Promise<Boolean> {
		const blacklist = await this.getBlacklistById(id);
		let is_in = false

		if (blacklist.length === 0)
			return is_in
		blacklist.forEach(user => {
			if (user.id === blacklistId) {
				is_in = true;
			}
		});
		return is_in;
	}
}