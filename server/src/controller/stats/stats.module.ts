import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

import { Module } from '@nestjs/common';
import { ModelStatsModule } from 'src/model/stats/stats.module';

@Module({
	imports: [
		ModelStatsModule
	],
	controllers: [
		StatsController,
	],
	providers: [
		StatsService,
	],
})
export class ControllerStatsModule { }