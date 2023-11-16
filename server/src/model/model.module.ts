/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserModule } from './user/user.module';

@Module({
	imports: [ModelUserModule],
	controllers: [],
	providers: [],
})
export class ModelModule { }
