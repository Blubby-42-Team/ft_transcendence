/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User42 } from 'src/model/user/user42.class';
import { Repository } from 'typeorm';

@Injectable()
export class PostgresUser42Service {
	constructor (
		@InjectRepository(User42) private readonly user42Reposiroty: Repository<User42>,
	) {}
	
	async getUser42ById(id: number): Promise<User42> {
		return this.user42Reposiroty.findOne({ where: { id } });
	}

	async addUser42(user: User42): Promise<User42> {
		const userDto = this.user42Reposiroty.create(user);
		return this.user42Reposiroty.save(userDto);
	}

	async updateUser42(id, user: User42) {
		const userDto = this.user42Reposiroty.create(user);
		return this.user42Reposiroty.update(id, userDto);
	}

	async getUser42ByLogin(login: string): Promise<User42> {
		return this.user42Reposiroty.findOne({ where: { login} });
	}

}
