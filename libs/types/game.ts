export type gameTexture = {
	type: 'color',
	color: string,
} | {
	type: 'image',
	image?: HTMLImageElement,
	imageSrc: string,
	imageRotation: 0 | 1 | 2 | 3,
}

export enum Direction {
	NONE,
	LEFT,
	RIGHT,
	TOP,
	BOTTOM,
};

export type Coordinates = {
	x: number,
	y: number,
}

export type Rectangle = {
	center: Coordinates,
	height_d_2: number, // height divided by two
	width_d_2: number,  // width  divided by two
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
	status:				gameStatusType,
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
