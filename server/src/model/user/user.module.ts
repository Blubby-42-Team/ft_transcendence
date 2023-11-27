/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserService } from './user.service';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { ModelUser42Service } from './user42.service';
import { PostgresUser42Module } from 'src/service/postgres/user42/user42.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [PostgresUserModule, PostgresUser42Module],
	providers: [ModelUserService, ModelUser42Service],
	exports: [ModelUserService, ModelUser42Service]
})
export class ModelUserModule {}
