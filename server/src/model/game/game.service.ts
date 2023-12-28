/*
	Model Game Service
*/

import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GameService } from '../../service/game/game.service';
import { Socket } from 'socket.io';
import { EmitGateway } from 'src/service/game/emit.gateway';
import { disconnectClientFromTheLobbyWSResponse } from '@shared/dto/ws.dto';
import { PostgresUserService } from 'src/service/postgres/user/user.service';

@Injectable()
export class ModelGameService {

	private readonly logger = new Logger(ModelGameService.name);

	constructor(
		private readonly gameService: GameService,
		private readonly emitGAteway: EmitGateway,
		private readonly userService: PostgresUserService,
	) {}


	async readyOrNot(userId: number, ready: boolean) {
		return this.gameService.readyOrNot(userId, ready);
	}

	/**
	 * Handle the disconnection of a client
	 * Will try to find the user id of the socket, then the lobby of the user
	 * and finally disconnect all players from the lobby before deleting it
	 * @param client Socket of the client
	 * @throws NotFoundException if the lobby does not exist
	 * @throws NotFoundException if the user does not exist
	 */
	async clientDisconnect(client: Socket) {

		// Try to find the user id of the socket
		const userId = await this.gameService.findUserIdOfActiveSocket(client.id)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`No active user found with socket id ${client.id}`);
				return undefined;
			}
			throw err;
		})

		if (userId === undefined) {
			return;
		}

		// Try to find the lobby of the user
		const lobby = await this.gameService.findUserInLobbys(userId)
		.then((lobby) => {
			return lobby;
		})
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`User ${userId} does not own a lobby`);
			}
			throw err;
		});

		if (lobby === undefined) {
			return;
		}

		const user_diplay_name = await this.userService.getUserById(userId)
		.then((user) => {
			return user.display_name;
		})
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`User ${userId} not found`);

				//TODO REMOVE @Matthew-Dreemurr this is a temp fix
				return '//TODO REMOVE @Matthew-Dreemurr this is a temp fix'
			}
			throw err;
		})

		// Disconnect all players from the lobby before deleting it
		const disconnectMessage: disconnectClientFromTheLobbyWSResponse = {
			reason: 'PlayerLeftTheGame',
			msg: `Player ${user_diplay_name} left the game`,
		}

		await this.gameService.disconnectAllPlayersFromLobby(lobby.room_id, disconnectMessage)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`Lobby ${lobby.room_id} not found`);
			}
			throw err;
		});

		// Delete the lobby
		await this.gameService.deleteLobby(lobby.room_id)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`Lobby ${lobby.room_id} not found`);
			}
			throw err;
		});
	}

	async matchMakingTwoPlayers(userId: number, socket: Socket) {
		return await this.gameService.addPlayerToTwoUserMatchMaking(userId, socket);
	}

	// Feature temporarely disabled @Matthew-Dreemurr #39
	// async joinAGame(roomId: string, userId: number, socket: Socket) {
	// 	return await this.gameService.getLobby(roomId)
	// 	.then(async (lobby) => {
	// 		if (lobby.isInWhiteList(userId) === false) {
	// 			this.logger.debug(`User ${userId} is not in the white list of lobby ${roomId}`);
	// 			throw new UnauthorizedException(`User ${userId} is not in the white list of lobby ${roomId}`);
	// 		}
	// 		await this.gameService.joinPlayerToLobby(lobby.room_id, userId, socket);
	// 	})
	// 	.catch((err) => {
	// 		if (err instanceof NotFoundException) {
	// 			this.logger.debug(`Lobby ${roomId} not found`);
	// 			throw new NotFoundException(`Lobby ${roomId} not found`);
	// 		}
	// 		throw err;
	// 	});
	// }

	/**
	 * Create a lobby for the user and check if the user is not allready in a lobby
	 * or owned one
	 * 
	 * @param userId Id of the user that want to create a lobby
	 * @returns return the room_id of the lobby
	 * @throws BadRequestException if the user is allready in a lobby
	 */
	async createAGame(userId: number) {
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

	async stopMyGame(userId: number) {

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

		return this.gameService.deleteLobby(userLobby.room_id);
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
	async addPlayerToMyGame(ownerId: number, userId: number) {

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