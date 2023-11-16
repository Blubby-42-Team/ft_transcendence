import { UserService } from './user.service';
import { UserController } from './user.controller';

import { Module } from '@nestjs/common';
import { ModelUserModule } from 'src/model/user/user.module';

@Module({
	imports: [
		ModelUserModule
	],
	controllers: [
		UserController,
	],
	providers: [
		UserService,
	],
})
export class ControllerUserModule { }
