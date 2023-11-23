import { User } from 'src/model/user/user.class';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User42 } from 'src/model/user/user42.class';
import { PostgresUser42Service } from './user42.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, User42])],
	providers: [
		PostgresUser42Service
	],
	exports : [
		PostgresUser42Service
	],
})
export class PostgresUser42Module { }
