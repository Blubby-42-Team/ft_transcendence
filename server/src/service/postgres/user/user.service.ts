import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { Repository } from 'typeorm';
import { UserRoleType } from 'src/auth/auth.class';
import { User42 } from 'src/model/user/user42.class';

@Injectable()
export class PostgresUserService {
	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(User42) private readonly user42Repository: Repository<User42>,
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

	async updateUser(
		idUser: number,
		displayNameUser: string,
		roleUser: UserRoleType,
	) {
		const user = new User();
		user.displayName = displayNameUser;
		user.role = roleUser;

		const userEntity = this.userRepository.create(user);
		return this.userRepository.update(idUser, userEntity);
	}

	async updateUserWith42Data(
		idUser: number,
		displayNameUser: string,
		roleUser: UserRoleType,
		id42: number,
		login42: string,
		accessToken42: string,
		refreshToken42: string,
	): Promise<number>{
		const user = new User();
		user.displayName = displayNameUser;
		user.role = roleUser;

		const user42 = new User42();
		user42.id = id42;
		user42.login = login42;
		user42.accessToken = accessToken42;
		user42.refreshToken = refreshToken42;

		user.user42 = user42;

		await this.userRepository.update(idUser, user);
		return idUser;
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

	/**
	 * Create user with 42 data in database
	 * @param id42 id of 42 user
	 * @param login42 login of 42 user
	 * @param displayName42 display name of 42 user
	 * @param accessToken42 access token of 42 user
	 * @param refreshToken42 refresh token of 42 user
	 * @returns id of user in database
	 */
	async createUserWith42Data(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
	): Promise<number> {
		const user42 = new User42();
		user42.id = id42;
		user42.login = login42;
		user42.accessToken = accessToken42;
		user42.refreshToken = refreshToken42;

		const user = new User();
		user.displayName = displayName42;
		user.role = UserRoleType.User;
		user.user42 = user42;

		const userEntity = this.userRepository.create(user);
		return await this.userRepository.save(userEntity)
		.then((res: User): number=> {
			return res.id;
		})
	}
}

