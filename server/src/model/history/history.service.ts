import { Injectable, Logger } from '@nestjs/common';
import { History } from './history.class';
import { PostgresHistoryService } from 'src/service/postgres/history/history.service';
import { PostgresStatsService } from 'src/service/postgres/stats/stats.service';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { EGameType } from '@shared/types/history';

@Injectable()
export class ModelHistoryService {
	constructor (
		private readonly postgresHistoryService: PostgresHistoryService,
		private readonly postgresUserService: PostgresUserService,
		private readonly postgresStatsService: PostgresStatsService,
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
			duration: number,
		) {
			await this.postgresUserService.getUserById(userId);
			await this.postgresUserService.getUserById(opp_id);
			await this.postgresHistoryService.addHistory(userId, opp_id, game_type, player_score, opp_score, duration);
			await this.postgresHistoryService.addHistory(opp_id, userId, game_type, opp_score, player_score, duration);
			await this.postgresStatsService.addPlayedMatch(userId);
			await this.postgresStatsService.addPlayedMatch(opp_id);
			const player_mmr = await this.postgresStatsService.getMMRByUserId(userId);
			const opp_mmr = await this.postgresStatsService.getMMRByUserId(opp_id);
			let newPlayerMMR = 0;
			let newOppMMR = 0;
			for(let i = 0; i < player_score; i++) {
				await this.postgresStatsService.addClassicPointWon(userId);
			}
			for(let i = 0; i < opp_score; i++) {
				await this.postgresStatsService.addClassicPointLost(userId);
			}
			for(let i = 0; i < opp_score; i++) {
				await this.postgresStatsService.addClassicPointWon(opp_id);
			}
			for(let i = 0; i < player_score; i++) {
				await this.postgresStatsService.addClassicPointLost(opp_id);
			}
			// if (player_score > opp_score){
			// 	newPlayerMMR = Math.max(player_mmr + 32 * (1 - 1/(1 + 10**((opp_mmr - player_mmr)/400))), 100);
			// 	newOppMMR = Math.max(opp_mmr + 32 * (0 - 1/(1 + 10**((player_mmr - opp_mmr)/400))), 100);
			// }
			// else {
			// 	newPlayerMMR = Math.max(player_mmr + 32 * (0 - 1/(1 + 10**((opp_mmr - player_mmr)/400))), 100);
			// 	newOppMMR = Math.max(opp_mmr + 32 * (1 - 1/(1 + 10**((player_mmr - opp_mmr)/400))), 100);
			// }
			await this.postgresStatsService.ModifyClassicMMR(userId, newPlayerMMR);
			await this.postgresStatsService.ModifyClassicMMR(opp_id, newOppMMR);

			return 'ok'
	}
}