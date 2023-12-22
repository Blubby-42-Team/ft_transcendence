export type gameControllerType = {[key: string]: (status: boolean) => void};

export type gameTexture = {
	type: 'color',
	color: string,
} | {
	type: 'image',
	image?: HTMLImageElement,
	imageSrc: string,
	imageRotation: 0 | 1 | 2 | 3,
}

export type screenData = {
	delta: Coordinates,
	width: number,
	height: number,
}

export enum EGameMode {
	Local,
	Classic,
	Random,
	Custom,
};

export type gameTheme = {
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

export type gamePlayer = {
	active: true,
	eleminated: boolean,
	isBot: boolean,
	score: number,
}

export enum BotDifficulty {
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
	aispeed:			number,
	playerspeed:		number,
	gameArea:			Rectangle,
	ball:				Rectangle & { speed: number, acceleration: number, direction: number },
	player_top:			Rectangle & gamePlayer | { active: false },
	player_bottom:		Rectangle & gamePlayer | { active: false },
	player_left:		Rectangle & gamePlayer | { active: false },
	player_right:		Rectangle & gamePlayer | { active: false },
	obstacles:			{ [key: string]: Rectangle & { hidden: boolean } }
}

export type gameSettingsType = {
	maxPoint:			number,
	numPlayer:			number,
	ballSize:			number,
	padSize:			number,
	mode:				BotDifficulty,
	randomizer:			boolean,
	speedAcceleration:	number,
	initialBallSpeed:	number,
}
