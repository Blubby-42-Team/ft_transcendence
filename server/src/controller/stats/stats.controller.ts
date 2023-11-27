import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
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
	@Patch('/:id')
	async ClassicMatchEnd(
		@Param() params: DTO_getStatsByUserId,
		@Body() body: DTO_matchEnd,
	) {
		log(`Update stats by user id ${params.id}`);
		await this.statsService.addPlayedMatch(params.id);
		for(let i = 0; i < body.points_won; i++) {
			await this.statsService.addClassicPointWon(params.id);
		}
		for(let i = 0; i < body.points_lost; i++) {
			await this.statsService.addClassicPointLost(params.id);
		}
		if (body.game_won){
			await this.statsService.addClassicWon(params.id);
		}
		else {
			await this.statsService.addClassicLose(params.id);
		}
		//TODO Modify Classic MMR
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id')
	async RandomMatchEnd(
		@Param() params: DTO_getStatsByUserId,
		@Body() body: DTO_matchEnd,
	) {
		log(`Update stats by user id ${params.id}`);
		await this.statsService.addPlayedMatch(params.id);
		for(let i = 0; i < body.points_won; i++) {
			await this.statsService.addRandomPointWon(params.id);
		}
		for(let i = 0; i < body.points_lost; i++) {
			await this.statsService.addRandomPointLost(params.id);
		}
		if (body.game_won){
			await this.statsService.addRandomWon(params.id);
		}
		else {
			await this.statsService.addRandomLose(params.id);
		}
		//TODO Modify Random MMR
	}

}