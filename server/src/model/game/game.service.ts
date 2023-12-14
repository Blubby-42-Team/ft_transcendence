/*
	Model Game Service
*/

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

	async deleteLobby(roomId: string, userId: number) {
		const checkLobby = this.gameService.getLobby(roomId);

		//TODO need to check, at the moment auth is not working
		if (checkLobby.owner_id !== userId) {
			this.logger.error(`User ${userId} is not the owner of lobby ${roomId}`);
			throw new UnauthorizedException(`User ${userId} is not the owner of lobby ${roomId}`);
		}
		return this.gameService.deleteLobby(roomId, userId);
	}
}