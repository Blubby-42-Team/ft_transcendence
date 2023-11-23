import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth42Service } from './auth42.service';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { doesNotMatch } from 'assert';
import { User } from 'src/model/user/user.class';
import { UserRoleType } from '../auth.class';

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
			//TODO check if this is needed https://www.passportjs.org/packages/passport-42/
			// profileFields: {
			// 	'id': (obj) => { return String(obj.id); },
			// 	'username': 'login',
			// 	'displayName': 'displayname',
			// 	'name.familyName': 'last_name',
			// 	'name.givenName': 'first_name',
			// 	'profileUrl': 'url',
			// 	'emails.0.value': 'email',
			// 	'phoneNumbers.0.value': 'phone',
			// 	'photos.0.value': 'image_url'
			// }
		});
	}

	/**
	 * This function is called when the user is successfully logged in with 42
	 */
	async validate(accessToken, refreshToken, profile, cb): Promise<User> {
		const user = new User({
			accessToken: accessToken,
			refreshToken: refreshToken,
			login: profile.username,
			displayName: profile.displayName,
			id: profile.id,
			role: UserRoleType.User,
		});
		cb(null, user)
		return user;
	}
}