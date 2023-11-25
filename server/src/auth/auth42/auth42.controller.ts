import { BadRequestException, Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth42Guard } from './auth42.guard';
import { Auth42Service } from './auth42.service';
import { Response } from 'express';
import { Roles } from '../role.decorator';
import { UserRoleType } from '../auth.class';
import { validate, validateOrReject } from 'class-validator';
import { User42Dto } from './auth42.dto';

@Controller('auth42')
export class Auth42Controller {
	constructor(
		private Auth42Service: Auth42Service,
	) {}

	private readonly logger = new Logger(Auth42Controller.name);

	@Roles([UserRoleType.Guest])
	@Get('login')
	@UseGuards(Auth42Guard)
	auth42Login () {}

	@Roles([UserRoleType.Guest])
	@Get('callback')
	@UseGuards(Auth42Guard)
	async auth42Callback(@Req() req: any, @Res() res: Response) {
		// req.user is the user returned from the validate() function in the FortyTwoStrategy class
		const user42 = req?.user;

		if (!user42) {
			this.logger.error('No user returned from FortyTwoStrategy.validate()');
			throw new BadRequestException('42 Authentication failed, no user recieved');
		}

		const user42Dto = new User42Dto();
		user42Dto.id42 = user42?.id42;
		user42Dto.login = user42?.login;
		user42Dto.displayName = user42?.displayName;
		user42Dto.accessToken = user42?.accessToken;
		user42Dto.refreshToken = user42?.refreshToken;

		await validateOrReject(user42Dto)
		.catch(errors => {
			this.logger.error(`42 Authentication failed, invalid user recieved! ${errors}`);
			throw new BadRequestException(`42 Authentication failed, invalid user recieved!`);
		});

		this.Auth42Service.storeUser(
			user42?.id42,
			user42?.login,
			user42?.displayName,
			user42?.accessToken,
			user42?.refreshToken,
			res,
		)
	}
}

