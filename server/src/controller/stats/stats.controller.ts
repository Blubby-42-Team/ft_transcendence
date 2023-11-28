import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { DTO_getStatsByUserId, DTO_matchEnd } from './stats.dto';
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

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/end/match/classic/:id')
	async classicMatchEnd(
		@Param() params: DTO_getStatsByUserId,
		@Body() body: DTO_matchEnd,
	) {
		log(`Update stats by user id ${params.id}`);
		await this.statsService.classicMatchEnd(params.id, body.points_won, body.points_lost)
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/end/match/random/:id')
	async randomMatchEnd(
		@Param() params: DTO_getStatsByUserId,
		@Body() body: DTO_matchEnd,
	) {
		log(`Update stats by user id ${params.id}`);
		await this.statsService.randomMatchEnd(params.id, body.points_won, body.points_lost)
	}

}