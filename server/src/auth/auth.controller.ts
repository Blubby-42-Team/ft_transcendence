import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Roles } from './role.decorator';
import { UserRoleType } from './auth.class';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
	private redirectUrl: string;

	constructor(
		private configService: ConfigService,
	) {
		this.redirectUrl = configService.get<string>('CORS_ORIGINS');
	}

	@Roles([UserRoleType.User])
	@Get('logout')
	async auth42Logout(@Req() req: any, @Res() res: Response) {
		res.clearCookie('user_auth');

		res.redirect(this.redirectUrl);
		// return res.status(HttpStatus.OK).json({
		// 	statusCode: HttpStatus.OK,
		// 	message: '42 Logout successful',
		// });
	}
}
