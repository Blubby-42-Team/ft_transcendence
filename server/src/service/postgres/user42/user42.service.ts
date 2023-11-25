/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User42 } from 'src/model/user/user42.class';
import { Repository } from 'typeorm';
import { log } from 'console';

@Injectable()
export class PostgresUser42Service {

	private readonly logger = new Logger(PostgresUser42Service.name);

	constructor (
		@InjectRepository(User42) private readonly user42Reposiroty: Repository<User42>,
	) {}
	
	async getUser42ById(id: number): Promise<User42> {
		return this.user42Reposiroty.findOne({ where: { id } });
	}

	/**
	 * Store user42 in database and return its id
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

		const user42 = new User42();
		user42.id = id42;
		user42.login = login42;
		user42.accessToken = accessToken42;
		await this.user42Reposiroty.save(user42)
		.catch((err) => {
			this.logger.error(err);
			throw err;
		});

		return id42;
	}

	/**
	 * Update user42 in database and return its id
	 * @param id42 42 user id
	 * @param login42 42 user login
	 * @param accessToken42 42 user access token
	 * @param refreshToken42 42 user refresh token
	 * @returns 42 user id from database
	 */
	async updateUser42(
		id42: number,
		login42: string,
		accessToken42: string,
		refreshToken42: string,
	): Promise<number> {

		const user42 = new User42();
		user42.id = id42;
		user42.login = login42;
		user42.accessToken = accessToken42;
		user42.refreshToken = refreshToken42;

		await this.user42Reposiroty.update(id42, user42)
		.catch((err) => {
			this.logger.error(err);
			throw err;
		});

		return id42;
	}

	async getUser42ByLogin(login: string): Promise<User42> {
		//TODO use raw sql query
		return this.user42Reposiroty.findOne({ where: { login} });
	}

}
