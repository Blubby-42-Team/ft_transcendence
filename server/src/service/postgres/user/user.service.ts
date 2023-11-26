import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { Repository } from 'typeorm';
import { UserRoleType } from 'src/auth/auth.class';
import { User42 } from 'src/model/user/user42.class';

@Injectable()
export class PostgresUserService {

	private readonly logger = new Logger(PostgresUserService.name);

	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(User42) private readonly user42Repository: Repository<User42>,
	) {}
	
	/**
	 * Get user by id
	 * @param id id of user
	 * @returns user
	 * @throws NotFoundException if user not found
	 * @throws InternalServerErrorException if db error
	 */
	async getUserById(id: number): Promise<User> {
		return this.userRepository.query(`
			SELECT * FROM "user" WHERE id = '${id}'
		`)
		.then((res): User => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user by id ${id}: not found`);
				throw new NotFoundException(`Failed to get user by id ${id}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get user by id ${id}: too many results`);
				throw new InternalServerErrorException(`Failed to get user by id ${id}: too many results`);
			}
			return res[0];
		})
		.catch((err) => {
			this.logger.debug(`Failed to get user by id ${id}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user by id ${id}`);
		});
	}

	/**
	 * Update user in database
	 * @param idUser id of user to update 
	 * @param displayNameUser dipaly name of user
	 * @param roleUser role of user
	 * @returns 'ok' if success
	 * @throws NotFoundException if user not found
	 * @throws InternalServerErrorException if db error
	 */
	async updateUser (
		idUser: number,
		displayNameUser: string,
		roleUser: UserRoleType,
	) {
		return this.userRepository.update(idUser, {
			displayName: displayNameUser,
			role: roleUser,
		})
		.catch((err) => {
			this.logger.debug(`Failed to update User ${idUser}: ${err}`);
			throw new InternalServerErrorException(`Failed to update User ${idUser}`);
		})
		.then((res)=> {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update User ${idUser}: ${res}`);
				throw new NotFoundException(`Failed to update User ${idUser}`);
			}
			return 'ok';
		})
	}

	/**
	 * Get user by 42 id
	 * @param id42 id of 42 user
	 * @returns user
	 * @throws NotFoundException if user not found
	 * @throws InternalServerErrorException if db error
	 */
	async getUserBy42Id(id42: number): Promise<User> {
		return this.userRepository.query(`
			SELECT * FROM "user" WHERE "user42Id" = '${id42}'
		`)
		.catch((err) => {
			this.logger.debug(`Failed to get user by 42 id ${id42}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user by 42 id ${id42}`);
		})
		.then((res): User => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user by 42 id ${id42}: not found`);
				throw new NotFoundException(`Failed to get user by 42 id ${id42}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get user by 42 id ${id42}: too many results`);
				throw new InternalServerErrorException(`Failed to get user by 42 id ${id42}: too many results`);
			}
			return res[0];
		})
	}

	async getUserRoleById(id: number): Promise<string> {
		return this.userRepository.query(`
			SELECT "role" FROM "user" WHERE id = '${id}'
		`)
		.catch((err) => {
			this.logger.debug(`Failed to get user role by id ${id}: ${err}`);
			throw new InternalServerErrorException(`Failed to get user role by id ${id}`);
		})
		.then((res): string => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get user role by id ${id}: not found`);
				throw new NotFoundException(`Failed to get user role by id ${id}: not found`);
			}
			return res[0].role;
		})
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

		return this.userRepository.save(user)
		.then((res: User): number=> {
			return res.id;
		})
	}
}

