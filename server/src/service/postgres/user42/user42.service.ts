/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User42 } from 'src/model/user/user42.class';
import { Repository } from 'typeorm';

@Injectable()
export class PostgresUser42Service {

	private readonly logger = new Logger(PostgresUser42Service.name);

	constructor (
		@InjectRepository(User42) private readonly user42Reposiroty: Repository<User42>,
	) {}
	
	/**
	 * Get user42 by 42 id
	 * @param id42 42 user id
	 * @returns `Promise` user42
	 * @throws `NotFoundException` if user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getUser42By42Id(id42: number): Promise<User42> {
		return this.user42Reposiroty.query(
			`SELECT * FROM "user42" WHERE id = $1`,
			[id42],
		)
		.catch((err) => {
			this.logger.error(`Failed to get user42 by 42 id ${id42}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user42 by 42 id ${id42}`);
		})
		.then((res): User42 => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user42 by 42 id ${id42}: not found`);
				throw new NotFoundException(`Failed to get user42 by 42 id ${id42}: not found`);
			}
			if (res.length > 1) {
				this.logger.error(`Failed to get user42 by 42 id ${id42}: too many results`);
				throw new InternalServerErrorException(`Failed to get user42 by 42 id ${id42}: too many results`);
			}
			return res[0];
		})
	}

	/**
	 * Store user42 in database and return its id
	 * @param id42 42 user id
	 * @param login42 42 user login
	 * @param accessToken42 42 user access token
	 * @param refreshToken42 42 user refresh token
	 * @returns `Promise` 42 user id from database
	 * @throws `InternalServerErrorException` if failed to add user
	 */
	async addUser42(
		id42: number,
		login42: string,
		accessToken42: string,
		refreshToken42: string,
	): Promise<number> {

		const user42 = new User42();
		user42.id = id42;
		user42.login = login42;
		user42.accessToken = accessToken42;
		return this.user42Reposiroty.save(user42)
		.catch((err) => {
			this.logger.error(`Failed to add user42 ${login42}: ${err}`);
			throw new InternalServerErrorException(`Failed to add user42 ${login42}`);
		})
		.then((res: User42): number => {
			return res.id;
		})
	}

	/**
	 * Update user42 in database and return its id
	 * @param id42 42 user id
	 * @param login42 42 user login
	 * @param accessToken42 42 user access token
	 * @param refreshToken42 42 user refresh token
	 * @returns `Promise` 42 user id from database
	 * @throws `NotFoundException` if user not found
	 * @throws `InternalServerErrorException` if failed to update user
	 */
	async updateUser42(
		id42: number,
		login42: string,
		accessToken42: string,
		refreshToken42: string,
	) {
		const user42 = new User42();
		user42.id = id42;
		user42.login = login42;
		user42.accessToken = accessToken42;
		user42.refreshToken = refreshToken42;

		return this.user42Reposiroty.update(id42, user42)
		.catch((err) => {
			this.logger.error(`Failed to update user42 ${login42}: ${err}`);
			throw new InternalServerErrorException(`Failed to update user42 ${login42}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update user42 ${login42}: not found`);
				throw new NotFoundException(`Failed to update user42 ${login42}: not found`);
			}
			return 'ok';
		})
	}


	/**
	 * Get user42 by 42 login
	 * @param login 42 user login
	 * @returns `Promise` user42
	 * @throws `NotFoundException` if user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getUser42By42Login(login: string): Promise<User42> {
		return this.user42Reposiroty.query(
			`SELECT * FROM "user42" WHERE login = $1`,
			[login],
		)
		.catch((err) => {
			this.logger.error(`Failed to get user42 by login ${login}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user42 by login ${login}`);
		})
		.then((res): User42 => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user42 by login ${login}: not found`);
				throw new NotFoundException(`Failed to get user42 by login ${login}: not found`);
			}
			if (res.length > 1) {
				this.logger.error(`Failed to get user42 by login ${login}: too many results`);
				throw new InternalServerErrorException(`Failed to get user42 by login ${login}: too many results`);
			}
			return res[0];
		})
	}

}
