import { BotDifficulty2, Direction } from "#imports";

const gameState4PlayersDefault: gameStateType = {
	status:					gameStatusType.ON_HOLD,
	aispeed:				0.1,
	gameArea: 				{	center: {	x: 0,	y: 0,		},	height_d_2: 30,		width_d_2: 30,	},
	ball: 					{	center: {	x: 0,	y: 0,		},	height_d_2: 1,		width_d_2: 1,	speed: 1, direction: Math.PI / 4	},
	player_top: 			{	center: {	x: 0,	y: -25,		},	height_d_2: 1,		width_d_2: 5,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_bottom:			{	center: {	x: 0,	y: 25,		},	height_d_2: 1,		width_d_2: 5,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_left:			{	center: {	x: -25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_right: 			{	center: {	x: 25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	obstacles: {
		player4BottomElim:	{	center: {	x: 0,	y: 27,		},	height_d_2: 3,		width_d_2: 33,	hidden: true	},
		player4TopElim:		{	center: {	x: 0,	y: -27,		},	height_d_2: 3,		width_d_2: 33,	hidden: true	},
		player4LeftElim:	{	center: {	x: -27,	y: 0,		},	height_d_2: 33,		width_d_2: 3,	hidden: true	},
		player4RightElim:	{	center: {	x: 27,	y: 0,		},	height_d_2: 33,		width_d_2: 3,	hidden: true	},
		player4BottomRight:	{	center: {	x: 27,	y: 27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
		player4TopRight:	{	center: {	x: 27,	y: -27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
		player4BottomLeft:	{	center: {	x: -27,	y: 27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
		player4TopLeft:		{	center: {	x: -27,	y: -27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
	}
}

const gameState2PlayersDefault: gameStateType = {
	status:				gameStatusType.ON_HOLD,
	aispeed:			0.1,
	gameArea:			{	center: {	x: 0,	y: 0,		},	height_d_2: 25,		width_d_2: 35,	},
	ball:				{	center: {	x: 0,	y: 0,		},	height_d_2: 1,		width_d_2: 1,	speed: 1, direction: Math.PI / 4	},
	player_left:		{	center: {	x: -25,	y: 0,		},	height_d_2: 10,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_right:		{	center: {	x: 25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_top:			{	active: false,	},
	player_bottom:		{	active: false,	},
	obstacles: {
		player2Bottom:	{	center: {	x: 0,	y: 26 ,	},	height_d_2: 1,	width_d_2: 35,	hidden: false	},
		player2Top:		{	center: {	x: 0,	y: -26,	},	height_d_2: 1,	width_d_2: 35,	hidden: false	},
		
	}
}

export function getNewAngleForBall(dir: Direction = Direction.NONE) {
	switch (dir) {
		case Direction.TOP:		return (1/2 + 1/16) * Math.PI;
		case Direction.BOTTOM:	return (3/2 + 1/16) * Math.PI;
		case Direction.LEFT:	return (  1 + 1/16) * Math.PI;
		case Direction.NONE:
		case Direction.RIGHT:	return (  0 + 1/16) * Math.PI;
	}
}

export function getSpeedForDifficulty(difficulty: BotDifficulty2) {
	switch (difficulty) {
		case BotDifficulty2.NORMAL:		return 0.2;
		case BotDifficulty2.HARD:		return 0.4;
		case BotDifficulty2.CRAZY:		return 0.6;
	}
}

export function getNewStateWithGameSettings(): gameStateType {
	const { gameSettings } = useGame2Store();

	let base = JSON.parse(JSON.stringify((gameSettings.value.numPlayer === 4 ? gameState4PlayersDefault : gameState2PlayersDefault)));

	if (gameSettings.value.numPlayer === 1 && base.player_left.active){
		base.player_left.isBot = true;
	}

	if (base.player_top.active){
		base.player_top.width_d_2 = gameSettings.value.padSize;
	}
	if (base.player_bottom.active){
		base.player_bottom.width_d_2 = gameSettings.value.padSize;
	}
	if (base.player_left.active){
		base.player_left.height_d_2 = gameSettings.value.padSize;
	}
	if (base.player_right.active){
		base.player_right.height_d_2 = gameSettings.value.padSize;
	}

	base.ball.height_d_2 = gameSettings.value.ballSize;
	base.ball.width_d_2 = gameSettings.value.ballSize;

	base.ball.direction = getNewAngleForBall();
	base.aispeed = getSpeedForDifficulty(gameSettings.value.mode);

	return base;
}