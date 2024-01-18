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
}
