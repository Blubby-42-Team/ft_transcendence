import { Injectable, Logger } from '@nestjs/common';
import { Stats } from './stats.class';
import { PostgresStatsService } from 'src/service/postgres/stats/stats.service';

@Injectable()
export class ModelStatsService {
	constructor (
		private readonly postgresStatsService: PostgresStatsService,
	) {}
	
	private readonly logger = new Logger(ModelStatsService.name);

	async getStatsByUserId(userId: number) {
		const stats = await this.postgresStatsService.getStatsByUserId(userId);
		return {
			classic_match_played: stats.classic_match_won + stats.classic_match_lost,
			classic_ranking: await this.postgresStatsService.getClassicRankByUserId(userId),
			classic_mmr: stats.classic_mmr,
			classic_winrate: (stats.classic_match_won / (stats.classic_match_won + stats.classic_match_lost)) * 100,
			classic_average_point: stats.classic_match_points_won / (stats.classic_match_won + stats.classic_match_lost),
			random_match_played: stats.random_match_won + stats.random_match_lost,
			random_ranking: await this.postgresStatsService.getRandomRankByUserId(userId),
			random_mmr: stats.random_mmr,
			random_winrate: (stats.random_match_won / (stats.random_match_won + stats.random_match_lost)) * 100,
			random_average_point: stats.random_match_points_won / (stats.random_match_won + stats.random_match_lost),
		}
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

	async addRandomWon(userId: number) {
		return await this.postgresStatsService.addRandomWon(userId);
	}

	async addRandomLose(userId: number) {
		return await this.postgresStatsService.addRandomLose(userId);
	}

	async addRandomPointWon(userId: number) {
		return await this.postgresStatsService.addRandomPointWon(userId);
	}

	async addRandomPointLost(userId: number) {
		return await this.postgresStatsService.addRandomPointLost(userId);
	}

	async ModifyClassicMMR(userId: number, score: number, oppMMR: number) {
		return await this.postgresStatsService.ModifyClassicMMR(userId, score, oppMMR);
	}

	async ModifyRandomMMR(userId: number, score: number, oppMMR: number) {
		return await this.postgresStatsService.ModifyRandomMMR(userId, score, oppMMR);
	}
}