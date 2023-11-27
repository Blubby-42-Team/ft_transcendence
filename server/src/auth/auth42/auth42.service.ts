import { Injectable, Controller, Logger, HttpStatus } from '@nestjs/common';
import { User } from 'src/model/user/user.class';
import { ModelUserService } from '../../model/user/user.service';
import { AuthService } from '../auth.service';
import { Response } from 'express';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { object } from 'joi';
import { User42Dto } from './auth42.dto';
import { ModelUser42Service } from 'src/model/user/user42.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoleType } from '../auth.class';

@Injectable()
export class Auth42Service {

	constructor(
		private modelUserService: ModelUserService,
		private readonly jwt: JwtService,
	) {}

	private readonly logger = new Logger(Auth42Service.name);

	async registerUserWith42Auth(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
		userRole: UserRoleType = UserRoleType.User,
	) {
		return await this.modelUserService.addOrUpdateUserWith42data(
			id42,
			login42,
			displayName42,
			accessToken42,
			refreshToken42,
			userRole,
		)
	}
}
