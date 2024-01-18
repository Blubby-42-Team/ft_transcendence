import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { DTO_addHistory, DTO_getHistoryByUserId } from './history.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { HistoryService } from './history.service';
import { log } from 'console';

@Controller('history')
export class HistoryController {

	constructor (
		private readonly historyService: HistoryService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id')
	async getHistoryByUserId(@Param() params: DTO_getHistoryByUserId) {
		log(`Get history by user id ${params.id}`);
		return await this.historyService.getHistoryByUserId(params.id);
	}
}
