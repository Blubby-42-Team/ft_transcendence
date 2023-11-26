import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './user.class';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { ModelUser42Service } from './user42.service';
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
	 * @param userRole user role, default is UserRoleType.User
	 * @returns id of user in database
	 */
	async addOrUpdateUserWith42data(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
		userRole: UserRoleType = UserRoleType.User,
	): Promise<number> {
		// First get user from database with 42 id
		return await this.postgresUserService.getUserBy42Id(id42)
		.then (async (res: User) => {
			this.logger.debug(`User ${res.displayName} found in database, update it`)

			/**
			 * //TODO @Matthew-Dreemurr only update user roles with new method (like updateUserRoles)
			 */

			//check if user role is admin
			if (res.role === UserRoleType.Admin) {
				this.logger.warn(`User ${res.displayName} is ${res.role} in the db, keep it ${res.role}`)
				userRole = UserRoleType.Admin;
			}

			await this.postgresUserService.updateUser(
				res.id,
				res.displayName,
				userRole,
			);

			await this.modelUser42Service.addOrUpdateUser42(
				id42,
				login42,
				accessToken42,
				refreshToken42,
			);
			return res.id;
		})
		.catch( async (err) => {
			// If user not found in database, create it
			if (err instanceof NotFoundException) {
				this.logger.debug(`User ${login42} not found in database, add it`)

				return await this.postgresUserService.createUserWith42Data(
					id42,
					login42,
					displayName42,
					accessToken42,
					refreshToken42,
				);
			}
			throw err;
		})
	}
}

