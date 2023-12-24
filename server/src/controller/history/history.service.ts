import { Injectable } from '@nestjs/common';
import { ModelHistoryService } from 'src/model/history/history.service';
import { EGameType } from '@shared/types/history'

@Injectable()
export class HistoryService {

	constructor(
		private readonly modelHistoryService: ModelHistoryService,
	) {}

	async getHistoryByUserId(id: number) {
		return await this.modelHistoryService.getHistoryByUserId(id);
	}

	async addHistoryByUserId(
		id: number,
		opp_id: number,
		game_type: EGameType,
		player_score: number,
		opp_score: number,
		date: Date,
		duration: number
		) {
		return await this.modelHistoryService.addHistoryByUserId(id, opp_id, game_type, player_score, opp_score, date, duration);
	}
}
