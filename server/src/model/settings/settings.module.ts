/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelSettingsService } from './settings.service';
import { PostgresSettingsModule } from 'src/service/postgres/settings/settings.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';

@Module({
	imports: [PostgresSettingsModule,PostgresUserModule],
	providers: [ModelSettingsService],
	exports: [ModelSettingsService]
})
export class ModelSettingsModule {}
