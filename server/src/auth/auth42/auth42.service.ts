import { Injectable, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user/user.class';
import { ModelUserService } from '../../model/user/user.service';
import { ModelUser42Service } from 'src/model/user/user42.service';

@Injectable()
export class Auth42Service {

	constructor(
		private modelUserService: ModelUserService,
	) {}

	async storeUser(user: User) {
		return this.modelUserService.addUser(user);
	}
}
