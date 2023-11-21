import { Injectable, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user/user.class';
import { ModelUserService } from '../../model/user/user.service';
import { ModelUser42Service } from 'src/model/user42/user42.service';

@Injectable()
export class Auth42Service {

	constructor(
		private modelUserService: ModelUserService,
		private modelUser42Service: ModelUser42Service,
	) {}

	async storeUser(user: User) {
		const userDb = await this.modelUserService.addUser(user);
		const user42Profile = await this.modelUser42Service.addUser42(userDb.user42);
		userDb.user42 = user42Profile;
		await this.modelUserService.updateUser(userDb);
	}

}
