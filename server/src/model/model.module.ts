/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserModule } from './user/user.module';
import { ModelGameModule } from './game/game.module';

@Module({
	imports: [
		ModelUserModule,
		ModelGameModule,
	],
	controllers: [],
	providers: [],
})
export class ModelModule { }
