import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth42Service } from './auth42.service';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { doesNotMatch } from 'assert';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
			private authService: Auth42Service,
			private readonly configService: ConfigService,
		) {
		super({
			clientID: configService.get<string>('API42_APP_ID'),
			clientSecret: configService.get<string>('API42_APP_SECRET'),
			callbackURL: configService.get<string>('API42_APP_REDIRECT'),
			profileFields: {
				'id': (obj) => { return String(obj.id); },
				'username': 'login',
				'displayName': 'displayname',
				'name.familyName': 'last_name',
				'name.givenName': 'first_name',
				'profileUrl': 'url',
				'emails.0.value': 'email',
				'phoneNumbers.0.value': 'phone',
				'photos.0.value': 'image_url'
			}
		});
	}

	async validate(accessToken, refreshToken, profile, cb): Promise<any> {
		const user = {
			accessToken: accessToken,
			refreshToken: refreshToken,
			username: profile.username,
		};
		cb(null, user)
	}
}