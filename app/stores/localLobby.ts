import { CardType } from '@/utils/types'

export enum LobbyStartingSequence {
	NOT_STARTED	= 0,	// On Hold
	STARTING	= 1,	// 5 Seconds Countdown
	STARTED		= 2,	// Card Animation
}

export type testPlayerCard = {
	id: number | undefined,
	type: CardType,
}

export const useLocalLobbyStore = defineStore('localLobby', {
	state: () => ({
		_players: [
			{ id: undefined,	type: CardType.PLAYER	},
			{ id: undefined,	type: CardType.EMPTY	},
			{ id: undefined,	type: CardType.COMING	},
			{ id: undefined,	type: CardType.COMING	},
		] as Array<testPlayerCard>,
		_sequence: LobbyStartingSequence.NOT_STARTED,
		_timeRemaining: 6,
	}),
	getters: {
		players: (state) => computed(() => state._players),
		sequence: (state) => computed(() => state._sequence),
		timeRemaining: (state) => computed(() => state._timeRemaining),
	},
	actions: {
		reset(id: number) {
			this._sequence = LobbyStartingSequence.NOT_STARTED;
			this._timeRemaining = 6;
			this._players[0].id = id;
			for (let i = 1; i < this._players.length; i++){
				if (this._players[i].id === undefined){
					if (i <= 1){
						this._players[i].type = CardType.EMPTY;
					}
					else {
						this._players[i].type = CardType.COMING;
					}
				}
			}
		},
		async start() {
			this._sequence = LobbyStartingSequence.STARTING;
			console.log('start');
			while (this._timeRemaining > 0 && this._sequence === LobbyStartingSequence.STARTING) {
				this._timeRemaining -= 1;
				if (this._timeRemaining === 0){
					this._sequence = LobbyStartingSequence.STARTED;
				}
				console.log('time: ', this._timeRemaining);
				await new Promise((r) => setTimeout(r, 1000));
			}
		},
		cancel() {
			this._sequence = LobbyStartingSequence.NOT_STARTED;
			this._timeRemaining = 6;
		},
	},
})
