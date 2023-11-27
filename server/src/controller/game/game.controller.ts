import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { GameService } from '../../service/game/game.service';
import { GameOptDto, GameRoomIdDto } from '@shared/dto/game.dto';
import { get } from 'http';
import { GameGateway } from './game.gateway';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';

@Controller('game')
export class GameController {

	constructor (private readonly gameService: GameService,
		private readonly gameGateway: GameGateway) {}

	@Roles([UserRoleType.Guest])
	@Get('/room')
	async getRoom(@Headers() head: any): Promise<GameRoomIdDto> {

		//TODO check jwt in head
		this.gameService.test();

		return new GameRoomIdDto("//TODO");
	}

	// @Roles([UserRoleType.Guest])
	// @Post('/room/create')
	// async createRoom(@Headers() head: any): Promise<GameRoomIdDto> {
	// 	//TODO check jwt in head
	// 	const user_id = '123';

	// 	const room = await this.gameService.createRoom(user_id);

	// 	return new GameRoomIdDto(room);
	// // }

	@Roles([UserRoleType.Guest])
	@Post('/room/start')
	async startRoom(@Headers() head: any, @Body() body: GameOptDto): Promise<any/*//TODO create dto*/> {
		//TODO check jwt in head

		// TODO start room later
		// NOTE: Dont run this with await, it need to be run in background
		// this.gameService.startRoom(body.game_room_id, body, this.gameGateway.server);
		return "ok";
	}
}
