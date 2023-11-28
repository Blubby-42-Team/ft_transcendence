/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelHistoryService } from './history.service';
import { PostgresHistoryModule } from 'src/service/postgres/history/history.module';

@Module({
	imports: [PostgresHistoryModule],
	providers: [ModelHistoryService],
	exports: [ModelHistoryService]
})
export class ModelHistoryModule {}
