import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleType } from './auth.class';
import { Roles } from './role.decorator';
import { log } from 'console';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private reflector: Reflector) { }

	private readonly logger = new Logger(AuthGuard.name);

	async canActivate(context: ExecutionContext,): Promise<boolean> {
		const roles = this.reflector.get(Roles, context.getClass());

		log(roles)
		this.logger.debug(`Roles: ${JSON.stringify(roles)}`);

		if (!roles) {
			this.logger.error('No roles defined for this route');
			throw new BadRequestException('No roles defined for this route');
		}

		return true;

		const request = context.switchToHttp().getRequest();
		// Get the request object
		const req = await context.switchToHttp().getRequest();
		const res = context.switchToHttp().getResponse();

		// Check the user authorization
		// await this.authService.checkUserCookies(req, res, requiredRoles)

	}
}
