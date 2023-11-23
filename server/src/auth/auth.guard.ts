import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleType } from './auth.class';
import { Roles } from './role.decorator';
import { log } from 'console';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user/user.class';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly jwtService: JwtService,
	) { }

	private readonly logger = new Logger(AuthGuard.name);

	async canActivate(context: ExecutionContext,): Promise<boolean> {
		const allowRoles = this.reflector.get<UserRoleType[]>(Roles, context.getHandler());

		this.logger.debug(`Roles: ${JSON.stringify(allowRoles)}`);

		if (!allowRoles) {
			this.logger.error('No roles defined for this route');
			throw new BadRequestException('No roles defined for this route');
		}

		if (allowRoles.includes(UserRoleType.Guest)) {
			return true;
		}

		// Get the request object
		const req = await context.switchToHttp().getRequest();
		const res = await context.switchToHttp().getResponse();

		// Get the user token
		const token = this.getAuthorizationToken(req);

		if (!token) {
			this.logger.error('No token provided');
			throw new BadRequestException('No token provided');
		}

		let user: User;

		// Decode the token
		try {
			user = await this.jwtService.verifyAsync<User>(token)
		} catch (error) {
			this.logger.error(`User ${user.displayName}:${user.role} as an invalid token`, error);
			throw new BadRequestException(`User ${user.displayName}:${user.role} as an invalid token`);
		}

		// Check if the user has the right role
		if (!allowRoles.includes(user.role)) {
			this.logger.error(`User ${user.displayName}:${user.role} does not have the right role`);
			throw new BadRequestException(`User ${user.displayName}:${user.role} does not have the right role`);
		}

		return true;
	}

	private getAuthorizationToken(req: Request): string {
		try {
			return req.cookies['token'];
		} catch (error) {
			this.logger.error('No token provided');
			throw new BadRequestException('No token provided');
		}
	}
}
