import { BadRequestException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserAuthTokenDto, UserRoleType } from './auth.class';
import { Roles } from './role.decorator';
import { log } from 'console';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user/user.class';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly authService: AuthService,
	) { }

	private readonly logger = new Logger(AuthGuard.name);

	async canActivate(context: ExecutionContext,): Promise<boolean> {
		const allowRoles = this.reflector.get<UserRoleType[]>(Roles, context.getHandler());

		this.logger.debug(`Roles: ${JSON.stringify(allowRoles)}`);

		if (!allowRoles) {
			this.logger.error('No roles defined for this route');
			throw new InternalServerErrorException('No roles defined for this route');
		}

		/**
		 * Check if the controller role is public
		 * If yes, print a warning
		 */
		if (allowRoles.includes(UserRoleType.Guest)) {
			this.logger.warn(`The controller ${context.getClass().name} has route /${context.getHandler().name} public, please check if it's normal`)
			return true;
		}

		// Get the request object
		const req = await context.switchToHttp().getRequest();
		const res = await context.switchToHttp().getResponse();

		// Get the user token
		const token = this.getAuthorizationToken(req);

		if (!token) {
			this.logger.error('No token provided');
			throw new UnauthorizedException('No token provided');
		}

		// Decode the token
		const user: UserAuthTokenDto = await this.authService.validateUserJwtAndGetPayload(token);

		// Check if the user has the right role
		if (!allowRoles.includes(user.role)) {
			this.logger.error(`User ${user.displayName}:${user.role} does not have the right role`);
			throw new UnauthorizedException(`User ${user.displayName}:${user.role} does not have the right role`);
		}

		return true;
	}

	private getAuthorizationToken(req: any): string {
		try {
			return req.cookies['user_auth'];
		} catch (error) {
			this.logger.error('No token provided');
			throw new UnauthorizedException('No token provided');
		}
	}
}
