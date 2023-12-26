import { CardType } from '@/utils/types'

import { EGameMode } from '../../../libs/types/game/game'

export enum LobbyStartingSequence {
	NOT_STARTED	= 0,	// On Hold
	STARTING	= 1,	// 5 Seconds Countdown
	STARTED		= 2,	// Card Animation
}

function getCard(
	index: number,
	player: { id: number, ready: boolean },
	mode: EGameMode,
	settings: gameSettingsType | null,
){
	if (player.id !== 0){
		return CardType.PLAYER;
	}
	if (mode === EGameMode.Classic || mode === EGameMode.Random){
		if (index < 2) {
			return CardType.EMPTY;
		}
	}
	else if (settings !== null) {
		if (index < settings.numPlayer) {
			return CardType.ADD;
		}
	}
	return CardType.COMING1;
}

const defaultSettings = {
	maxPoint:			2,
	numPlayer:			4,
	ballSize:			1,
	padSize:			5,
	mode:				BotDifficulty.NORMAL,
	randomizer:			false,
	initialBallSpeed:	0.5,
	speedAcceleration:	0.1,
};

export const useLobbyStore = defineStore('lobby', {
	state: () => ({
		_hostId: 0,
		_players: [
			{ id: 0,	ready: true	},
			{ id: 0,	ready: true	},
			{ id: 0,	ready: true	},
			{ id: 0,	ready: true	},
		],
		_lobbyMode: EGameMode.Classic,
		_gameSettings: defaultSettings as gameSettingsType,
		_sequence: LobbyStartingSequence.NOT_STARTED,
		_timeRemaining: 6,
	}),
	getters: {
		players:		(state) => computed(() => state._players),
		cards:			(state) => computed(() => state._players.map((player, i) => ({ id: player.id, card: getCard(i, player, state._lobbyMode, state._gameSettings) }))),
		sequence:		(state) => computed(() => state._sequence),
		timeRemaining:	(state) => computed(() => state._timeRemaining),
		settings:		(state) => computed(() => state._gameSettings),
		hostId:			(state) => computed(() => state._hostId),
	},
	actions: {
		reset(id: number) {
			this._sequence = LobbyStartingSequence.NOT_STARTED;
			this._timeRemaining = 6;
			this._players[0].id = id;
			for (let i = 1; i < this._players.length; i++){
				this._players[i].id = 0;
			}
			this._players[0].id = id;
			console.log(this._players)
		},	
		async start() {
			this._sequence = LobbyStartingSequence.STARTING;
			while (this._timeRemaining > 0 && this._sequence === LobbyStartingSequence.STARTING) {
				this._timeRemaining -= 1;
				if (this._timeRemaining === 0){
					this._sequence = LobbyStartingSequence.STARTED;
				}
				await new Promise((r) => setTimeout(r, 1000));
			}
			if (this._sequence == LobbyStartingSequence.STARTED){
				for (let i = 1; i < this._players.length; i++){
					if (this._players[i].id === 0){
						this._players[i].id = 2;
					}
					// else if (this._players[i].type === CardType.COMING1){
					// 	this._players[i].type = CardType.COMING2;
					// }
					console.log(this._players)
					await new Promise((r) => setTimeout(r, 300));
				}
			}
		},
		cancel() {
			this._sequence = LobbyStartingSequence.NOT_STARTED;
			this._timeRemaining = 6;
		},
	},
})
