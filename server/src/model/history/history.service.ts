import { Injectable, Logger } from '@nestjs/common';
import { History } from './history.class';
import { PostgresHistoryService } from 'src/service/postgres/history/history.service';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { EGameType } from '@shared/types/history';

@Injectable()
export class ModelHistoryService {
	constructor (
		private readonly postgresHistoryService: PostgresHistoryService,
		private readonly postgresUserService: PostgresUserService,
	) {}
	
	private readonly logger = new Logger(ModelHistoryService.name);

	async getHistoryByUserId(userId: number): Promise<History> {
		await this.postgresUserService.getUserById(userId);
		return await this.postgresHistoryService.getHistoryByUserId(userId);
	}
	
	async addHistoryByUserId(
			userId: number,
			opp_id: number,
			game_type: EGameType,
			player_score: number,
			opp_score: number,
			date: Date,
			duration: number,
		) {
			await this.postgresUserService.getUserById(userId);
			await this.postgresUserService.getUserById(opp_id);
			await this.postgresHistoryService.addHistory(userId, opp_id, game_type, player_score, opp_score, date, duration);
			await this.postgresHistoryService.addHistory(opp_id, userId, game_type, opp_score, player_score, date, duration);
			return 'ok'
	}
}