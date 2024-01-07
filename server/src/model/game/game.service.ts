/*
	Model Game Service
*/

import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GameService } from '../../service/game/game.service';
import { Socket } from 'socket.io';
import { EmitGateway } from 'src/service/game/emit.gateway';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { LobbyInstance } from './game.class';
import { gameStatusType } from '@shared/types/game/game';
import { ModelHistoryModule } from '../history/history.module';
import { StatsService } from '../../controller/stats/stats.service';
import { HistoryService } from 'src/controller/history/history.service';
import { EGameType } from '@shared/types/history';

@Injectable()
export class ModelGameService {

	private readonly logger = new Logger(ModelGameService.name);

	constructor(
		private readonly gameService: GameService,
		private readonly emitGAteway: EmitGateway,
		private readonly userService: PostgresUserService,
		private readonly controllerStatsService: StatsService,
		private readonly controllerHistoryService: HistoryService,
	) {}

	async joinAGame(roomId: string, userId: number, socket: Socket) {
		await this.gameService.joinA2UserPrivateGame(roomId, userId, socket);
	}

	async readyOrNot(userId: number, ready: boolean) {
		return this.gameService.readyOrNot(userId, ready);
	}

	async move(userId: number, direction: boolean, press: boolean, launch: boolean) {
		return this.gameService.playerMove(userId, direction, press, launch);
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
			this.logger.warn(`Skipping disconnecting client ${client.id} because no user id found`);
			return;
		}

		// Check if user was in matchmaking

		await this.gameService.removePlayerFromTwoUserMatchMaking(userId);

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

				return `User ${userId}`
			}
			throw err;
		})

		// Disconnect all players from the lobby before deleting it
		await this.gameService.disconnectAllPlayersFromLobby(lobby.room_id, `Player ${user_diplay_name} left the game`)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`Lobby ${lobby.room_id} not found`);
			}
			throw err;
		});

		// Delete the lobby
		// await this.gameService.deleteLobby(lobby.room_id)
		// .catch((err) => {
		// 	if (err instanceof NotFoundException) {
		// 		this.logger.debug(`Lobby ${lobby.room_id} not found`);
		// 	}
		// 	throw err;
		// });

		// Stop the game
		await this.stopGame(lobby.room_id)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`Lobby ${lobby.room_id} not found`);
				throw new NotFoundException(`Lobby ${lobby.room_id} not found`);
			}
			this.logger.error(`Failed to stop game ${lobby.room_id}`);
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
	 */
	async createAGame(userId: number) {
		return await this.gameService.findUserInLobbys(userId)
		.then( async (lobby) => {
			if (lobby !== undefined) {
				this.logger.debug(`User ${userId} is already in a lobby, disconnect him first before creating a new one`);
				const disconnectedUser = await this.userService.getUserById(userId)
				.then((user) => {
					return user.display_name;
				})
				.catch((err) => {
					if (err instanceof NotFoundException) {
						this.logger.debug(`User ${userId} not found`);
						return userId;
					}
					throw err;
				})
				await this.gameService.disconnectAllPlayersFromLobby(lobby.room_id, `Player ${disconnectedUser} left the game`);
				// this.gameService.deleteLobby(lobby.room_id);
				await this.stopGame(lobby.room_id)
				.catch((err) => {
					if (err instanceof NotFoundException) {
						throw new NotFoundException(`Lobby ${lobby.room_id} not found`);
						this.logger.debug(`Lobby ${lobby.room_id} not found`);
					}
					this.logger.error(`Failed to stop game ${lobby.room_id}`);
				});
				throw new NotFoundException(`User ${userId} is already in a lobby, disconnect him first before creating a new one`);
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

		await this.stopGame(userLobby.room_id)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`Lobby ${userLobby.room_id} not found`);
				throw new NotFoundException(`Lobby ${userLobby.room_id} not found`);
			}
			this.logger.error(`Failed to stop game ${userLobby.room_id}`);
		});
		return 'ok';
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

	private async stopGame(roomId: string) {
		const lobby = await this.gameService.getLobby(roomId)
		if (lobby === undefined) {
			this.logger.debug(`Lobby ${roomId} not found`);
			throw new NotFoundException(`Lobby ${roomId} not found`);
		}

		let playerData: Array<{userId: number, score: number, mmr: number}> = [];

		const users = lobby.getPlayers();

		for (let userIdString of Object.keys(users)) {
			
			const userId = parseInt(userIdString);

			const mmr = await this.controllerStatsService.getStatsByUserId(userId)
			.then((stats) => {
				return stats.classic_mmr;
			})
			.catch((err) => {
				if (err instanceof NotFoundException) {
					this.logger.debug(`User ${userId} not found`);
					throw new NotFoundException(`User ${userId} not found`);
				}
				throw err;
			});
			playerData.push({
				userId,
				mmr,
				score: 0,
			})
		}

		if (lobby.game.gamestate.player_left.active) {
			playerData[0].score = lobby.game.gamestate.player_left.score;
		} else {
			throw new BadRequestException(`Player left is set`);
		}

		if (lobby.game.gamestate.player_right.active) {
			playerData[1].score = lobby.game.gamestate.player_right.score;
		} else {
			throw new BadRequestException(`Player right is set`);
		}

		await this.controllerHistoryService.addHistoryByUserId(
			playerData[0].userId,
			playerData[1].userId,
			EGameType.Classic,
			playerData[0].score,
			playerData[1].score,
			0,
		);

		if (lobby.game.gamestate.status !== gameStatusType.GAMEOVER) {
			this.logger.warn(`Game ${roomId} is not over, skipping stats update`);
		} else {

			await this.controllerStatsService.classicMatchEnd(
				playerData[0].userId,
				playerData[0].score,
				playerData[1].score,
				playerData[1].mmr,
			);

			await this.controllerStatsService.classicMatchEnd(
				playerData[1].userId,
				playerData[1].score,
				playerData[0].score,
				playerData[0].mmr,
			);

		}

		return this.gameService.deleteLobby(roomId);
	}
}