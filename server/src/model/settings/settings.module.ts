/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelSettingsService } from './settings.service';
import { PostgresSettingsModule } from 'src/service/postgres/settings/settings.module';

@Module({
	imports: [PostgresSettingsModule],
	providers: [ModelSettingsService],
	exports: [ModelSettingsService]
})
export class ModelSettingsModule {}
