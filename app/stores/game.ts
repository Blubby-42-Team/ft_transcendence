type gameStoreType = {
	_theme: gameTheme,
	_localSettings: {
		sound: boolean,
	}
	_gameSettings: gameSettingsType,
};

export const useGameStore = defineStore('game', {
	state: (): gameStoreType => ({
		_theme: {
			fontColor:			'white',
			background:			{	type: 'color',	color: 'black'	},
			ball:				{	type: 'color',	color: 'white'	},
			player_top:			{	type: 'color',	color: 'red'	},
			player_bottom:		{	type: 'color',	color: 'green'	},
			player_left:		{	type: 'color',	color: 'blue'	},
			player_right:		{	type: 'color',	color: 'yellow'	},
			player4BottomRight:	{	type: 'color',	color: 'white'	},
			player4TopRight:	{	type: 'color',	color: 'white'	},
			player4BottomLeft:	{	type: 'color',	color: 'white'	},
			player4TopLeft:		{	type: 'color',	color: 'white'	},
			player4BottomElim:	{	type: 'color',	color: 'white'	},
			player4TopElim:		{	type: 'color',	color: 'white'	},
			player4LeftElim:	{	type: 'color',	color: 'white'	},
			player4RightElim:	{	type: 'color',	color: 'white'	},
			player2Bottom:		{	type: 'color',	color: 'white'	},
			player2Top:			{	type: 'color',	color: 'white'	},
		},
		_localSettings: {
			sound: false,
		},
		_gameSettings: {
			maxPoint:			2,
			numPlayer:			4,
			ballSize:			1,
			padSize:			5,
			mode:				BotDifficulty.NORMAL,
			randomizer:			false,
			initialBallSpeed:	0.5,
			speedAcceleration:	0.1,
		},
	}),
	getters: {
		theme:			(state) => computed(() => state._theme),
		gameSettings:	(state) => computed(() => state._gameSettings),
		localSettings:	(state) => computed(() => state._localSettings),
	},
	actions: {

	},
})
