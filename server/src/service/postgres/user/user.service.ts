import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { Repository } from 'typeorm';
import { UserRoleType } from 'src/auth/auth.class';

@Injectable()
export class PostgresUserService {
	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}
	
	async getUserById(id: number): Promise<User> {
		const userQuery = await this.userRepository.query(`
			SELECT * FROM "user" WHERE id = '${id}'
		`)
		.then((res): User => {
			return res[0];
		})

		return userQuery;
	}

	async addUser(user: User): Promise<User> {
		const userDto = this.userRepository.create(user);
		return this.userRepository.save(userDto);
	}

	async updateUser(id: number, user: User) {
		const userDto = this.userRepository.create(user);
		return this.userRepository.update(id, userDto);
	}

	async getUserBy42Login(login: string): Promise<User> {
		const userQuery = await this.userRepository.query(`
			SELECT * FROM "user" WHERE "user42Id" = (SELECT id FROM "user42" WHERE login = '${login}')
		`)
		.then((res): User => {
			return res[0];
		})

		return userQuery;
	}

	async getUserBy42Id(id: number): Promise<User> {
		const userQuery = await this.userRepository.query(`
			SELECT * FROM "user" WHERE "user42Id" = '${id}'
		`)
		.then((res): User => {
			return res[0];
		})

		return userQuery;
	}

	async getUserRoleById(id: number): Promise<string> {
		const userQuery = await this.userRepository.query(`
			SELECT "role" FROM "user" WHERE id = '${id}'
		`)
		.then((res): string => {
			return res[0].role;
		})

		return userQuery;
	}
}

