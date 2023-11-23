import { Controller, Get, Query } from '@nestjs/common';
import { DTO_getUserById } from './user.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

	constructor (
		private readonly userService: UserService,
	) {}

	@Get()
	async getUserById(@Query() query: DTO_getUserById) {
		return await this.userService.getUserById(query.id);
	}

}
