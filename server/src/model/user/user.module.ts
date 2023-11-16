/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserService } from './user.service';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';

@Module({
	imports: [PostgresUserModule],
	providers: [ModelUserService],
	exports: [ModelUserService]
})
export class ModelUserModule {}
