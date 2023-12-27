/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ModelGameService } from '../../model/game/game.service';
import { Socket } from 'socket.io';

@Injectable()
export class GatewayGameService {
	
	constructor(
		private readonly modelGameService: ModelGameService,
	) {}

	async joinAGame(roomId: string, userId: number, Socket: Socket) {
		return this.modelGameService.joinAGame(roomId, userId, Socket);
	}

	async createAGame(userId: number) {
		return this.modelGameService.createAGame(userId);
	}

	/**
	 * Delete the lobby of the user
	 * @param userId Id of the user
	 * @returns
	 * @throws NotFoundException if the user does not own a lobby
	 */
	async stopMyGame(userId: number) {
		return this.modelGameService.stopMyGame(userId);
	}

	/**
	 * Add in the new user in the white list of the owner lobby
	 * @param ownerId Id of the owner of the lobby
	 * @param userId Id of the user to add in the white list
	 * @returns
	 */
	async addPlayerToMyGame(ownerId: number, userId: number) {
		return this.modelGameService.addPlayerToMyGame(ownerId, userId);
	}

	/**
	 * Remove a user from the white list of the owner lobby
	 * @param ownerId Id of the owner of the lobby
	 * @param userId Id of the user to remove from the white list
	 * @returns
	 */


	/**
	 * Handle move request from the client
	 * @param userId Id of the user
	 * @param direction Direction of the move
	 * @param press True if the user press the key, false if he release it
	 * @returns Aknowledgement 'ok'
	 */
	async move(userId: number, direction: string, press: boolean) {
}
