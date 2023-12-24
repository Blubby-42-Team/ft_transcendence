import { BotDifficulty, Direction, gameSettingsType, gameStateType } from '@shared/types/game'
import { GameEngine } from '@shared/game/game';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Settings } from '../settings/settings.class';
import { Server } from 'socket.io'

export class LobbyInstance {

	private readonly logger: undefined | Logger;

	constructor (room_id: string, owner_id: number, updateState: (state: gameStateType) => void, socket: Server ) {

		this.room_id = room_id;
		this.owner_id = owner_id;
		this.gameSettings = {
			maxPoint:			5,
			numPlayer:			2,
			ballSize:			1,
			padSize:			1,
			mode:				BotDifficulty.NORMAL,
			randomizer:			false,
			speedAcceleration:	1,
			initialBallSpeed:	4,
		};
		this.game = undefined;
		this.slots = 1;

		this.logger = new Logger(`LobbyInstance: ${this.room_id}`)

		this.players[owner_id] = {
			dir: this.getDirectionBySlot(this.slots),
			ready: true,
			wsId: '',
			isConnected: true,
		}
		this.gameState = undefined;
		this.io = socket;
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
		this.game = new GameEngine(this.gameSettings, (newGameState: gameStateType) => {
			this.gameState = newGameState;
			this.io.to(this.room_id).emit("state", this.gameState)
		},
		(state) => {
			state = this.gameState;
		});
		this.game.start();
	}

	async movePlayer (userId: number, sens: boolean) {
		this.game.move(this.players[userId].dir, sens, true);
	}

	async stopGame () {
		if (this.game)
			this.game.stop()
		this.game = undefined;
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
		
	}

	/**
	 * Remove a player from the lobby and emit the new state to the lobby
	 */
	removePlayerFromLobby(userId: number) {
		
	}

	/**
	 * Set player connection state to true and emit the new state to the lobby
	 */
	onPlayerWsConnect(userId: number, wsId: string) {
		
	}

	/**
	 * Set player connection state to false and emit the new state to the lobby
	 */
	onPlayerWsDisconnect(userId: number) {
		
	}

	/**
	 * Set player ready state to true and emit the new state to the lobby
	 */
	onPlayerReady(userId: number) {
		
	}

	/**
	 * Set player ready state to false and emit the new state to the lobby
	 */
	onPlayerNotReady(userId: number) {
		
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
		
	}

	/**
	 * Remove a player from the white list
	 * @param userId user id
	 * @throws BadRequestException if the user is not in the white list
	 */
	removePlayerFromWhiteList(userId: number) {
		
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
