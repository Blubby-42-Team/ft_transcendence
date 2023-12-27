import { gameSettingsType, gameStateType } from '@shared/types/game/game'
import { Direction } from '@shared/types/game/utils'
import { GameEngine } from '@shared/game/game';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';

export class LobbyInstance {

	private readonly logger: undefined | Logger;

	constructor (room_id: string, owner_id: number, updateState: (state: gameStateType) => void ) {

		this.room_id = room_id;
		this.owner_id = owner_id;
		this.gameSettings = undefined;
		this.game = undefined;
		this.slots = 1;

		this.logger = new Logger(`LobbyInstance: ${this.room_id}`)

		this.players[owner_id] = {
			dir: this.getDirectionBySlot(this.slots),
			ready: false,
			wsId: '',
			isConnected: false,
		}
		
		this.whiteList.push(owner_id);
	}

	readonly room_id: string;
	readonly owner_id: number;

	private slots: 1 | 2 | 3 | 4;

	private players: {
		[key: number]: {
			dir: Direction,
			ready: boolean,
			wsId: string,
			isConnected: boolean,
		};
	} = {};

	private whiteList: number[] = [];

	private game: GameEngine | undefined;

	private gameSettings: gameSettingsType | undefined;

	async startGame(roomName: string, opt: any, io: any) {
		if (this.game === undefined) {
			this.logger.error(`No game instance set for lobby ${this.room_id}`);
			throw new Error(`No game instance set for lobby ${this.room_id}`);
		}
	}

	async stopGame () {
		if (this.game === undefined) {
			this.logger.error(`No game instance to stop in lobby ${this.room_id}`);
			throw new Error(`No game instance to stop in lobby ${this.room_id}`);
		}
		//TODO save game state to DB
	}

	async closeLobby() {
		//TODO emit to all players that the lobby is closed
		//TODO disconnect all players from the WS room
		//TODO stop game if it is running
	}

	/**
	 * try to add a player to the lobby and emit the new state to the lobby
	 * check if the player is already in the lobby
	 * check if the lobby is full
	 * check if the player is in the white list
	 * @param userId user id
	 * @throws BadRequestException if the user is already in the lobby or the lobby is full
	 */
	addPlayerToLobby(userId: number) {
		if (this.players[userId] !== undefined) {
			this.logger.warn(`User ${userId} is already in the lobby ${this.room_id}`);
			throw new BadRequestException(`User ${userId} is already in the lobby ${this.room_id}`);
		}

		if (this.slots === 4) {
			this.logger.error(`Lobby ${this.room_id} is full`);
			throw new BadRequestException(`Lobby ${this.room_id} is full`);
		}

		if (!this.isInWhiteList(userId)) {
			this.logger.warn(`User ${userId} is not in the white list of lobby ${this.room_id}`);
			throw new BadRequestException(`User ${userId} is not in the white list of lobby ${this.room_id}`);
		}

		this.slots++;

		this.players[userId] = {
			dir: this.getDirectionBySlot(this.slots),
			ready: false,
			wsId: '',
			isConnected: false,
		}

		//TODO emit new state to the lobby
		this.logger.log(`User ${userId} added to the lobby`);
	}

	/**
	 * Remove a player from the lobby and emit the new state to the lobby
	 */
	removePlayerFromLobby(userId: number) {
		if (this.players[userId] === undefined) {
			this.logger.warn(`User ${userId} is not in the lobby`);
			throw new NotFoundException(`User ${userId} is not in the lobby`);
		}

		if (this.slots === 1) {
			this.logger.error(`Lobby ${this.room_id} is empty`);
			throw new BadRequestException(`Lobby ${this.room_id} is empty`);
		}

		if (userId === this.owner_id) {
			this.logger.error(`User ${userId} is the owner of the lobby ${this.room_id}, can't remove him`);
			throw new BadRequestException(`User ${userId} is the owner of the lobby ${this.room_id}, can't remove him`);
		}

		this.slots--;

		this.removePlayerFromWhiteList(userId);

		if (this.players[userId].isConnected) {
			this.logger.warn(`User ${userId} is connected to the WS room, disconnect him`);
			//TODO emit and disconnect player from the WS room
		}

		delete this.players[userId];
		this.logger.log(`User ${userId} removed from the lobby`);
		//TODO emit new state to the lobby
	}

