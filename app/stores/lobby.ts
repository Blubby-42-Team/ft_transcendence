import { CardType } from '@/utils/types'

import { EGameMode } from '../../libs/types/game/game'

export enum LobbyStartingSequence {
	NOT_STARTED	= 0,	// On Hold
	STARTING	= 1,	// 5 Seconds Countdown
	STARTED		= 2,	// Card Animation
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

export const useLobbyStore = defineStore('lobby', () => {
	let hostId = 223;
	let players = [
		{ id: 0,	ready: true	},
		{ id: 0,	ready: true	},
		{ id: 0,	ready: true	},
		{ id: 0,	ready: true	},
	];
	let lobbyMode = EGameMode.Classic;
	let gameSettings = defaultSettings as gameSettingsType;
	let sequence = LobbyStartingSequence.NOT_STARTED;
	let timeRemaining = 6;

	const { getUser, getPrimaryUser } = useUserStore()

	function join(mode: EGameMode){
		reset();
		lobbyMode = mode;
		api.fetchUser(5, (res) => {
			const primary = getPrimaryUser();
			console.log('Primary User:', primary.value.id);
			for (let i = 0; i < players.length; i++){
				players[i].id = 0;
			}
			players[0].id = primary.value.id;
			console.log(players);
		});
		console.log(players);
	};

	function leave(){
		api.fetchUser(5, (res) => {
			const primary = getPrimaryUser();
			players = [
				{ id: primary.value.id, ready: true },
				{ id: 0, ready: true },
				{ id: 0, ready: true },
				{ id: 0, ready: true },
			];
			console.log(players);
		});
	};

	function reset() {
		sequence = LobbyStartingSequence.NOT_STARTED;
		timeRemaining = 6;
	};

	function cancel() {
		sequence = LobbyStartingSequence.NOT_STARTED;
		timeRemaining = 6;
	};

	async function start() {
		sequence = LobbyStartingSequence.STARTING;
		while (timeRemaining > 0 && sequence === LobbyStartingSequence.STARTING) {
			timeRemaining -= 1;
			if (timeRemaining === 0){
				sequence = LobbyStartingSequence.STARTED;
			}
			await new Promise((r) => setTimeout(r, 1000));
		}
		if (sequence == LobbyStartingSequence.STARTED){
			for (let i = 1; i < players.length; i++){
				if (players[i].id === 0){
					players[i].id = 2;
				}
				// else if (players[i].type === CardType.COMING1){
				// 	players[i].type = CardType.COMING2;
				// }
				await new Promise((r) => setTimeout(r, 300));
			}
		}
	};

	function getCard(
		index: number,
		player: { id: number, ready: boolean },
	){
		console.log(player, index);
		if (player.id !== 0){
			return CardType.PLAYER;
		}
		if (lobbyMode === EGameMode.Classic || lobbyMode === EGameMode.Random){
			if (index < 2) {
				return CardType.EMPTY;
			}
		}
		else if (lobbyMode === EGameMode.Custom) {
			if (index < gameSettings.numPlayer) {
				return CardType.ADD;
			}
		}
		return CardType.COMING1;
	}
	
	return {
		players:		computed(() => players),
		sequence:		computed(() => sequence),
		timeRemaining:	computed(() => timeRemaining),
		settings:		computed(() => gameSettings),
		hostId:			computed(() => hostId),
		cards:			computed(() => players.map((player, i) => {
			getUser(player.id);
			return {
				id: player.id,
				card: getCard(i, player)
			}
		})),
		join,
		leave,
		reset,
		cancel,
		start,
	};
})
