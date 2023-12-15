/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelStatsService } from './stats.service';
import { PostgresStatsModule } from 'src/service/postgres/stats/stats.module';

@Module({
	imports: [PostgresStatsModule],
	providers: [ModelStatsService],
	exports: [ModelStatsService]
})
export class ModelStatsModule {}