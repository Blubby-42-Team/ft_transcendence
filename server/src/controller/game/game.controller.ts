import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { GatewayGameService } from './gateway.game.service';

@Controller('game')
export class GameController {

	constructor (
		private readonly gatewayGameService: GatewayGameService,
	) {}

	@Roles([UserRoleType.Guest])
	@Get('/room')
	async getRooms() {
	}

	@Roles([UserRoleType.Guest])
	@Get('/room/:id')
	async getRoomData() {
	}

	@Roles([UserRoleType.Guest])
	@Delete('/room/:id')
	async deleteRoom(@Param('id') id: string) {
		// await this.gatewayGameService.deleteLobby(id);//TODO WIP
		return 'ok'
	}

}
