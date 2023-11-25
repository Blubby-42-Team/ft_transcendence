import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.class';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { ModelUser42Service } from './user42.service';
import { validate } from 'class-validator';
import { UserRoleType } from 'src/auth/auth.class';

@Injectable()
export class ModelUserService {
	constructor (
		private readonly postgresUserService: PostgresUserService,
		private readonly modelUser42Service: ModelUser42Service,
	) {}
	
	private readonly logger = new Logger(ModelUserService.name);

	async getUserById(id: number): Promise<User> {
		return await this.postgresUserService.getUserById(id);
	}

	/**
	 * Create or update user with 42 data in database
	 * @param id42 id of 42 user
	 * @param login42 login of 42 user
	 * @param displayName42 display name of 42 user
	 * @param accessToken42 access token of 42 user
	 * @param refreshToken42 refresh token of 42 user
	 * @param userRolse user role, default is UserRoleType.User
	 * @returns id of user in database
	 */
	async addUserWith42data(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
		userRolse: UserRoleType = UserRoleType.User,
	): Promise<number> {
		// First get user from database with 42 id
		const userDb = await this.postgresUserService.getUserBy42Id(id42);
		if (!userDb) {
			this.logger.debug(`User ${login42} not found in database, add it`)
			return await this.postgresUserService.createUserWith42Data(
				id42,
				login42,
				displayName42,
				accessToken42,
				refreshToken42,
			);
		}
		else {
			this.logger.debug(`User ${displayName42} found in database, update it`)
			await this.postgresUserService.updateUserWith42Data(
				userDb.id,
				displayName42,
				UserRoleType.User,
				id42,
				login42,
				accessToken42,
				refreshToken42,
			);
			return await this.postgresUserService.getUserById(userDb.id);
		}

	}

	/**
	 * Add or update user in database
	 * @returns 
	 */
	async addUserPong(user: User): Promise<User> {
	}
}

