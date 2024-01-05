import { Injectable, Logger } from '@nestjs/common';
import { ModelUserService } from '../../model/user/user.service';
import { UserRoleType } from '../auth.class';

@Injectable()
export class Auth42Service {

	constructor(
		private modelUserService: ModelUserService,
	) {}

	private readonly logger = new Logger(Auth42Service.name);

	async registerUserWith42Auth(
		id42: number,
		login42: string,
		displayName42: string,
		accessToken42: string,
		refreshToken42: string,
		userRole: UserRoleType = UserRoleType.User,
	) {
		return await this.modelUserService.addOrUpdateUserWith42data(
			id42,
			login42,
			displayName42,
			accessToken42,
			refreshToken42,
			userRole,
		)
	}

}
