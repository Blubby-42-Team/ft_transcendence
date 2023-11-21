import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth42Guard } from './auth42.guard';
import { log } from 'console';
import { Auth42Service } from './auth42.service';
import { Response } from 'express';
import { User } from 'src/model/user/user.class';
import { Roles } from '../role.decorator';
import { UserRoleType } from '../auth.class';

@Controller('auth42')
export class Auth42Controller {
	constructor(
		private authService: AuthService,
		private Auth42Service: Auth42Service,
	) {}

	private readonly logger = new Logger(Auth42Controller.name);

	@Roles([UserRoleType.Guest])
	@Get('login')
	@UseGuards(Auth42Guard)
	auth42Login () {}

	@Roles([UserRoleType.Guest])
	@Get('callback')
	@UseGuards(Auth42Guard)
	async auth42Callback(@Req() req, @Res() res: Response) {
		//TODO move this in a service
		const user = new User(req.user);
		
		this.logger.log(`User ${user.displayName} logged in`);

		await this.Auth42Service.storeUser(user);

		const token = await this.authService.generateUserToken(user);
		res.cookie('token', token, { httpOnly: true });
		res.status(HttpStatus.OK).json(token);
	}
}

