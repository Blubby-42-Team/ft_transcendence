/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserService } from './user.service';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { ModelUser42Service } from './user42.service';

@Module({
	imports: [PostgresUserModule],
	providers: [ModelUserService, ModelUser42Service],
	exports: [ModelUserService]
})
export class ModelUserModule {}
