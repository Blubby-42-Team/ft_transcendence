import { BadRequestException, Injectable, Logger, OnModuleDestroy, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRoleType, UserAuthTokenDto, User2FASessionTokenDto } from './auth.class';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user/user.class';
import { instanceToPlain } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { ModelUserService } from 'src/model/user/user.service';
import { validateOrReject } from 'class-validator';
import { UUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {

	constructor(
		private jtwService: JwtService,
		private readonly configService: ConfigService,
		private readonly modelUserService: ModelUserService,
	) {
	}

	private readonly logger = new Logger(AuthService.name);

	private session2FA: Map<UUID, Date> = new Map();
	private readonly session2FATTL: number = 1000 * 60 * 5;

	private garbageCollectorTimeout: NodeJS.Timeout;
	private readonly garbageCollectorInterval: number = 1000 * 1

	async onModuleInit() {
		this.garbageCollectorTimeout = setInterval(() => {
			this.session2FA.forEach( async (_, key) => {

				if (_ === undefined) {
					this.session2FA.delete(key);
					return;
				}

				// If the TTL is expired, remove it from the cache 
				const isTTLValid = await this.validate2FASessionTTL(key);
				if (isTTLValid === false) {
					this.logger.debug(`2FA session ${key} TTL expired, remove it from the cache!`);
					this.session2FA.delete(key);
					return;
				}
			})
		}, this.garbageCollectorInterval);
	}

	onModuleDestroy() {
		clearTimeout(this.garbageCollectorTimeout);
	}

	/**
	 * Create a new 2FA session
	 * @returns a new 2FA session uuid
	 */
	async createNew2FASession() {
		const uuid = uuidv4();
		this.session2FA.set(uuid, new Date());
		return uuid;
	}

	/**
	 * Create 2FA session jwt
	 * @param uuid uuid of the 2FA session
	 * @param userid id of the user
	 * @returns jwt of the 2FA session
	 */
	async generate2FASessionJwt(uuid: UUID, userid: number) {
		const payload = {
			uuid,
			userid,
		};

		return await this.jtwService.signAsync(
			payload,
			{
			secret: this.configService.get<string>('JWT_SECRET'),
		});
	}

	/**
	 * Validate 2FA session TTL and remove it from the cache if it's expired
	 * @param uuid uuid of the 2FA session
	 * @returns true if the session is valid, false otherwise
	 */
	async validate2FASessionTTL(uuid: UUID) {
		const session = this.session2FA.get(uuid);
		if (session === undefined) {
			return false;
		}

		if (new Date().getTime() - session.getTime() > this.session2FATTL) {
			return false;
		}

		return true;
	}

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

	async validateUserJwtAndGetPayload(jwt: string) : Promise<UserAuthTokenDto> {
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

	async validate2FASessionJwtAndGetPayload(jwt: string) : Promise<User2FASessionTokenDto> {
			return this.jtwService.verifyAsync<User2FASessionTokenDto>(jwt, {
				secret: this.configService.get<string>('JWT_SECRET'),
			})
			.catch((e) => {
				this.logger.warn(`Invalid jwt: ${jwt}`);
				this.logger.warn(`Error: ${e}`);
				throw new UnauthorizedException('Invalid jwt signature');
			})
			.then( async (payload: User2FASessionTokenDto) => {
				await validateOrReject(payload)
				.catch((e) => {
					this.logger.warn(`Invalid jwt: ${jwt}`);
					this.logger.warn(`Error: ${e}`);
					throw new UnauthorizedException('Invalid jwt payload');
				})

				return payload;
			})

	}
}

