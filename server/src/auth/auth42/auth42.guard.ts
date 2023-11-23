/*
https://docs.nestjs.com/guards#guards
*/

import { BadRequestException, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';

@Injectable()
export class Auth42Guard extends AuthGuard('42') {
	constructor() {
		super();
	}

	private readonly logger = new Logger(Auth42Guard.name);

	handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
		if (err || !user) {
			this.logger.error(`Error: ${err}`)
			throw new BadRequestException('42 User not found or invalid token');
		}
		return user;
	}
}
