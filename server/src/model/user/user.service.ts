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
	async addUser(user: User): Promise<User | UpdateResult> {
		const checkUserExist = await this.postgresUserService.getUserById(user.id);
		this.logger.debug(`Try to store userDto: ${JSON.stringify(user)}`);
		if (!checkUserExist) {
			return this.postgresUserService.addUser(user);
		}
		else {
			return this.postgresUserService.updateUser(user);
		}
	}

	async updateUser(user: User) {
		return this.postgresUserService.updateUser(user);
	}
}

