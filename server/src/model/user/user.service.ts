import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.class';
import { PostgresUserService } from 'src/service/postgres/user/user.service';

@Injectable()
export class ModelUserService {
	constructor (
		private readonly postgresUserService: PostgresUserService,
	) {}
	
	private readonly logger = new Logger(ModelUserService.name);

	async getUserById(id: number): Promise<User> {
		return await this.postgresUserService.getUserById(id);
	}

	/**
	 * Add or update user in database
	 * @returns 
	 */
	async addUser(user: User): Promise<User> {
		const checkUserExist = await this.postgresUserService.getUserById(user.id);
		if (!checkUserExist) {
			this.logger.debug(`User ${user.displayName} not found in database, add it`)
			return await this.postgresUserService.addUser(user);
		}
		else {
			this.logger.debug(`User ${user.displayName} found in database, update it`)
			await this.postgresUserService.updateUser(user);
			return await this.postgresUserService.getUserById(checkUserExist.id);
		}
	}

	async updateUser(user: User) {
		return await this.postgresUserService.updateUser(user);
	}
}

