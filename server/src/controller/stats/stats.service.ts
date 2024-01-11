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
}

