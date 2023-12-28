/*
	Service for managing game lobbys and game rooms
 */

import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LobbyInstance } from '../../model/game/game.class';
import { EmitGateway } from './emit.gateway';
import { AuthService } from 'src/auth/auth.service';
import { ModelUserService } from 'src/model/user/user.service';
import { Socket } from 'socket.io';
import { disconnectClientFromTheLobbyResponse, matchMakingResponse } from '@shared/dto/ws.dto';

@Injectable()
export class GameService implements OnModuleInit, OnModuleDestroy {

	constructor (
		private readonly emitGAteway: EmitGateway,
		private readonly authService: AuthService,
	) {}

	private readonly logger = new Logger(GameService.name);

	private lobbys: {
		[key: string]: LobbyInstance;
	} = {};

	private usersInLobby: Map<number, {
		room_id: string,
		connectedClients: Socket[],
	}> = new Map();

	private twoUserMatchMakingQueue: Array<{
		userId: number,
		socket: Socket
	}> = [];

	private matchMakingTwoPlayersInterval: NodeJS.Timeout;
	private readonly matchMakingTwoPlayersIntervalTime = 1000;

	onModuleInit() {
		this.logger.debug(`onModuleInit: start`);
		// Do not await this call
		// Call the matchMakingTwoPlayers function every second
		this.matchMakingLoop()
	}

	async onModuleDestroy() {
		clearInterval(this.matchMakingTwoPlayersInterval);
	}

	async matchMakingLoop() {
		this.matchMakingTwoPlayersInterval = setInterval(() => {
			this.matchMakingTwoPlayers()
			.catch((err) => {
				this.logger.error(`matchMakingTwoPlayers: ${err}`);
			});
		}, this.matchMakingTwoPlayersIntervalTime);
	
	}

	/**
	 * Will try to match the user with another user
	 * @param userId Id of the user
	 * @param socket Socket of the user
	 * @returns 
	 */
	async matchMakingTwoPlayers() {
		if (this.twoUserMatchMakingQueue && this.twoUserMatchMakingQueue.length < 2) {
			return;
		}

		const player1 = await this.getAndPopFristPlayerFromTwoUserMatchMaking();
		const player2 = await this.getAndPopFristPlayerFromTwoUserMatchMaking();

		if (player1 === undefined || player2 === undefined) {
			this.logger.error(`matchMakingTwoPlayers: player1 or player2 is undefined`);
		}

		// Create a lobby
		const lobby_id = await this.createLobby(player1.userId);

		// Join WS of the two players to the lobby

		// Dont need to add the player1 to the white list because he is the owner
		await this.joinPlayerToLobby(lobby_id, player1.userId, player1.socket);

		await this.addPlayerToWhiteList(lobby_id, player2.userId);
		await this.joinPlayerToLobby(lobby_id, player2.userId, player2.socket);


		this.emitGAteway.server.in(lobby_id).emit('matchMakingStatus', {
			status: "ok",
			msg: "Match found, waiting for players to be ready",
		});

		// TODO WIP @Matthew-Dreemurr
		// Emit to the two players that we found an opponent and start the game
		// Start lobby instance and wait for player to be ready
		// Check how to setup the game and settings
		// this.lobbys[lobby_id].startLobby();
		this.logger.debug(`matchMakingTwoPlayers: match found ${player1.userId} ${player2.userId}`);
		this.logger.debug('Starting lobby')
	}

	async getAndPopFristPlayerFromTwoUserMatchMaking(): Promise<{userId: number, socket: Socket}> {
		return this.twoUserMatchMakingQueue.shift();
	}

	/**
	 * Add player to the match making queue
	 * @param userId user id
	 * @param socket socket of the user that will be used to send him a messages
	 */
	async addPlayerToTwoUserMatchMaking(userId: number, socket: Socket) {


		const checkIfPlayerIsAlreadyInLobby = await this.findUserInLobbys(userId)
		.then((lobby) => {
			this.logger.debug(`User ${userId} is already in a lobby ${lobby.room_id}`);
			throw new BadRequestException(`User ${userId} is already in a lobby ${lobby.room_id}`);
		})
		.catch((err) => {
			if ((err instanceof NotFoundException) === false) {
				throw err;
			}

			// User is not in a lobby, continue
		})

		const checkIfUserIsAlreadyInMatchMaking = this.twoUserMatchMakingQueue.find((e) => e.userId === userId);
		if (checkIfUserIsAlreadyInMatchMaking !== undefined) {
			this.logger.log(`User ${userId} is already in the match making, ignoring`);
			return;
		}
		this.twoUserMatchMakingQueue.push({
			userId: userId,
			socket: socket,
		});
		this.logger.debug(`addPlayerToTwoUserMatchMaking ${userId}`);
	}

