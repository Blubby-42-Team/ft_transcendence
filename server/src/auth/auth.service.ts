import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRoleType, UserAuthTokenDto } from './auth.class';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user/user.class';
import { instanceToPlain } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { ModelUserService } from 'src/model/user/user.service';
import { validateOrReject } from 'class-validator';

@Injectable()
export class AuthService {

	constructor(
		private jtwService: JwtService,
		private readonly configService: ConfigService,
		private readonly modelUserService: ModelUserService,
	) {
	}

	private readonly logger = new Logger(AuthService.name);

	async generateUserToken(
		userId: number,
		user42DisplayName: string,
		userRole: UserRoleType,
		user42Login: string,
		user42Id: number,
	) : Promise<string> {
		const payload = new UserAuthTokenDto();
		payload.userId = userId;
		payload.role = userRole;
		payload.displayName = user42DisplayName;
		payload.id42 = user42Id;
		payload.login42 = user42Login;

		const payloadPlain = instanceToPlain(payload);

		return await this.jtwService.signAsync(
			payloadPlain,
			{
			secret: this.configService.get<string>('JWT_SECRET'),
		});
	};

	async validateJwtAndGetPayload(jwt: string) : Promise<UserAuthTokenDto> {
			return this.jtwService.verifyAsync<UserAuthTokenDto>(jwt, {
				secret: this.configService.get<string>('JWT_SECRET'),
			})
			.catch((e) => {
				this.logger.warn(`Invalid jwt: ${jwt}`);
				this.logger.warn(`Error: ${e}`);
				throw new UnauthorizedException('Invalid jwt signature');
			})
			.then( async (payload) => {
				let userAuthToken = new UserAuthTokenDto();
				userAuthToken.userId = payload?.userId;
				userAuthToken.role = payload?.role;
				userAuthToken.displayName = payload?.displayName;
				userAuthToken.id42 = payload?.id42;
				userAuthToken.login42 = payload?.login42;

				await validateOrReject(userAuthToken)
				.catch((e) => {
					this.logger.warn(`Invalid jwt: ${jwt}`);
					this.logger.warn(`Error: ${e}`);
					throw new UnauthorizedException('Invalid jwt payload');
				})

				return userAuthToken;
			})

	}
}

