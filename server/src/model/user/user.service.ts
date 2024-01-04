import { HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.class';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { ModelUser42Service } from './user42.service';
import { UserRoleType } from 'src/auth/auth.class';
import { UserTelemetryStatus } from '@shared/types/user/user';
import { TelemetryService } from 'src/service/telemetry/telemetry.service';
import { PostgresPictureService } from 'src/service/postgres/picture/picture.service';

@Injectable()
export class ModelUserService {
	constructor (
		private readonly postgresUserService: PostgresUserService,
		private readonly modelUser42Service: ModelUser42Service,
		private readonly telemetryService: TelemetryService,
	) {}
	
	private readonly logger = new Logger(ModelUserService.name);

	async getUserById(id: number): Promise<User> {
		return await this.postgresUserService.getUserById(id);
	}

	async getUserByIdForWilla(id: number) {
		const user = await this.postgresUserService.getUserByIdForWilla(id);
		const status = await this.telemetryService.getUserStatus(id);
		return {
			id:					user.id,
			display_name:		user.display_name,
			full_name:			user.full_name,
			login:				user.login,
			profile_picture:	user.profile_picture,
			status: 			status,
		};
	}

	async getUserByLogin(login: string) {
		const user = await this.postgresUserService.getUserByLogin(login);
		const status = await this.telemetryService.getUserStatus(user.id);
		return {
			id:					user.id,
			display_name:		user.display_name,
			full_name:			user.full_name,
			login:				user.login,
			profile_picture:	user.profile_picture,
			status: 			status,
		};
	}

	/**
	 * Create or update user with 42 data in database
	 * @param id42 id of 42 user
	 * @param login42 login of 42 user
	 * @param displayName42 display name of 42 user
	 * @param accessToken42 access token of 42 user
	 * @param refreshToken42 refresh token of 42 user
	 * @param userRole user role, default is UserRoleType.User
	 * @returns user in database
	 */
	async addOrUpdateUserWith42data(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
		userRole: UserRoleType = UserRoleType.User,
	): Promise<User> {
		// First get user from database with 42 id
		return await this.postgresUserService.getUserBy42Id(id42)
		.then (async (res: User) => {
			this.logger.debug(`User ${res.display_name} found in database, update it`)

			await this.postgresUserService.updateUser(
				res.id,
				res.display_name,
				userRole,
				res.profile_picture,
			);

			await this.modelUser42Service.addOrUpdateUser42(
				id42,
				login42,
				accessToken42,
				refreshToken42,
			);
			return res;
		})
		.catch( async (err) => {
			// If user not found in database, create it
			if (err instanceof NotFoundException) {
				this.logger.debug(`User ${login42} not found in database, add it`)

				return await this.postgresUserService.createUserWith42Data(
					id42,
					login42,
					displayName42,
					accessToken42,
					refreshToken42,
				);
			}
			throw err;
		})
	}

	async getFriendsById(id: number): Promise<User[]> {
		return await this.postgresUserService.getFriendsById(id)
	}

	async addFriendById(id: number, friendId: number) {
		if (id === friendId)
			throw new NotFoundException('Cannot add yourself as a friend.');
		const friends = await this.getFriendsById(id);
		if (friends.length > 0) {
			friends.forEach(user => {
				if (user.id === friendId) {
					this.logger.debug(`Friend ${friendId} is already in the friend list`)
					throw new HttpException('Friendship already exists', HttpStatus.CONFLICT);
				}
			});
		}
		
		return await this.postgresUserService.addFriendById(id, friendId)
	}

	async deleteFriendById(id: number, friendId: number) {
		if (id === friendId)
			throw new NotFoundException('Cannot delete yourself friendship, believe in yourself.');
		return await this.postgresUserService.deleteFriendById(id, friendId)
	}

	async isInFriendById(id: number, friendId: number) {
		return await this.postgresUserService.isInFriendById(id, friendId);
	}

	async getWhitelistById(id: number): Promise<Array<{"id": number}>> {
		return await this.postgresUserService.getWhitelistById(id)
	}
	
	async addWhitelistById(id: number, whitelistId: number) {
		if (id === whitelistId)
			throw new NotFoundException('Cannot add yourself as a whitelist.');
		if (await this.isInBlacklistById(id, whitelistId))
			throw new NotFoundException('Cannot add cause user is in blacklist.');
		const whitelist = await this.getWhitelistById(id);
		if (whitelist.length > 0) {
			whitelist.forEach(user => {
				if (user.id === whitelistId) {
					this.logger.debug(`Whitelist ${whitelistId} is already in the whitelist list`)
					throw new UnauthorizedException('Already in whitelist');
				}
			});
		}
		return await this.postgresUserService.addWhitelistById(id, whitelistId)
	}

	async getBlacklistById(id: number): Promise<Array<{"id": number}>> {
		return await this.postgresUserService.getBlacklistById(id)
	}

	async isInBlacklistById(id: number, blacklistId: number): Promise<Boolean> {
		const blacklist = await this.getBlacklistById(id);
		let is_in = false

		blacklist.forEach(user => {
			if (user.id === blacklistId) {
				is_in = true;
			}
		});
		return is_in;
	}
	
	async addBlacklistById(id: number, blacklistId: number) {
		if (id === blacklistId)
			throw new UnauthorizedException('Cannot add yourself as a blacklist.');
		const blacklist = await this.getBlacklistById(id);
		return await this.postgresUserService.addBlacklistById(id, blacklistId)
	}

	async deleteBlacklistById(id: number, blacklistId: number) {
		return await this.postgresUserService.deleteBlacklistById(id, blacklistId)
	}

	async setUserStatus(id: number, status: UserTelemetryStatus) {
		return await this.telemetryService.setUserStatus(id, status);
	}

	async getUserStatus(id: number) {
		return await this.telemetryService.getUserStatus(id);
	}

	async uploadPictureUser(data: Buffer, filename: string, userId: number, id: number) {
		const user = await this.postgresUserService.getUserById(userId)
		return this.postgresUserService.updatePicture(user, `/picture/${id}`)
	}

	async changeUsername (userId:number, username: string) {
		const user = await this.postgresUserService.getUserById(userId);
		if (await this.postgresUserService.isUsedUsername(username))
			throw new UnauthorizedException("Name already taken.")
		return await this.postgresUserService.changeUsername(user, username);
	}
}

