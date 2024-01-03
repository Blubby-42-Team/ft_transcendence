/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserService } from './user.service';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { ModelUser42Service } from './user42.service';
import { PostgresUser42Module } from 'src/service/postgres/user42/user42.module';
import { PostgresChatModule } from 'src/service/postgres/chat/chat.module';
import { TelemetryModule } from 'src/service/telemetry/telemetry.module';
import { PostgresPictureModule } from 'src/service/postgres/picture/picture.module';

@Module({
	imports: [
		PostgresUserModule,
		PostgresUser42Module,
		PostgresChatModule,
		TelemetryModule,
	],
	providers: [ModelUserService, ModelUser42Service],
	exports: [ModelUserService, ModelUser42Service]
})
export class ModelUserModule {}
