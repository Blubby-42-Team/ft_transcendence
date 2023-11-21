import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User42 } from './user42.class';
import { PostgresUser42Service } from 'src/service/postgres/user42/user42.service';

@Injectable()
export class ModelUser42Service {
	constructor (
		private readonly postgresUser42Service: PostgresUser42Service,
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
			this.logger.debug(`User ${user.login} not found in database, add it`)
			return await this.postgresUser42Service.addUser42(user);
		}
		else {
			this.logger.debug(`User ${user.login} found in database, update it`)
			await this.postgresUser42Service.updateUser42(checkUserExist.id, user);
			return await this.postgresUser42Service.getUser42ById(checkUserExist.id);
		}
	}

	async getUser42ByLogin(login: string): Promise<User42> {
		return await this.postgresUser42Service.getUser42ByLogin(login);
	}

	async getUser42ById(id: number): Promise<User42> {
		return await this.postgresUser42Service.getUser42ById(id);
	}
}

