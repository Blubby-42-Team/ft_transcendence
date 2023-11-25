import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth42Service } from './auth42.service';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { doesNotMatch } from 'assert';
import { User } from 'src/model/user/user.class';
import { UserRoleType } from '../auth.class';
import { User42 } from 'src/model/user/user42.class';
import { User42Dto } from './auth42.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
			private authService: Auth42Service,
			private readonly configService: ConfigService,
		) {
		
			/**
			 * This is the constructor of the FortyTwoStrategy class
			 */
		super({
			clientID: configService.get<string>('API42_APP_ID'),
			clientSecret: configService.get<string>('API42_APP_SECRET'),
			callbackURL: configService.get<string>('API42_APP_REDIRECT'),
		});
	}

	/**
	 * This function is called when the user is successfully logged in with 42
	 */
	async validate(accessToken, refreshToken, profile, cb): Promise<User42Dto> {

		const user42 = new User42Dto();
		user42.id42 = profile?.id;
		user42.login = profile?.username;
		user42.displayName = profile?.displayName;
		user42.accessToken = accessToken;
		user42.refreshToken = refreshToken;

		cb(null, user42)
		return user42;
	}
}