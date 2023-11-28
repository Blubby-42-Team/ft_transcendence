import { CardType } from "./types"

export enum LobbyStartingSequence {
	NOT_STARTED	= 0,	// On Hold
	STARTING	= 1,	// 5 Seconds Countdown
	STARTED		= 2,	// Card Animation
}

export type testPlayerCard = {
	id: number | undefined,
	type: CardType,
}

export class FrontLobbyMatchMakingInstance {
	public players: Array<testPlayerCard> = [
		{ id: undefined,	type: CardType.PLAYER	},
		{ id: undefined,	type: CardType.EMPTY	},
		{ id: undefined,	type: CardType.COMING	},
		{ id: undefined,	type: CardType.COMING	},
	]
	public sequence = LobbyStartingSequence.NOT_STARTED;
	public timeRemaining = 5;

	constructor(
		public lobbyCreator: number,
	){
		this.players[0].id = lobbyCreator;
	}

	public start(){
		this.sequence = LobbyStartingSequence.STARTING;
		while (this.timeRemaining > 0 && this.sequence === LobbyStartingSequence.STARTING) {
			setTimeout(() => {
				console.log(this.timeRemaining)
				this.timeRemaining - 1
				if (this.timeRemaining === 0){
					this.sequence = LobbyStartingSequence.STARTED;
				}
			}, 1000);
		}
	}

	public cancel(){
		this.sequence = LobbyStartingSequence.NOT_STARTED;
		this.timeRemaining = 0;
	}
}