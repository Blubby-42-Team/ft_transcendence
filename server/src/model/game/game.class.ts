import { Direction, gameSettingsType, gameStateType } from '@shared/types/game'
import { GameEngine } from '@shared/game/game';

export class LobbyInstance {

	constructor (room_id: string, owner_id: number, updateState: (state: gameStateType) => void ) {


		this.room_id = room_id;
		this.gameSettings = undefined;
		this.game = undefined;
		this.slots = 1;

		this.players[owner_id] = {
			dir: this.getDirectionBySlot(this.slots),
			ready: false,
			wsId: '',
			isConnected: false,
		}
	}

	private lobbyIsClosed: boolean = false;
	private room_id: string;
	private owner_id: number;

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
		if (this.game !== undefined) {
			return;//TODO throw error
		}
	}

	async stopGame () {
		if (this.game === undefined) {
			return;//TODO throw error
		}
		//TODO save game state to DB
	}

	async closeLobby() {
		this.lobbyIsClosed = true;
		//TODO emit to all players that the lobby is closed
		//TODO disconnect all players from the WS room
		//TODO stop game if it is running
	}

	/**
	 * Add a player to the lobby and emit the new state to the lobby
	 */
	addPlayerToLobby(userId: number) {
		if (this.players[userId] !== undefined) {
			return;//TODO throw error
		}

		if (this.slots === 4) {
			return;//TODO throw error
		}

		this.slots++;

		this.players[userId] = {
			dir: this.getDirectionBySlot(this.slots),
			ready: false,
			wsId: '',
			isConnected: false,
		}

		//TODO emit new state to the lobby
	}

	/**
	 * Remove a player from the lobby and emit the new state to the lobby
	 */
	removePlayerFromLobby(userId: number) {
		if (this.players[userId] === undefined) {
			return;//TODO throw error
		}

		this.slots--;

		this.removePlayerFromWhiteList(userId);

		if (this.players[userId].isConnected) {
			//TODO emit and disconnect player from the WS room
		}

		delete this.players[userId];
	}

	/**
	 * Set player connection state to true and emit the new state to the lobby
	 */
	onPlayerWsConnect(userId: number, wsId: string) {
		if (this.players[userId] === undefined) {
			return;//TODO throw error
		}

		this.players[userId].wsId = wsId;
		this.players[userId].isConnected = true;

		//TODO emit new state to the lobby
	}

	/**
	 * Set player connection state to false and emit the new state to the lobby
	 */
	onPlayerWsDisconnect(userId: number) {
		if (this.players[userId] === undefined) {
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
			return;//TODO throw error
		}

		this.players[userId].ready = true;

		//TODO emit new state to the lobby
	}

	/**
	 * Set player ready state to false and emit the new state to the lobby
	 */
	onPlayerNotReady(userId: number) {
		if (this.players[userId] === undefined) {
			return;//TODO throw error
		}

		this.players[userId].ready = false;

		//TODO emit new state to the lobby
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
	 */
	addPlayerToWhiteList(userId: number) {
		if (this.isInWhiteList(userId)) {
			return;//TODO throw error
		}

		this.whiteList.push(userId);
	}

	/**
	 * Remove a player from the white list
	 */
	removePlayerFromWhiteList(userId: number) {
		if (!this.isInWhiteList(userId)) {
			return;//TODO throw error
		}

		this.whiteList = this.whiteList.filter((id) => id !== userId);
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

	getOwnerID(): number {
		return this.owner_id;
	}
}
