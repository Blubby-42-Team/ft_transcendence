/*
	Model Game Service
*/

import { Injectable, Logger } from '@nestjs/common';
import { GameService } from '../../service/game/game.service';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { StatsService } from '../../controller/stats/stats.service';
import { HistoryService } from 'src/controller/history/history.service';

@Injectable()
export class ModelGameService {
	private readonly logger = new Logger(ModelGameService.name);

	constructor(
		private readonly gameService: GameService,
		private readonly userService: PostgresUserService,
		private readonly controllerStatsService: StatsService,
		private readonly controllerHistoryService: HistoryService,
	) {}
}