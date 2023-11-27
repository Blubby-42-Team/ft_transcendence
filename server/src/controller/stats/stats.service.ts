import { Injectable, Logger } from '@nestjs/common';
import { ModelStatsService } from 'src/model/stats/stats.service';

@Injectable()
export class StatsService {

	constructor(
		private readonly modelStatsService: ModelStatsService,
	) {}

	private readonly logger = new Logger(ModelStatsService.name);
	
	async getStatsByUserId(userId: number) {
		return await this.modelStatsService.getStatsByUserId(userId);
	}

	async addPlayedMatch(userId: number) {
		return await this.modelStatsService.addPlayedMatch(userId);
	}

	async addClassicWon(userId: number) {
		return await this.modelStatsService.addClassicWon(userId);
	}

	async addClassicLose(userId: number) {
		return await this.modelStatsService.addClassicLose(userId);
	}

	async addClassicPointWon(userId: number) {
		return await this.modelStatsService.addClassicPointWon(userId);
	}

	async addClassicPointLost(userId: number) {
		return await this.modelStatsService.addClassicPointLost(userId);
	}

	async addRandomWon(userId: number) {
		return await this.modelStatsService.addRandomWon(userId);
	}

	async addRandomLose(userId: number) {
		return await this.modelStatsService.addRandomLose(userId);
	}

	async addRandomPointWon(userId: number) {
		return await this.modelStatsService.addRandomPointWon(userId);
	}

	async addRandomPointLost(userId: number) {
		return await this.modelStatsService.addRandomPointLost(userId);
	}

	async ModifyClassicMMR(userId: number) {
		return await this.modelStatsService.ModifyClassicMMR(userId);
	}

	async ModifyRandomMMR(userId: number) {
		return await this.modelStatsService.ModifyRandomMMR(userId);
	}
}