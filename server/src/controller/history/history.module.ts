import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

import { Module } from '@nestjs/common';
import { ModelHistoryModule } from 'src/model/history/history.module';

@Module({
	imports: [
		ModelHistoryModule
	],
	controllers: [
		HistoryController,
	],
	providers: [
		HistoryService,
	],
	exports: [
		HistoryService,
	],
})
export class ControllerHistoryModule { }
