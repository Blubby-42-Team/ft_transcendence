import { Body, Controller, Headers, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameOptDto } from '@shared/ws.dto';

@Controller('game')
export class GameController {

	constructor (private readonly gameService: GameService,
		private readonly gameGateway: GameGateway) {}

	@Post('/room/create')
	async createRoom(@Headers() head: any): Promise<any/*//TODO create dto*/> {
		//TODO check jwt in head

		const room = await this.gameService.createRoom();

		return {room_id: room};
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
