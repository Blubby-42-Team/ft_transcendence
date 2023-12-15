import { Module } from '@nestjs/common';
import { PostgresSettingsService } from './settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../../../model/settings/settings.class';

@Module({
	providers: [PostgresSettingsService],
	imports: [TypeOrmModule.forFeature([Settings])],
	exports: [PostgresSettingsService],
})
export class PostgresSettingsModule {}
