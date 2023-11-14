export enum Direction {
	NONE,
	LEFT,
	RIGHT,
	TOP,
	BOTTOM,
};

export type Coordinates = {
    x: number;
    y: number;
}

export type Rectangle = {
	center: Coordinates;
	height_d_2: number; // height divided by two
	width_d_2: number;  // width  divided by two
};

export type screenData = {
	delta: Coordinates,
	width: number,
	height: number,
}

export type gameTheme2 = {
	fontColor:			string,
	background:			gameTexture,
	ball:				gameTexture,
	player_top:			gameTexture,
	player_bottom:		gameTexture,
	player_left:		gameTexture,
	player_right:		gameTexture,
	player4BottomRight:	gameTexture,
	player4TopRight:	gameTexture,
	player4BottomLeft:	gameTexture,
	player4TopLeft:		gameTexture,
	player4BottomElim:	gameTexture,
	player4TopElim:		gameTexture,
	player4LeftElim:	gameTexture,
	player4RightElim:	gameTexture,
	player2Bottom:		gameTexture,
	player2Top:			gameTexture,
}

export type gamePlayer2 = {
	active: true,
	eleminated: boolean,
	isBot: boolean,
	score: number,
}

export enum BotDifficulty2 {
	NORMAL,
	HARD,
	CRAZY,
};

export enum gameStatusType {
	ON_HOLD,
	STARTED,
	GAMEOVER,
};

export type gameStateType = {
	gameArea:			Rectangle,
	ball:				Rectangle & { speed: number, direction: number },
	player_top:			Rectangle & gamePlayer2 | { active: false },
	player_bottom:		Rectangle & gamePlayer2 | { active: false },
	player_left:		Rectangle & gamePlayer2 | { active: false },
	player_right:		Rectangle & gamePlayer2 | { active: false },
	obstacles:			{ [key: string]: Rectangle & { hidden: boolean } }
}

export type gameSettingsType = {
	maxPoint:	number,
	numPlayer:	number,
	ballSize:	number,
	padSize:	number,
	mode:		BotDifficulty2,
	randomizer:	boolean,
}

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
			maxPoint:	1,
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
