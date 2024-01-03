import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';

import { Module } from '@nestjs/common';
import { ModelPictureModule } from 'src/model/picture/picture.module';

@Module({
	imports: [
		ModelPictureModule
	],
	controllers: [
		PictureController,
	],
	providers: [
		PictureService,
	],
})
export class ControllerPictureModule { }
