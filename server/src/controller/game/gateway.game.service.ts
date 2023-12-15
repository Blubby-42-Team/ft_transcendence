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

	async joinALobby(roomId: string, userId: number) {
		return this.modelGameService.joinALobby(roomId, userId);
	}

	async createLobby(userId: number) {
		return this.modelGameService.createLobby(userId);
	}

	/**
	 * Delete the lobby of the user
	 * @param userId Id of the user
	 * @returns
	 * @throws NotFoundException if the user does not own a lobby
	 */
	async deleteMyLobby(userId: number) {
		return this.modelGameService.deleteMyLobby(userId);
	}

	/**
	 * Add in the new user in the white list of the owner lobby
	 * @param ownerId Id of the owner of the lobby
	 * @param userId Id of the user to add in the white list
	 * @returns
	 */
	async addPlayerToMyWhiteList(ownerId: number, userId: number) {
		return this.modelGameService.addPlayerToMyWhiteList(ownerId, userId);
	}
}
