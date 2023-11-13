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
			background:			{	type: 'image',	imageSrc: '/themes/anime/astolfo.jpg',		imageRotation: 0,	},
			ball:				{	type: 'image',	imageSrc: '/themes/anime/ballbarbie.jpg',	imageRotation: 0,	},
			player_top:			{	type: 'color',	color: 'deeppink'	},
			player_bottom:		{	type: 'color',	color: 'deeppink'	},
			player_left:		{	type: 'color',	color: 'deeppink'	},
			player_right:		{	type: 'color',	color: 'deeppink'	},
			player4BottomRight:	{	type: 'image',	imageSrc: '/themes/anime/pinksquare.jpg',	imageRotation: 0,	},
			player4TopRight:	{	type: 'image',	imageSrc: '/themes/anime/pinksquare.jpg',	imageRotation: 0,	},
			player4BottomLeft:	{	type: 'image',	imageSrc: '/themes/anime/pinksquare.jpg',	imageRotation: 0,	},
			player4TopLeft:		{	type: 'image',	imageSrc: '/themes/anime/pinksquare.jpg',	imageRotation: 0,	},
			player2Bottom:		{	type: 'color',	color: 'deeppink'	},
			player2Top:			{	type: 'color',	color: 'deeppink'	},
		},
		_localSettings: {
			sound: false,
		},
		_gameSettings: {
			maxPoint:	3,
			numPlayer:	4,
			ballSize:	5,
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
