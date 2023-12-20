/*
	Model Game Service
*/

import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GameService } from '../../service/game/game.service';


@Injectable()
export class ModelGameService {

	private readonly logger = new Logger(ModelGameService.name);

	constructor(
		private readonly gameService: GameService
	) {}

	async joinALobby(roomId: string, userId: number) {
		return await this.gameService.findUserInLobbys(userId)
		.then((lobby) => {
			if (lobby !== undefined) {
				this.logger.debug(`User ${userId} is already in the lobby ${lobby.room_id}`);

				if (userId === lobby.owner_id) {
					throw new BadRequestException(`User ${userId} is the owner of the lobby ${lobby.room_id}`);
				}
				throw new BadRequestException(`User ${userId} is already in the lobby ${lobby.room_id}`);
			}
			this.logger.error(`getLobbyByUserId(${userId}) return undefined?!`);
			throw new BadGatewayException(`Create lobby failed!, see logs or contact an admin`);
		})
		.catch((err) => {
			if ((err instanceof NotFoundException) === false) {
				throw err;
			}

			this.logger.debug(`User ${userId} is not in a lobby, add him in the lobby ${roomId}`);

			return this.gameService.addPlayerToLobby(roomId, userId);
		});
	}

	/**
	 * Create a lobby for the user and check if the user is not allready in a lobby
	 * or owned one
	 * 
	 * @param userId Id of the user that want to create a lobby
	 * @returns return the room_id of the lobby
	 * @throws BadRequestException if the user is allready in a lobby
	 */
	async createLobby(userId: number) {
		return await this.gameService.findUserInLobbys(userId)
		.then((lobby) => {
			if (lobby !== undefined) {
				this.logger.debug(`User ${userId} is allready in the lobby ${lobby.room_id}`);
				throw new BadRequestException(`User ${userId} is allready in the lobby ${lobby.room_id}`);
			}
			this.logger.error(`getLobbyByUserId(${userId}) return undefined?!`);
			throw new BadGatewayException(`Create lobby failed!, see logs or contact an admin`);
		})
		.catch((err) => {

			if ((err instanceof NotFoundException) === false) {
				throw err;
			}

			this.logger.debug(`User ${userId} does not own a lobby, create one`);

			return this.gameService.createLobby(userId)
		});
	}

	async deleteMyLobby(userId: number) {

		// Is in a lobby and is the owner
		const userLobby = await this.gameService.findUserInLobbys(userId)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`User ${userId} does not own a lobby, nothing to delete`);
				throw new NotFoundException(`User ${userId} does not own a lobby, nothing to delete`);
			}
			throw err;
		});

		if (userLobby.owner_id !== userId) {
			this.logger.error(`User ${userId} is not the owner of lobby ${userLobby.room_id}`);
			throw new UnauthorizedException(`User ${userId} is not the owner of lobby ${userLobby.room_id}`);
		}

		return this.gameService.disconnectAllPlayerAndDeleteLobby(userLobby.room_id);
	}

	async getAllLobbysPublicData() {
		return this.gameService.getAllLobbysPublicData();
	}

	/**
	 * Add in the new user in the white list of the owner lobby
	 * @param ownerId Id of the owner of the lobby
	 * @param userId Id of the user to add in the white list
	 * @returns 
	 * @throws NotFoundException if the owner does not own a lobby or if the user is the owner of the lobby
	 */
	async addPlayerToMyWhiteList(ownerId: number, userId: number) {

		const userLobby = await this.gameService.findUserInLobbys(ownerId)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`User ${ownerId} does not own a lobby`);
				throw new NotFoundException(`User ${ownerId} does not own a lobby`);
			}
			throw err;
		});

		if (userLobby.owner_id !== ownerId) {
			this.logger.error(`User ${ownerId} is not the owner of lobby ${userLobby.room_id}`);
			throw new UnauthorizedException(`User ${ownerId} is not the owner of lobby ${userLobby.room_id}`);
		}

		return this.gameService.addPlayerToWhiteList(userLobby.room_id, userId);
	}
}