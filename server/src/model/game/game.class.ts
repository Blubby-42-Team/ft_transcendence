import { Direction, gameSettingsType } from '@shared/types/game'
import { GameEngine } from '@shared/game/game';

export class GameInstance {

	constructor (room_id: string, owner_id: string, gameSettings: gameSettingsType) {
		this.room_id = room_id;
		this.gameSettings = gameSettings;
		this.game = new GameEngine(gameSettings);
	}

	private room_id: string;
	private owner_id: string;

	player: {
		[key: string]: Direction;
	} = {};

	private game: GameEngine;

	private gameSettings: gameSettingsType;

	static async startRoom(roomName: string, opt: any, io: any) {

	}

	static async stopRoom(roomName: string) {
	}
}
