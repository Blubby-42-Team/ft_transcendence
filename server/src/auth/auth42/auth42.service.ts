import { Injectable, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { User } from 'src/model/user/user.model';
import { UserService } from '../../model/user/user.service';

@Injectable()
export class Auth42Service {

	constructor(
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	async singIn (user: User) : Promise<string> {
		//TODO get the user data from the stragety and store in db

		await this.userService.createUser(user);
		
		const plainUser = instanceToPlain(user);
		return await this.jwtService.signAsync(plainUser);
	};
}
