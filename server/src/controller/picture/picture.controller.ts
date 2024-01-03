import { Controller, Get, Param, Body, Post, UploadedFile, UseInterceptors, Res, ParseIntPipe, StreamableFile, BadRequestException } from '@nestjs/common';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { PictureService } from './picture.service';
import { log } from 'console';
import { DTO_addPicture } from './picture.dto';
import { DTO_getUserById } from '../user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'node:stream';
import { Response } from 'express';

@Controller('picture')
export class PictureController {

	constructor (
		private readonly pictureService: PictureService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get(':id')
  	async getDatabaseFileById(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) response: Response) {
		const file = await this.pictureService.getPicture(id);
	
		const stream = Readable.from(file.data);
	
		response.set({
		'Content-Disposition': `inline; filename="${file.filename}"`,
		'Content-Type': 'image'
    	})
 
    	return new StreamableFile(stream);
  }
}
