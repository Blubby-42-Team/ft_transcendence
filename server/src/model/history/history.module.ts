/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelHistoryService } from './history.service';
import { PostgresHistoryModule } from 'src/service/postgres/history/history.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { PostgresStatsModule } from 'src/service/postgres/stats/stats.module';

@Module({
	imports: [PostgresHistoryModule, PostgresUserModule, PostgresStatsModule],
	providers: [ModelHistoryService],
	exports: [ModelHistoryService]
})
export class ModelHistoryModule {}
