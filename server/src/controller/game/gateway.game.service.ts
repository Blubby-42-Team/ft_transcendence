/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ModelGameService } from '../../model/game/game.service';

@Injectable()
export class GatewayGameService {
	
	constructor(
		private readonly modelGameService: ModelGameService,
	) {}

	async createLobby(userId: number) {
		return this.modelGameService.createLobby(userId);
	}

	async deleteLobby(roomId: string) {
		return this.modelGameService.deleteLobby(roomId);
	}
}
