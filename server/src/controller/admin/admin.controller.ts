/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Redirect, Get} from '@nestjs/common';
import { UserRoleType } from 'src/auth/auth.class';
import { Roles } from 'src/auth/role.decorator';
import { ModelUserService } from 'src/model/user/user.service';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('admin')
export class AdminController {

	constructor (
		private readonly userService: ModelUserService
	) {}
	
	@Get('ws')
	@Roles([UserRoleType.Admin, UserRoleType.Guest])
	@Redirect('https://admin.socket.io/')
	redirectToAdminSocket() {}

	@Roles([UserRoleType.Admin, UserRoleType.Guest])
	@Get('test')
	test () {
		return 'test'
	}
}
