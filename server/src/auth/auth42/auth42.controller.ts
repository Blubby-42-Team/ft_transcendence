import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth42Guard } from './auth42.guard';
import { log } from 'console';
import { Auth42Service } from './auth42.service';
import { Response } from 'express';
import { User } from 'src/model/user/user.model';

@Controller('auth42')
export class Auth42Controller {
	constructor(
		private auth42Service: Auth42Service,
	) {}

	private readonly logger = new Logger(Auth42Controller.name);

	@Get('login')
	@UseGuards(Auth42Guard)
	auth42Login () {
	}

	@Get('callback')
	@UseGuards(Auth42Guard)
	async auth42Callback(@Req() req, @Res() res: Response) {
		const user = new User(req.user);
		
		this.logger.log(`User ${user.displayName} logged in`);

		const token = await this.auth42Service.singIn(user);
		res.cookie('token', token, { httpOnly: true });
		res.status(HttpStatus.OK).json(token);
	}
}

