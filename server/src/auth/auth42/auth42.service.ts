import { Injectable, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { User } from 'src/model/user/user.class';
import { ModelUserModule } from '../../model/user/user.module';
import { ModelUserService } from '../../model/user/user.service';

@Injectable()
export class Auth42Service {

	constructor(
		private jwtService: JwtService,
		private modelUserService: ModelUserService
	) {}

	async storeUser(user: User) {
		this.modelUserService.addUser(user);
	}

}
