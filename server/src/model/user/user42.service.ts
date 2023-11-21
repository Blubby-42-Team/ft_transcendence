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
	 * Add or update user in database
	 * @requires User
	 * @returns 
	 */
	async addUser42(user: User42): Promise<User42> {
		const checkUserExist = await this.postgresUser42Service.getUser42ById(user.id);
		if (!checkUserExist) {
			this.logger.debug(`User42 ${user.login} not found in database, add it`)
			return await this.postgresUser42Service.addUser42(user);
		}
		else {
			this.logger.debug(`User42 ${user.login} found in database, update it`)
			await this.postgresUser42Service.updateUser42(user.id, user)
			.catch((err) => {
				this.logger.error(err);
				throw new BadRequestException(err);
			});
			return await this.postgresUser42Service.getUser42ById(checkUserExist.id);
		}
	}
}

