/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUser42Service } from './user42.service';
import { PostgresUser42Module } from 'src/service/postgres/user42/user42.module';

@Module({
	imports: [PostgresUser42Module],
	providers: [ModelUser42Service],
	exports: [ModelUser42Service]
})
export class ModelUser42Module {}
