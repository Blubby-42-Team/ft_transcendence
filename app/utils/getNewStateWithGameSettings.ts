import { Direction } from "#imports";

const gameState4PlayersDefault: gameStateType = {
	gameArea: 				{	center: {	x: 0,	y: 0,		},	height_d_2: 35,		width_d_2: 35,	},
	ball: 					{	center: {	x: 0,	y: 0,		},	height_d_2: 1,		width_d_2: 1,	speed: 0, direction: Math.PI / 4	},
	player_top: 			{	center: {	x: 0,	y: -25,		},	height_d_2: 1,		width_d_2: 5,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_bottom:			{	center: {	x: 0,	y: 25,		},	height_d_2: 1,		width_d_2: 5,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_left:			{	center: {	x: -25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_right: 			{	center: {	x: 25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	obstacles: {
		player4BottomRight:	{	center: {	x: 27,	y: 27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
		player4TopRight:	{	center: {	x: 27,	y: -27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
		player4BottomLeft:	{	center: {	x: -27,	y: 27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
		player4TopLeft:		{	center: {	x: -27,	y: -27,		},	height_d_2: 3,		width_d_2: 3,	hidden: false	},
		// test1:				{	center: {	x: 0,	y: 15,		},	height_d_2: 1,		width_d_2: 30,	hidden: false	},
		// test2:				{	center: {	x: 0,	y: -15,		},	height_d_2: 1,		width_d_2: 30,	hidden: false	},
		// test3:				{	center: {	x: 15,	y: 0,		},	height_d_2: 30,		width_d_2: 1,	hidden: false	},
		// test4:				{	center: {	x: -15,	y: 0,		},	height_d_2: 30,		width_d_2: 1,	hidden: false	},
	}
}

const gameState2PlayersDefault: gameStateType = {
	gameArea:			{	center: {	x: 0,	y: 0,		},	height_d_2: 30,		width_d_2: 40,	},
	ball:				{	center: {	x: 0,	y: 0,		},	height_d_2: 1,		width_d_2: 1,	speed: 0, direction: Math.PI / 4	},
	player_left:		{	center: {	x: -25,	y: 0,		},	height_d_2: 10,		width_d_2: 1,	active: true,	eleminated: false,	isBot: true,	score: 0	},
	player_right:		{	center: {	x: 25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
	player_top:			{	active: false,	},
	player_bottom:		{	active: false,	},
	obstacles: {
		player2Bottom:	{	center: {	x: 0,	y: 21 ,	},	height_d_2: 1,	width_d_2: 40,	hidden: false	},
		player2Top:		{	center: {	x: 0,	y: -21,	},	height_d_2: 1,	width_d_2: 40,	hidden: false	},
		
	}
}

const emptyDefault: gameStateType = {
	gameArea:			{	center: { x: 0, y: 0 }, width_d_2: 1, height_d_2: 1	},
	ball:				{	center: { x: 0, y: 0 }, width_d_2: 1, height_d_2: 1,	speed: 0, direction: Math.PI / 4	},
	player_top:			{	active: false	},
	player_bottom:		{	active: false	},
	player_left:		{	active: false	},
	player_right:		{	active: false	},
	obstacles: {},
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

export function getNewStateWithGameSettings(): gameStateType {
	const { gameSettings } = useGame2Store();

	let base = (gameSettings.value.numPlayer === 4 ? gameState4PlayersDefault : gameState2PlayersDefault);

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

	return base;
}