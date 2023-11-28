import { Controller, Get } from '@nestjs/common';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';

@Controller('game')
export class GameController {

	constructor (
		) {}

	@Roles([UserRoleType.Guest])
	@Get('/room')
	async getRooms() {
	}

	@Roles([UserRoleType.Guest])
	@Get('/room/:id')
	async getRoomData() {
	}

}
