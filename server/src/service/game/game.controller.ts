import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { DTO_CreateRoom } from './game.dto';
import { UserRoleType } from 'src/auth/auth.class';
import { Roles } from 'src/auth/role.decorator';

@Controller('game')
export class GameController {
	constructor (
		private readonly gameService: GameService,
	) {}

	@Post()
	@Roles([UserRoleType.Admin, UserRoleType.Guest])
	createRoom(
		@Body() body: DTO_CreateRoom,
	) {
		return this.gameService.createPrivateParty(body.userId, {
			maxPoint: body.max_round,
			ballSize: body.ball_size,
			padSize: body.pad_size,
		});
	}
}
