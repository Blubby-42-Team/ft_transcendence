import { BadRequestException, Body, Controller, Get, HttpStatus, Logger, NotFoundException, Post, Put, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Roles } from './role.decorator';
import { Post2FADto, Put2FADto, UserAuthTokenDto, UserRoleType } from './auth.class';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PostgresUserService } from '../service/postgres/user/user.service';
import { UserAuthTOkentPayload } from './auth.decorator';
import { authenticator } from 'otplib';

@Controller('auth')
export class AuthController {
	private redirectUrl: string;

	constructor(
		private configService: ConfigService,
		private readonly authService: AuthService,
		private readonly postgresUserService: PostgresUserService,
	) {
		this.redirectUrl = configService.get<string>('CORS_ORIGINS');
	}

	private readonly logger = new Logger(AuthController.name);

	@Roles([UserRoleType.User])
	@Get('logout')
	async auth42Logout(@Req() req: any, @Res() res: Response) {
		res.clearCookie('user_auth');
		res.clearCookie('user_id');

		res.redirect(this.redirectUrl);
		// return res.status(HttpStatus.OK).json({
		// 	statusCode: HttpStatus.OK,
		// 	message: '42 Logout successful',
		// });
	}


	@Roles([UserRoleType.Guest])
	@Get('2fa')
	async generate2FA(
		@UserAuthTOkentPayload() user: UserAuthTokenDto,
		@Res() res: Response,
	) {
		const user2FA = await this.authService.getUser2FA(user.userId);

		if (!user2FA) {
			this.logger.error('User not found');
			throw new NotFoundException('User not found');
		}

		if (user2FA.enabled === true) {
			this.logger.error('2FA already enabled');
			throw new BadRequestException('2FA already enabled, please disable it first');
		}

		const secret = authenticator.generateSecret();

		//TODO need to rework, bad practice to call postgresUserService from here
		await this.postgresUserService.updateUser2FA(user.userId, false, secret);

		const otpauthUrl = authenticator.keyuri(`Pong:${user.displayName}`, '42-Pong', secret);

		return res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: '2FA generated',
			otpauthUrl,
		});
	}

	@Roles([UserRoleType.Guest])
	@Post('2fa')
	async auth2FA(
		@Body() code: Post2FADto,
		@Req() req: any,
		@Res() res: Response,
	) {
		// Get the 2FA session cookie
		const sessionCookie = req?.cookies['2fa-session'];

		if (!sessionCookie) {
			this.logger.error('No 2FA session cookie found');
			throw new BadRequestException('No 2FA session cookie found');
		}

		// Validate the 2FA session cookie
		const session = await this.authService.validate2FASessionJwtAndGetPayload(sessionCookie);

		if (!session) {
			this.logger.error('2FA session cookie invalid');
			throw new BadRequestException('2FA session cookie invalid');
		}

		// Check the 2FA session cookie TTL, if expired, delete the cookie and throw an error
		const check2FATokenTTL = await this.authService.validate2FASessionTTL(session.uuid);

		if (check2FATokenTTL === false) {
			res.clearCookie('2fa-session');
			this.logger.error('2FA session cookie expired');
			throw new BadRequestException('2FA session cookie expired');
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

		// Check the 2FA code
		await this.authService.check2FACode(code.code, user2FA.secret);

		//TODO need to rework, bad practice to call postgresUserService from here
		const user = await this.postgresUserService.getUserById(session.userId);

		if (!user) {
			this.logger.error('User not found');
			throw new NotFoundException('User not found');
		}

		const jwt = await this.authService.generateUserToken(
			user?.id,
			user?.display_name,
			user?.role,
			'//TODO remove 42 login from jwt',
			1,
		)

		res.clearCookie('2fa-session');
		
		res.cookie('user_auth', jwt, { httpOnly: true });
		res.cookie('user_id', user.id, { httpOnly: false });

		res.status(HttpStatus.OK).json({
			statusCode: HttpStatus.OK,
			message: '2FA Authentication successful',
		});
	}

	@Roles([UserRoleType.Guest])
	@Put('2fa')
	async auth2FAEnable(
		@Body() req: Put2FADto,
		@UserAuthTOkentPayload() user: UserAuthTokenDto,
		@Res() res: Response,
	) {
		// Get the 2FA secret from the database
		const user2FA = await this.authService.getUser2FA(user.userId);

		if (!user2FA) {
			this.logger.error('User not found');
			throw new NotFoundException('User not found');
		}

		if (user2FA.secret?.length === 0) {
			this.logger.error('No secret set for user');
			throw new BadRequestException('No secret set for user, please ask to generate a new one');
		}

		await this.authService.check2FACode(req.code, user2FA.secret);

		switch (req.action) {
			case 'enable':
				//TODO need to rework, bad practice to call postgresUserService from here
				await this.postgresUserService.updateUser2FA(user.userId, true, user2FA.secret);
				return res.status(HttpStatus.OK).json({
					statusCode: HttpStatus.OK,
					message: '2FA enabled',
				});
			case 'disable':
				if (user2FA.enabled === false) {
					throw new BadRequestException('2FA already disabled');
				}
				//TODO need to rework, bad practice to call postgresUserService from here
				await this.postgresUserService.updateUser2FA(user.userId, false, '');
				return res.status(HttpStatus.OK).json({
					statusCode: HttpStatus.OK,
					message: '2FA disabled',
				});
			default:
				throw new BadRequestException('Invalid action, must be `enable` or `disable`');
		}
	}
}
