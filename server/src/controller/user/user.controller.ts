import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DTO_getUserById } from './user.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { UserService } from './user.service';
import { log } from 'console';

@Controller('user')
export class UserController {

	constructor (
		private readonly userService: UserService,
	) {}

	@Roles([UserRoleType.Admin])
	@Get('/:id')
	async getUserById(@Param() params: DTO_getUserById) {
		log(`Get user by id ${params.id}`);
		return await this.userService.getUserById(params.id);
	}

}
