/*
	Model Game Service
*/

import { Injectable, Logger } from '@nestjs/common';
import { GameService } from 'src/service/game/game.service';

@Injectable()
export class ModelGameService {

	private readonly logger = new Logger(ModelGameService.name);

	constructor(
		private readonly gameService: GameService
	) {}

	async createLobby(userId: number) {
		return this.gameService.createLobby(userId);
	}

	async deleteLobby(roomId: string) {
		return this.gameService.deleteLobby(roomId);
	}
}