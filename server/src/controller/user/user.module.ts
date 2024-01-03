import { UserService } from './user.service';
import { UserController } from './user.controller';

import { Module } from '@nestjs/common';
import { ModelUserModule } from 'src/model/user/user.module';
import { UserGateway } from './user.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ModelPictureModule } from 'src/model/picture/picture.module';

@Module({
	imports: [
		ModelUserModule,
		ModelPictureModule,
		AuthModule,
	],
	controllers: [
		UserController,
	],
	providers: [
		UserService,
		UserGateway,
	],
})
export class ControllerUserModule { }
