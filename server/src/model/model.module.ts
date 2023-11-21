/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserModule } from './user/user.module';
import { ModelUser42Module } from './user42/user42.module';

@Module({
	imports: [ModelUserModule, ModelUser42Module],
	controllers: [],
	providers: [],
})
export class ModelModule { }
