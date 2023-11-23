/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Redirect, Get, Post, ClassSerializerInterceptor, Body, UseInterceptors, UseGuards} from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { log } from 'console';
import { UserRoleType } from 'src/auth/auth.class';
import { AuthGuard } from 'src/auth/auth.guard';
import { Auth42Guard } from 'src/auth/auth42/auth42.guard';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/model/user/user.class';
import { ModelUserService } from 'src/model/user/user.service';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('admin')
export class AdminController {

	constructor (
		private readonly userService: ModelUserService
	) {}
	
	@Get('ws')
	@Roles([UserRoleType.Admin])
	@Redirect('https://admin.socket.io/')
	redirectToAdminSocket() {}

	@Get('test')
	test () {
		return 'test'
	}
}
