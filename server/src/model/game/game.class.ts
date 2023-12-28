import { gameSettingsType, gameStateType } from '@shared/types/game/game'
import { Direction } from '@shared/types/game/utils'
import { GameEngine } from '@shared/game/game';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Server, Socket} from 'socket.io'
import { disconnectClientFromTheLobbyResponse } from '@shared/dto/ws.dto';


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
			wsClient: undefined,
		}
		
		this.whiteList.push(owner_id);
	}

	readonly room_id: string;
	readonly owner_id: number;

	private slots: 1 | 2 | 3 | 4;

	private players: Map<number, {
		dir: Direction,
		ready: boolean,
		wsClient: Socket | undefined,
	}> = new Map();

	private whiteList: number[] = [];

	private game: GameEngine | undefined;

	private gameState: gameStateType | undefined;

	private gameSettings: gameSettingsType;

	private io: Server;

	checkBeforeStart() {
		if (this.slots !== this.gameSettings.numPlayer)
			throw new BadRequestException(`The amount of connected players is incorrect : ${this.slots}.`)
		for (let player in this.players) {
			if (!this.players[player].ready)
				throw new BadRequestException("Not everybody is ready.")
		}
	}

	async startGame() {
		this.checkBeforeStart();
		this.game = new GameEngine(
			this.gameSettings,
			(newGameState: gameStateType) => {
				this.gameState = newGameState;
				this.io.to(this.room_id).emit("state", this.gameState)
			},
			(state) => {
				state = this.gameState;
		});
		this.game.start();
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

	async movePlayer (userId: number, sens: boolean) {
		this.game.move(this.players[userId].dir, sens, true);
	}

	/**
	 * try to add a player to the lobby and emit the new state to the lobby
	 * check if the player is already in the lobby
	 * check if the lobby is full
	 * check if the player is in the white list
	 * @param userId user id
	 * @throws BadRequestException if the user is already in the lobby or the lobby is full
	 */
	addPlayerToLobby(userId: number, socket: Socket) {
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
			wsClient: socket,
		}

		//TODO emit new state to the lobby
		this.logger.log(`User ${userId} added to the lobby`);
	}

	/**
	 * Edit the socket of a player in the lobby
	 * @param userId user id
	 * @param socket new socket of the player
	 * @throws NotFoundException if the user is not in the lobby
	 */
	async editPlayerSocket(userId: number, socket: Socket) {
		if (this.players[userId] === undefined) {
			this.logger.warn(`User ${userId} is not in the lobby`);
			throw new NotFoundException(`User ${userId} is not in the lobby`);
		}

		this.players[userId].wsClient = socket;
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
	 * Check if the player is in the lobby
	 * @returns true | false
	 */
	isInLobby(userId: number): boolean {
		return this.players[userId] !== undefined;
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

		if (this.slots === 4) {
			this.logger.error(`Lobby ${this.room_id} is full, can't add user to the white list`);
			throw new BadRequestException(`Lobby ${this.room_id} is full, can't add user to the white list`);
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

		const publicPlayers = [];

		for (let player in this.players) {
			publicPlayers.push({
				userId: player,
				dir: this.players[player].dir,
				ready: this.players[player].ready,
				clientId: this.players[player].wsClient?.id,
			})
		}

		return {
			room_id: this.room_id,
			owner_id: this.owner_id,
			slots: this.slots,
			players: publicPlayers,
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
