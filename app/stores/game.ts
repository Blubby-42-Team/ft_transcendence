type gameStoreType = {
	_theme: gameTheme2,
	_localSettings: {
		sound: boolean,
	}
	_gameSettings: gameSettingsType,
};

export const useGame2Store = defineStore('game', {
	state: (): gameStoreType => ({
		_theme: {
			fontColor:			'white',
			background:			{	type: 'color',	color: 'black'	},
			ball:				{	type: 'color',	color: 'white'	},
			player_top:			{	type: 'color',	color: 'white'	},
			player_bottom:		{	type: 'color',	color: 'white'	},
			player_left:		{	type: 'color',	color: 'white'	},
			player_right:		{	type: 'color',	color: 'white'	},
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
			maxPoint:	2,
			numPlayer:	4,
			ballSize:	1,
			padSize:	5,
			mode:		BotDifficulty2.NORMAL,
			randomizer:	false,
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
