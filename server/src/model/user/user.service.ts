import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.class';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { ModelUser42Service } from './user42.service';

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

	async addUser(user: User){
		await this.modelUser42Service.addUser42(user.user42)
		.catch((err) => {
			this.logger.error(err);
			throw new BadRequestException(err);
		});

		const userdb = await this.addUserPong(user)
		.catch((err) => {
			this.logger.error(err);
			throw new BadRequestException(err);
		});

		return userdb.id;
	}

	/**
	 * Add or update user in database
	 * @returns 
	 */
	async addUserPong(user: User): Promise<User> {
		const checkUserExist = await this.postgresUserService.getUserBy42Id(user.user42.id);
		if (!checkUserExist) {
			this.logger.debug(`User ${user.displayName} not found in database, add it`)
			return await this.postgresUserService.addUser(user);
		}
		else {
			this.logger.debug(`User ${user.displayName} found in database, update it`)
			await this.postgresUserService.updateUser(checkUserExist.id, user);
			return await this.postgresUserService.getUserById(checkUserExist.id);
		}
	}
}

