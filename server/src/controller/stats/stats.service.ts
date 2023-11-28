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

	async classicMatchEnd(
		userId: number,
		pointsWon: number,
		pointsLost: number)
		{
		await this.modelStatsService.addPlayedMatch(userId);
		for(let i = 0; i < pointsWon; i++) {
			await this.modelStatsService.addClassicPointWon(userId);
		}
		for(let i = 0; i < pointsLost; i++) {
			await this.modelStatsService.addClassicPointLost(userId);
		}
		if (pointsWon > pointsLost){
			await this.modelStatsService.addClassicWon(userId);
		}
		else {
			await this.modelStatsService.addClassicLose(userId);
		}
		//TODO Modify Classic MMR
	}

	async randomMatchEnd(
		userId: number,
		pointsWon: number,
		pointsLost: number)
		{
		await this.modelStatsService.addPlayedMatch(userId);
		for(let i = 0; i < pointsWon; i++) {
			await this.modelStatsService.addRandomPointWon(userId);
		}
		for(let i = 0; i < pointsLost; i++) {
			await this.modelStatsService.addRandomPointLost(userId);
		}
		if (pointsWon > pointsLost){
			await this.modelStatsService.addRandomWon(userId);
		}
		else {
			await this.modelStatsService.addRandomLose(userId);
		}
		//TODO Modify Random MMR
	}
}

