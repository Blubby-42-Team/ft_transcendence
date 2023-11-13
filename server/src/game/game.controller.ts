import { Body, Controller, Headers, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';

@Controller('game')
export class GameController {

	constructor (private readonly gameService: GameService,
		private readonly gameGateway: GameGateway) {}

	@Post('/room/create')
	async createRoom(@Headers() head: any): Promise<any/*//TODO create dto*/> {
		//TODO check jwt in head

		const room = await this.gameService.createRoom();
		this.gameService.startRoom(room, this.gameGateway.server);
		return {room_id: room};
	}
}
