import { Injectable, Controller, Logger, HttpStatus } from '@nestjs/common';
import { User } from 'src/model/user/user.class';
import { ModelUserService } from '../../model/user/user.service';
import { AuthService } from '../auth.service';
import { Response } from 'express';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { object } from 'joi';
import { User42Dto } from './auth42.dto';
import { ModelUser42Service } from 'src/model/user/user42.service';

@Injectable()
export class Auth42Service {

	constructor(
		private modelUserService: ModelUserService,
		private modelUser42Service: ModelUser42Service,
		private authService: AuthService,
	) {}

	private readonly logger = new Logger(Auth42Service.name);

	async storeUser(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
		res: Response,
	) {
		return await this.modelUserService.addOrUpdateUserWith42data(
			id42,
			login42,
			displayName42,
			accessToken42,
			refreshToken42,
		)
	}
}
