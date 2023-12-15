import { Injectable, Logger } from '@nestjs/common';
import { Stats } from './stats.class';
import { PostgresStatsService } from 'src/service/postgres/stats/stats.service';

@Injectable()
export class ModelStatsService {
	constructor (
		private readonly postgresStatsService: PostgresStatsService,
	) {}
	
	private readonly logger = new Logger(ModelStatsService.name);

	async getStatsByUserId(userId: number): Promise<Stats> {
		return await this.postgresStatsService.getStatsByUserId(userId);
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