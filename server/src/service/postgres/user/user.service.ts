import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { Repository } from 'typeorm';
import { UserRoleType } from 'src/auth/auth.class';
import { User42 } from 'src/model/user/user42.class';
import { Settings } from 'src/model/settings/settings.class';
import { ETheme } from '@shared/types/settings';
import { Stats } from 'src/model/stats/stats.class';

@Injectable()
export class PostgresUserService {

	private readonly logger = new Logger(PostgresUserService.name);

	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
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
		user.display_name = displayName42;
		user.role = UserRoleType.User;
		user.profile_picture = 'TEMP';
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
				f.id
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

		if (!user.friends) {
			user.friends = [];
			user.friends.push(friend);
		}
		else
			user.friends.push(friend);

		const add = new User
		add.id = user.id
		if (!friend.friends) {
			friend.friends = [];
			friend.friends.push(add);
		}
		else
			friend.friends.push(add);
		this.userRepository.save(friend)
		.catch((err) => {
			return err
		});
		this.userRepository.save(user)
		.catch((err) => {
			return err
		});
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
		return this.userRepository.query(`
			DELETE FROM custom_user_friends
			WHERE custom_user_friends.user_id = $2
			AND custom_user_friends.friend_id = $1`,
			[id, friendId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to delete friend by id ${id}: ${err}`);
			throw new InternalServerErrorException(`Failed to delete friend by id ${id}`);
		})
		.then((res) => {
			if (!res[1]) {
				this.logger.debug(`Friendship with friend ${friendId}: not found`);
				throw new NotFoundException(`Friendship with friend ${friendId}: not found`);
			}
			return 'ok';
		})
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
			if (!user.whitelist) {
				user.whitelist = [];
				this.logger.debug("HERE")
				user.whitelist.push(protec);
			}
			else
				user.whitelist.push(protec);
			this.userRepository.save(user)
			.catch((err) => {
				return err
			})
		}
		else {
			await this.addFriendById(id, whitelistId);
			this.userRepository.save(whitelist)
			.catch((err) => {
				return err
			})
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
				return err
			})
		}
		return 'ok'
	}
}