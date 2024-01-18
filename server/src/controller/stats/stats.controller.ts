import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { DTO_getStatsByUserId } from './stats.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { StatsService } from './stats.service';
import { log } from 'console';

@Controller('stats')
export class StatsController {

	constructor (
		private readonly statsService: StatsService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id')
	async getStatsByUserId(@Param() params: DTO_getStatsByUserId) {
		log(`Get stats by user id ${params.id}`);
		return await this.statsService.getStatsByUserId(params.id);
	}
}