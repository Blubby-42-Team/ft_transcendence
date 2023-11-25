import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User42 } from './user42.class';
import { PostgresUser42Service } from 'src/service/postgres/user42/user42.service';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { User } from './user.class';

@Injectable()
export class ModelUser42Service {
	constructor (
		private readonly postgresUser42Service: PostgresUser42Service,
		private readonly postgresUserService: PostgresUserService,
	) {}
	
	private readonly logger = new Logger(ModelUser42Service.name);

	async getUserById(id: number): Promise<User42> {
		return await this.postgresUser42Service.getUser42ById(id);
	}

	/**
	 * Add user42 in database and return its id
	 * @param id42 42 user id
	 * @param login42 42 user login
	 * @param accessToken42 42 user access token
	 * @param refreshToken42 42 user refresh token
	 * @returns 42 user id from database
	 */
	async addUser42(
		id42: number,
		login42: string,
		accessToken42: string,
		refreshToken42: string,
	): Promise<number> {

		// First get user42 from database with 42 id
		const checkUserExist = await this.postgresUser42Service.getUser42ById(id42);
		if (!checkUserExist) {
			this.logger.debug(`User42 ${login42} not found in database, add it`)
			return await this.postgresUser42Service.addUser42(
				id42,
				login42,
				accessToken42,
				refreshToken42,
			);
		}
		else {
			this.logger.debug(`User42 ${login42} found in database, update it`)
			return await this.postgresUser42Service.updateUser42(
				id42,
				login42,
				accessToken42,
				refreshToken42,
			).catch((err) => {
				this.logger.error(err);
				throw new BadRequestException(err);
			});
		}
	}
}

