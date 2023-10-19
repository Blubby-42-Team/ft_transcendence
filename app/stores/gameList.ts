interface IPlayer {
	id: string,
	name: string,
}

interface IGame {
	id: string,
	player1: IPlayer,
	player2: IPlayer,
	player1score: number,
	player2score: number,
	tournament: string,
}

const players: Array<IPlayer> = [
	{	id: '1',		name: 'James'		},
	{	id: '2',		name: 'Maria'		},
	{	id: '3',		name: 'Paul'		},
	{	id: '4',		name: 'Olivia'		},
	{	id: '5',		name: 'N4P0L30N'	},
	{	id: '6',		name: 'Jameskii'	},
	{	id: '7',		name: 'Karen'	},
	{	id: '8',		name: 'K4R3N'	},
]

export const useGameListStore = defineStore('gameList', {
	state: (): {
		_gameList: Array<IGame>;
	} => ({
		_gameList: [
			{	id: '1',	player1: players[0], player2: players[1], player1score: 4, player2score: 2,	tournament: 'JamesTown Community Challenge'	},
			{	id: '2',	player1: players[2], player2: players[3], player1score: 0, player2score: 0,	tournament: ''	},
			{	id: '3',	player1: players[4], player2: players[5], player1score: 1, player2score: 0,	tournament: ''	},
			{	id: '4',	player1: players[6], player2: players[7], player1score: 1, player2score: 1,	tournament: ''	},
			{	id: '5',	player1: players[0], player2: players[1], player1score: 4, player2score: 2,	tournament: 'JamesTown Community Challenge'	},
			{	id: '6',	player1: players[2], player2: players[3], player1score: 0, player2score: 0,	tournament: ''	},
			{	id: '7',	player1: players[4], player2: players[5], player1score: 1, player2score: 0,	tournament: ''	},
			{	id: '8',	player1: players[6], player2: players[7], player1score: 1, player2score: 1,	tournament: ''	},
			{	id: '9',	player1: players[0], player2: players[1], player1score: 4, player2score: 2,	tournament: 'JamesTown Community Challenge'	},
			{	id: '10',	player1: players[2], player2: players[3], player1score: 0, player2score: 0,	tournament: ''	},
			{	id: '11',	player1: players[4], player2: players[5], player1score: 1, player2score: 0,	tournament: ''	},
			{	id: '12',	player1: players[6], player2: players[7], player1score: 1, player2score: 1,	tournament: ''	},
			{	id: '13',	player1: players[0], player2: players[1], player1score: 4, player2score: 2,	tournament: 'JamesTown Community Challenge'	},
			{	id: '14',	player1: players[2], player2: players[3], player1score: 0, player2score: 0,	tournament: ''	},
			{	id: '15',	player1: players[4], player2: players[5], player1score: 1, player2score: 0,	tournament: ''	},
			{	id: '16',	player1: players[6], player2: players[7], player1score: 1, player2score: 1,	tournament: ''	},
			{	id: '17',	player1: players[0], player2: players[1], player1score: 4, player2score: 2,	tournament: 'JamesTown Community Challenge'	},
			{	id: '18',	player1: players[2], player2: players[3], player1score: 0, player2score: 0,	tournament: ''	},
			{	id: '19',	player1: players[4], player2: players[5], player1score: 1, player2score: 0,	tournament: ''	},
			{	id: '20',	player1: players[6], player2: players[7], player1score: 1, player2score: 1,	tournament: ''	},
			{	id: '21',	player1: players[0], player2: players[1], player1score: 4, player2score: 2,	tournament: 'JamesTown Community Challenge'	},
			{	id: '22',	player1: players[2], player2: players[3], player1score: 0, player2score: 0,	tournament: ''	},
			{	id: '23',	player1: players[4], player2: players[5], player1score: 1, player2score: 0,	tournament: ''	},
			{	id: '24',	player1: players[6], player2: players[7], player1score: 1, player2score: 1,	tournament: ''	},
		]
	}),
	getters: {
		gameList: (state): Array<IGame> => state._gameList,
	},
	actions: {
		getGameById(id: string) {

		}
	},
})
