import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DTO_addFriendById, DTO_getBlacklistedUserById, DTO_getUserById, DTO_searchUserByLogin } from './user.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { UserService } from './user.service';
import { log } from 'console';

@Controller('user')
export class UserController {

	constructor (
		private readonly userService: UserService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id')
	async getUserById(@Param() params: DTO_getUserById) {
		log(`Get user by id ${params.id}`);
		return await this.userService.getUserById(params.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/search/:login')
	async getUserByLogin(@Param() params: DTO_searchUserByLogin) {
		log(`Get user by login ${params.login}`);
		return await this.userService.getUserByLogin(params.login);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/friends/:id')
	async getFriendsById(@Param() params: DTO_getUserById) {
		log(`Get friends by id ${params.id}`);
		return await this.userService.getFriendsById(params.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Delete('/friends/:id')
	async deleteFriendById(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_addFriendById,
	) {
		log(`Delete friend to ${params.id} by id ${body.id}`);
		return await this.userService.deleteFriendById(params.id, body.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/whitelist/:id')
	async getWhitelistById(@Param() params: DTO_getUserById) {
		log(`Get whitelist by id ${params.id}`);
		return await this.userService.getWhitelistById(params.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Post('/whitelist/:id')
	async addWhitelistById(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_addFriendById,
	) {
		log(`Add whitelist to ${params.id} by id ${body.id}`);
		return await this.userService.addWhitelistById(params.id, body.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/blacklist/:id')
	async getBlacklistById(@Param() params: DTO_getUserById) {
		log(`Get blacklist by id ${params.id}`);
		return await this.userService.getBlacklistById(params.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/blacklist/is_in/:id/:blacklistId')
	async IsInBlacklistById(
			@Param() params: DTO_getBlacklistedUserById,
	) {
		log(`Is ${params.id} in blacklist of ${params.id}`);
		return await this.userService.isInBlacklistById(params.id, params.blacklistId);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Post('/blacklist/:id')
	async addBlacklistlistById(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_addFriendById,
	) {
		log(`Add blacklist to ${params.id} by id ${body.id}`);
		return await this.userService.addBlacklistById(params.id, body.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Delete('/blacklist/:id')
	async deleteBlacklistById(
		@Param() params: DTO_getUserById,
		@Body() body: DTO_addFriendById,
	) {
		log(`Delete blacklist to ${params.id} by id ${body.id}`);
		return await this.userService.deleteBlacklistById(params.id, body.id);
	}
}
