import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRoleType } from './auth.class';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user/user.class';
import { instanceToPlain } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { ModelUserService } from 'src/model/user/user.service';

@Injectable()
export class AuthService {

	constructor(
		private jtwService: JwtService,
		private readonly configService: ConfigService,
		private readonly modelUserService: ModelUserService,
	) {
	}
	async generateUserToken(user: User) : Promise<string> {
		const plainUser = instanceToPlain(user);
		return await this.jtwService.signAsync(plainUser, {
			secret: this.configService.get<string>('JWT_SECRET'),
		});
	};

}

