import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { PictureService } from './picture.service';
import { log } from 'console';
import { DTO_addPicture } from './picture.dto';
import { DTO_getUserById } from '../user/user.dto';

@Controller('picture')
export class PictureController {

	constructor (
		private readonly pictureService: PictureService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id')
	async getPictureById(@Param() params: DTO_getUserById) {
		log(`Get picture by id ${params.id}`);
		return await this.pictureService.getPicture(params.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Post('/')
	async addPicture(
		@Body() body: DTO_addPicture,
	) {
		log(`Add picture`);
		return await this.pictureService.uploadPicture(body.pictureData);
	}
}
