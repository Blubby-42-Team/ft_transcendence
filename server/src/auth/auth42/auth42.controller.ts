import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth42Guard } from './auth42.guard';
import { log } from 'console';
import { Auth42Service } from './auth42.service';
import { Response } from 'express';

@Controller('auth42')
export class Auth42Controller {
	constructor(
		private auth42Service: Auth42Service,
	) {}

	@Get('login')
	@UseGuards(Auth42Guard)
	auth42Login () {
	}

	@Get('callback')
	@UseGuards(Auth42Guard)
	async auth42Callback(@Req() req, @Res() res: Response) {
		log(req.user)
		const token = await this.auth42Service.singIn({});
		log(token)
		res.cookie('token', token.access_token, { httpOnly: true });
		res.status(HttpStatus.OK).json(token);
	}
}

