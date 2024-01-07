import { Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/auth/role.decorator';
import { UserAuthTokenDto, UserRoleType } from 'src/auth/auth.class';
import { ModelGameService } from 'src/model/game/game.service';
import { UserAuthTOkentPayload } from 'src/auth/auth.decorator';

@Controller('game')
export class GameController {

	constructor (
		private readonly modelGameService: ModelGameService,
	) {}

	@Roles([UserRoleType.Guest])
	@Get('/room')
	async getRooms() {
		return this.modelGameService.getAllLobbysPublicData();
	}

	@Roles([UserRoleType.Guest])
	@Post('/private/:invitedUserId')
	async inviteUser(
		@Param('invitedUserId') invitedUserId: number,
		@UserAuthTOkentPayload() user: UserAuthTokenDto,
	) {
		const roomId = await this.modelGameService.createAGame(user.userId);
		await this.modelGameService.addPlayerToMyGame(user.userId, invitedUserId);
		return roomId;
	}
}
