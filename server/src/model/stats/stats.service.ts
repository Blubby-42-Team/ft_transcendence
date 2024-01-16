import { Injectable, Logger } from '@nestjs/common';
import { PostgresStatsService } from 'src/service/postgres/stats/stats.service';

@Injectable()
export class ModelStatsService {
	constructor (
		private readonly postgresStatsService: PostgresStatsService,
	) {}
	
	private readonly logger = new Logger(ModelStatsService.name);

	async getStatsByUserId(userId: number) {
		const stats = await this.postgresStatsService.getStatsByUserId(userId);
		let res = {
			classic_match_played: stats.played_matchs,
			classic_ranking: await this.postgresStatsService.getClassicRankByUserId(userId),
			classic_mmr: stats.classic_mmr,
			classic_winrate: 100 * stats.classic_match_won / stats.played_matchs,
			classic_average_point: stats.classic_match_points_won / stats.played_matchs,
		}
		if (!res.classic_winrate || isNaN(res.classic_winrate) || !isFinite(res.classic_winrate))
			res.classic_winrate = 0;
		if  (!res.classic_winrate || isNaN(res.classic_winrate) || !isFinite(res.classic_winrate))
			res.classic_average_point = 0;
		return res;
	}

	async addPlayedMatch(userId: number) {
		return await this.postgresStatsService.addPlayedMatch(userId);
	}

	async addClassicWon(userId: number) {
		return await this.postgresStatsService.addClassicWon(userId);
	}

	async addClassicLose(userId: number) {
		return await this.postgresStatsService.addClassicLose(userId);
	}

	async addClassicPointWon(userId: number) {
		return await this.postgresStatsService.addClassicPointWon(userId);
	}

	async addClassicPointLost(userId: number) {
		return await this.postgresStatsService.addClassicPointLost(userId);
	}

	async ModifyClassicMMR(userId: number, score: number, oppMMR: number) {
		return await this.postgresStatsService.ModifyClassicMMR(userId, score);
	}
}