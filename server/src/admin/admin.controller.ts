/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Redirect, Get, Post, ClassSerializerInterceptor, Body, UseInterceptors} from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { log } from 'console';
import { User } from 'src/model/user/user.model';
import { UserService } from 'src/model/user/user.service';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('admin')
export class AdminController {

	constructor (
		private readonly userService: UserService
	) {}
	
	@Get('ws')
	@Redirect('https://admin.socket.io/')
	redirectToAdminSocket() {}

	@Post('addUser')
	addUser(@Body() user : User) : Promise<User> {
		log(user)
		// const newUser = new User({
		// 	displayName: 'admin',
		// 	passwordHash: 'admin',
		// 	role: 0,
		// });
		// Create regex to check if the string is a valid email
		// user.passwordHash = "tes"
		const debug : Promise<User> = this.userService.createUser(user);
		return debug;
	}
}
