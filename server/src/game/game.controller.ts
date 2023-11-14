import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameOptDto, GameRoomIdDto } from '@shared/game.dto';
import { get } from 'http';

@Controller('game')
export class GameController {

	constructor (private readonly gameService: GameService,
		private readonly gameGateway: GameGateway) {}

	@Get('/room')
	async getRoom(@Headers() head: any): Promise<GameRoomIdDto> {

		//TODO check jwt in head

		return new GameRoomIdDto("//TODO");
	}

	@Post('/room/create')
	async createRoom(@Headers() head: any): Promise<GameRoomIdDto> {
		//TODO check jwt in head
		const user_id = '123';

		const room = await this.gameService.createRoom(user_id);

		return new GameRoomIdDto(room);
	}

	@Post('/room/start')
	async startRoom(@Headers() head: any, @Body() body: GameOptDto): Promise<any/*//TODO create dto*/> {
		//TODO check jwt in head

		// TODO start room later
		// NOTE: Dont run this with await, it need to be run in background
		this.gameService.startRoom(body.game_room_id, body, this.gameGateway.server);
		return "ok";
	}
}
