import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth42Guard } from './auth42.guard';
import { Auth42Service } from './auth42.service';
import { Response } from 'express';
import { Roles } from '../role.decorator';
import { UserRoleType } from '../auth.class';

@Controller('auth42')
export class Auth42Controller {
	constructor(
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
	async auth42Callback(@Req() req: any, @Res() res: Response) {
		return this.Auth42Service.storeUser(req.user, res);
	}
}

