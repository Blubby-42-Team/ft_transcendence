import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Roles } from './role.decorator';
import { UserRoleType } from './auth.class';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

	@Roles([UserRoleType.User])
	@Get('logout')
	async auth42Logout(@Req() req: any, @Res() res: Response) {
		res.clearCookie('user_auth');

		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: '42 Logout successful',
		});
	}
}