	async removePlayerFromTwoUserMatchMaking(userId: number) {

		// Disconnect the user if he is still connected
		const socket = this.twoUserMatchMakingQueue.find((e) => e.userId === userId)?.socket;

		if (socket !== undefined && socket.connected === true) {
			const res: matchMakingResponse = {
				status: "DisconnectedByServer",
				msg: "You have been removed from the match making",
			}
			socket.emit('matchMakingStatus', res);
			socket.disconnect();
		}

		// Remove the user from the array using filter
		this.twoUserMatchMakingQueue = this.twoUserMatchMakingQueue.filter((e) => e.userId !== userId);
	}

	/**
	 * Try to create a lobby for the user
	 * @param userId Id of the user
	 * @returns Room id of the lobby
	 * @throws BadGatewayException if we can't create a lobby
	 */
	async createLobby(userId: number): Promise<string> {

		const newRoomId = this.generateUniqueRoomId(6);

		const newLobby = new LobbyInstance(newRoomId, userId, ()=>{});
		this.lobbys[newRoomId] = newLobby;

		this.usersInLobby[userId] = {
			room_id: newRoomId,
			connectedClients: [],
		};

		return newRoomId;
	}

	/**
	 * Join a player WS to the socket.io room of the lobby
	 * @param roomId Id of the lobby
	 * @param userId Id of the user
	 * @param socket Socket.io socket of the player
	 * @returns void Promise
	 * @throws NotFoundException if the lobby does not exist
	 * @throws BadRequestException if the user is not in the white list of the lobby
	 */
	async joinPlayerToLobby(roomId: string, userId: number, socket: Socket): Promise<void> {
		
		this.logger.debug(`try joinPlayerToLobby ${roomId} ${userId}`);

		const lobby = await this.getLobby(roomId);

		if (lobby.isInWhiteList(userId) === false) {
			this.logger.debug(`User ${userId} is not in the white list of lobby ${roomId}`);
			throw new BadRequestException(`User ${userId} is not in the white list of lobby ${roomId}`);
		}

		const checkUserWsConnectedClient = this.usersInLobby[userId]?.connectedClients;
		if (checkUserWsConnectedClient !== undefined) {

			// Check if the user have already a client connected
			if (checkUserWsConnectedClient.length !== 0) {

				this.logger.debug(`User ${userId} have already a client connected`);

				// disconnect all client of the user
				for (const client of checkUserWsConnectedClient) {

					this.logger.debug(`disconnect WS client ${client} of user ${userId}`);

					// Emit to the client that he is disconnected
					const msg: disconnectClientFromTheLobbyResponse = {
						reason: "DuplicateConnection",
						msg: "You are connected from another device, you have been disconnected",
					}

					this.emitGAteway.server.to(client.id).emit('disconnectClientFromTheLobby', msg);

					this.emitGAteway.server.in(client.id).socketsLeave(roomId)

					// Remove the client from the array using filter
					this.usersInLobby[userId].connectedClients = this.usersInLobby[userId].connectedClients.filter(c => c !== client);
				}
			}
		}

		socket.join(roomId);

		if (lobby.isInLobby(userId) === false) {
			lobby.addPlayerToLobby(userId, socket);
		}

		// Edit the user socket in the lobby
		await lobby.editPlayerSocket(userId, socket)
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`Edit player socket: User ${userId} is not in the lobby`);
				throw new NotFoundException(`User ${userId} is not in the lobby`);
			}
			throw err;
		});

		// Add the client to the user map if he is not already in
		if (this.usersInLobby[userId] === undefined) {
			this.usersInLobby[userId] = {
				room_id: roomId,
				connectedClients: [],
			};
		}

		this.usersInLobby[userId].connectedClients.push(socket);
		this.emitGAteway.server.in(roomId).emit('newPlayerInLobby', userId);

		this.logger.debug(`joinPlayerToLobby ${roomId} ${userId}`);
	}

	/**
	 * Delete a lobby and all players before
	 * @param roomId Id of the lobby to delete
	 * @throws NotFoundException if the lobby does not exist
	 */
	async deleteLobby(roomId: string) {

		this.logger.debug(`try deleteLobby ${roomId}`);

		if (this.lobbys[roomId] === undefined) {
			this.logger.debug('Room does not exist');
			throw new NotFoundException('Room does not exist');
		}

		this.lobbys[roomId].closeLobby();//TODO

		// Remove all players from the map
		const players = this.lobbys[roomId].getPlayers();

		for (const player_id of Object.keys(players)) {
			if (this.usersInLobby[player_id] === undefined) {
				this.logger.error(`User ${player_id} is in the lobby ${roomId} but not in the user map!?`);
				throw new BadGatewayException(`[${roomId}][${player_id}] Failed to delete lobby, see logs or contact an admin`);
			}
			delete this.usersInLobby[player_id];
		}

		delete this.lobbys[roomId];
		this.logger.debug(`deleteLobby ${roomId}`);
	}
	
	/**
	 * Try to disconnect all players from the lobby
	 * @param roomId room id of the lobby
	 * @param disconnectMessage Message to send to the players
	 * @returns void Promise
	 * @throws NotFoundException if the lobby does not exist
	 */
	async disconnectAllPlayersFromLobby(roomId: string, disconnectMessage: disconnectClientFromTheLobbyResponse) {
		const lobby = await this.getLobby(roomId)
		.then((lobby) => {
			return lobby;
		})
		.catch((err) => {
			if (err instanceof NotFoundException) {
				this.logger.debug(`Lobby ${roomId} not found`);
				throw new NotFoundException(`Lobby ${roomId} not found`);
			}
			throw err;
		});

		if (lobby === undefined) {
			return;
		}
		const players = lobby.getPlayers();

		// Emit to all players that the user left the game

		for (const id in players) {

			const player = players[id];

			if (player?.wsClient?.connected === true) {
				player.wsClient.emit("disconnectClientFromTheLobby", disconnectMessage);
				this.logger.debug(`disconnectAllPlayersFromLobby ${roomId}: disconnect user ${id}`);
			}
		}
	}

	// async startGame(roomName: string, opt: GameOptDto, io: Server) {
	// }

	async stopGame(roomName: string) {
		this.logger.debug(`stopGame ${roomName}`);
		// emit to all players
		// disconnect all players
	}

	async addPlayerToWhiteList(roomId: string, newUserId: number) {
		const lobby = await this.getLobby(roomId);

		// check if the user is the owner of the lobby
		if (lobby.owner_id === newUserId) {
			this.logger.debug(`User ${newUserId} is the owner of lobby ${roomId}`);
			throw new BadRequestException(`User ${newUserId} is the owner of lobby ${roomId}`);
		}

		lobby.addPlayerToWhiteList(newUserId)
	}

	async removePlayerFromWhiteList(roomId: string, userId: number) {
		const lobby = await this.getLobby(roomId);

		// check if the user is the owner of the lobby
		if (lobby.owner_id !== userId) {
			this.logger.debug(`User ${userId} is not the owner of lobby ${roomId}`);
			throw new BadRequestException(`User ${userId} is not the owner of lobby ${roomId}`);
		}

		lobby.removePlayerFromWhiteList(userId)
	}

	// Feature temporarily disabled #39
	// /**
	//  * Add a player to a lobby
	//  * @param roomId room id of the lobby
	//  * @param userId user id of the player
	//  * @returns room id of the lobby
	//  * @throws BadRequestException if the user is already in a lobby
	//  */
	// async addPlayerToLobby(roomId: string, userId: number) {
	// 	this.logger.debug(`try to addPlayerToLobby ${roomId} ${userId}`);

	// 	// check if the user is already in a lobby
	// 	if (this.usersInLobby[userId] !== undefined) {
	// 		this.logger.debug(`User ${userId} is already in a lobby ${this.usersInLobby[userId].room_id}`);
	// 		throw new BadRequestException(`User ${userId} is already in a lobby ${this.usersInLobby[userId].room_id}`);
	// 	}

	// 	const lobby = await this.getLobby(roomId);
	// 	lobby.addPlayerToLobby(userId, );
	// 	this.usersInLobby[userId] = {
	// 		room_id: roomId,
	// 		connectedClients: [],
	// 	};
	// 	this.logger.debug(`addUserToLobby ${roomId} ${userId}`);
	// 	return lobby.room_id;

	// }

	/**
	 * 
	 * @param roomId 
	 * @returns return the lobby instance
	 * @throws NotFoundException if the lobby does not exist
	 */
	async getLobby(roomId: string) {
		const lobby = this.lobbys[roomId];
		if (lobby === undefined) {
			throw new NotFoundException(`Lobby ${roomId} does not exist`);
		}
		return lobby;
	}

	/**
	 * try to find in which lobby the user is
	 * @param userId user id
	 * @returns return the lobby instance
	 * @throws NotFoundException if the user is not in a lobby
	 */
	async findUserInLobbys(userId: number): Promise<LobbyInstance> {
		
		// I use a user map that make the link between the user and the lobby
		const user = this.usersInLobby[userId];
		if (user === undefined) {
			this.logger.debug(`User ${userId} does not exist`);
			throw new NotFoundException(`User ${userId} does not exist`);
		}

		return this.lobbys[user.room_id];
	}

	/**
	 * Find the socket of the user in the lobby
	 * @param socketId Socket id of the user
	 * @returns Socket of the user
	 */
	async findUserIdOfActiveSocket(socketId: string): Promise<number> {
		for (const userId of Object.keys(this.usersInLobby)) {
			for (const socket of this.usersInLobby[userId].connectedClients) {
				if (socket.id === socketId) {
					return parseInt(userId);
				}
			}
		}
		this.logger.debug(`Socket ${socketId} does not exist`);
		throw new NotFoundException(`Socket ${socketId} does not exist`);
	}

	/**
	 * Generate a random id
	 * @param length Length of the id
	 * @returns Random id
	 */
	private generateId(length): string {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	/**
	 * @warning This function is not safe! Should be used only for debug
	 * //TODO remove this function
	 * @returns return all lobbys public data
	 */
	async getAllLobbysPublicData() {
		const lobbysPublicData = [];
		for (const lobbyId in this.lobbys) {
			if (this.lobbys[lobbyId] === undefined) {
				continue;
			}
			const lobbyPublicData = this.lobbys[lobbyId].getPublicData();
			lobbysPublicData.push(lobbyPublicData);
		}

		const playerPublicData = {};
		for (const userId of Object.keys(this.usersInLobby)) {
			playerPublicData[userId] = {
				room_id: this.usersInLobby[userId].room_id,
				connectedClients: this.usersInLobby[userId].connectedClients?.map((e) => e?.id),
			};
		}

		// const playerWsClients = {};
		// for (const userId of Object.keys(this.usersInLobby)) {
		// 	playerWsClients[userId] = this.usersInLobby[userId].connectedClients?.id;
		// }

		// const dataMatchMakingTwoPlayers = {};
		// for (const player of this.twoUserMatchMakingQueue) {
		// 	dataMatchMakingTwoPlayers[player.userId] = player.socket.id;
		// }
		
		const res = JSON.parse(JSON.stringify({
			lobbys: lobbysPublicData,
			players: playerPublicData,
			// playerWsClients: playerWsClients,
			// dataMatchMakingTwoPlayers: dataMatchMakingTwoPlayers,
		}));

		this.logger.debug(res);

		return res;
	}

	/**
	 * Generate a unique room id
	 * @param length Length of the room id
	 * @returns Unique room id
	 * @throws Error if we can't generate unique room id after X tries
	 */
	private generateUniqueRoomId(length) {
		let roomId = '';
		let counter = 0;

		do {
			// throw error if we can't generate unique room id after X tries
			if (counter > 99) {
				this.logger.error(`Could not generate unique room id after ${counter} tries`);
				throw new BadGatewayException(`Could not generate unique room id after ${counter} tries, see logs or contact an admin`);
			}
			roomId = this.generateId(length);
			counter += 1;
		} while (this.lobbys[roomId] !== undefined);

		return roomId;
	}
}