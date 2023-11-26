import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { User42 } from './user42.class';
import { PostgresUser42Service } from 'src/service/postgres/user42/user42.service';
import { PostgresUserService } from 'src/service/postgres/user/user.service';

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
	async addOrUpdateUser42(
		id42: number,
		login42: string,
		accessToken42: string,
		refreshToken42: string,
	): Promise<number> {

		// First get user42 from database with 42 id
		return this.postgresUser42Service.getUser42ById(id42)
		.then ((res: User42) => {
			this.logger.debug(`User42 ${login42} found in database, update it`)

			return this.postgresUser42Service.updateUser42(
				id42,
				login42,
				accessToken42,
				refreshToken42,
			)
			.catch((err) => {
				this.logger.error(err);
				throw new BadRequestException(err);
			});
		})
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`User42 ${login42} not found in database, add it`)

				return this.postgresUser42Service.addUser42(
					id42,
					login42,
					accessToken42,
					refreshToken42,
				);
			}

			throw err;
		});
	}
}

