import { Injectable } from '@nestjs/common';
import { ModelUserService } from 'src/model/user/user.service';

@Injectable()
export class UserService {

	constructor(
		private readonly modelUserService: ModelUserService,
	) {}

	async getUserById(id: number) {
		return await this.modelUserService.getUserById(id);
	}
}