	/**
	 * Set player connection state to true and emit the new state to the lobby
	 */
	onPlayerWsConnect(userId: number, wsId: string) {
		if (this.players[userId] === undefined) {
			this.logger.warn(`User ${userId} is not in the lobby`);
			return;//TODO throw error
		}

		this.players[userId].wsId = wsId;
		this.players[userId].isConnected = true;

		//TODO emit new state to the lobby
		this.logger.log(`User ${userId} connected to the WS room [${this.room_id}]`);
	}

	/**
	 * Set player connection state to false and emit the new state to the lobby
	 */
	onPlayerWsDisconnect(userId: number) {
		if (this.players[userId] === undefined) {
			this.logger.warn(`User ${userId} is not in the lobby`);
			return;//TODO throw error
		}

		this.players[userId].isConnected = false;

		//TODO emit new state to the lobby
	}

	/**
	 * Set player ready state to true and emit the new state to the lobby
	 */
	onPlayerReady(userId: number) {
		if (this.players[userId] === undefined) {
			this.logger.warn(`User ${userId} is not in the lobby`);
			return;//TODO throw error
		}

		this.players[userId].ready = true;

		//TODO emit new state to the lobby
		this.logger.log(`User ${userId} is ready`);
	}

	/**
	 * Set player ready state to false and emit the new state to the lobby
	 */
	onPlayerNotReady(userId: number) {
		if (this.players[userId] === undefined) {
			this.logger.warn(`User ${userId} is not in the lobby`);
			return;//TODO throw error
		}

		this.players[userId].ready = false;

		//TODO emit new state to the lobby
		this.logger.log(`User ${userId} is not ready`);
	}

	/**
	 * Check if the player is in the white list
	 * @returns true | false
	 */
	isInWhiteList(userId: number): boolean {
		return this.whiteList.includes(userId);
	}

	/**
	 * Add a player to the white list
	 * @param userId user id
	 * @throws BadRequestException if the user is already in the white list or if the user is the owner of the lobby
	 */
	addPlayerToWhiteList(userId: number) {
		if (this.isInWhiteList(userId)) {
			this.logger.warn(`User ${userId} is already in the white list`);
			throw new BadRequestException(`User ${userId} is already in the white list`);
		}

		this.whiteList.push(userId);
		this.logger.log(`User ${userId} added to the white list`);
	}

	/**
	 * Remove a player from the white list
	 * @param userId user id
	 * @throws BadRequestException if the user is not in the white list
	 */
	removePlayerFromWhiteList(userId: number) {
		if (!this.isInWhiteList(userId)) {
			this.logger.warn(`User ${userId} is not in the white list`);
			throw new BadRequestException(`User ${userId} is not in the white list`);
		}

		this.whiteList = this.whiteList.filter((id) => id !== userId);
		this.logger.log(`User ${userId} removed from the white list`);
		//TODO emit new state to the lobby
	}

	/**
	 * @returns return all players in the lobby or an empty array
	 */
	getPlayers() {
		return this.players;
	}

	/**
	 * @returns return the game settings or undefined
	 */
	getGameSettings() {
		return this.gameSettings;
	}

	/**
	 * 
	 * @returns return all public data of the lobby
	 */
	getPublicData() {
		return {
			room_id: this.room_id,
			owner_id: this.owner_id,
			slots: this.slots,
			players: this.players,
			whiteList: this.whiteList,
			gameSettings: this.gameSettings,
		}
	}

	private getDirectionBySlot(slot: number): Direction {
		switch (slot) {
			case 1:
				return Direction.LEFT;
			case 2:
				return Direction.RIGHT;
			case 3:
				return Direction.TOP;
			case 4:
				return Direction.BOTTOM;
			default:
				return Direction.NONE;
		}
	}
}
