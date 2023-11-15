import { Injectable, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Auth42Service {

	constructor(
		private jwtService: JwtService,
	) {}

	async singIn (user: any) {
		//TODO get the user data from the stragety and store in db
		const payload = {
			id: 1,
			email: 'ur@motah.com'
		}
		return {
			access_token: await this.jwtService.signAsync(payload)
		};
	};
}
