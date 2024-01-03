import { BadRequestException, Body, Controller, Get, HttpStatus, Logger, Post, Put, Req, Res } from '@nestjs/common';
import { Roles } from './role.decorator';
import { Post2FADto, Put2FADto, UserRoleType } from './auth.class';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	private readonly logger = new Logger(AuthController.name);

	constructor(
		private readonly authService: AuthService,
	) {}

	@Roles([UserRoleType.User])
	@Get('logout')
	async auth42Logout(@Req() req: any, @Res() res: Response) {
		res.clearCookie('user_auth');

		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: '42 Logout successful',
		});
	}

	@Roles([UserRoleType.Guest])
	@Post('2fa')
	async auth2FA(
		@Body() code: Post2FADto,
		@Req() req: any,
		@Res() res: Response,
	) {
		const sessionCookie = req.cookies['2fa-session'];

		if (!sessionCookie) {
			this.logger.error('No 2FA session cookie found');
			throw new BadRequestException('No 2FA session cookie found');
		}

		const session = await this.authService.validate2FASessionJwtAndGetPayload(sessionCookie);

		if (!session) {
			this.logger.error('2FA session cookie invalid');
			throw new BadRequestException('2FA session cookie invalid');
		}

		const user2FA =  await this.authService.getUser2FA(session.userId);

		if (!user2FA) {
			this.logger.error('2FA session cookie invalid');
			throw new BadRequestException('2FA session cookie invalid');
		}

		if (user2FA.enabled === false) {
			this.logger.debug('2FA session cookie valid, 2FA disabled?!');
			throw new BadRequestException('2FA session cookie valid, 2FA disabled?!');
		}

		// TODO Check 2fa

		res.clearCookie('2fa-session');
		res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: '2FA Authentication successful',
		});
	}

	@Roles([UserRoleType.Guest])
	@Put('2fa')
	async auth2FAEnable(@Body() req: Put2FADto) {

		if (req.action === 'enable') {
			// TODO Enable 2FA
		}
		else if (req.action === 'disable') {
			// TODO Disable 2FA
			
		}
		else {
			throw new BadRequestException('Invalid action');
		}
	}
}
