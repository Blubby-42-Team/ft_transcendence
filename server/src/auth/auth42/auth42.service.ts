import { Injectable, Controller, Logger, HttpStatus } from '@nestjs/common';
import { User } from 'src/model/user/user.class';
import { ModelUserService } from '../../model/user/user.service';
import { AuthService } from '../auth.service';
import { Response } from 'express';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { object } from 'joi';

@Injectable()
export class Auth42Service {

	constructor(
		private modelUserService: ModelUserService,
		private authService: AuthService,
	) {}

	private readonly logger = new Logger(Auth42Service.name);

	async storeUser(user: User, res: Response) {
		this.logger.log(`User ${user.displayName} logged in`);

		/**
		 * Add user in database
		 */
		const userDb = await this.modelUserService.addUser(user);

		const token = await this.authService.generateUserToken(userDb);
		res.cookie('token', token, { httpOnly: true });
		res.status(HttpStatus.OK).json({
			token: token,
			userPlain: instanceToPlain(userDb),
			userRaw: userDb,
		});

	}
}
