export type gameScreen = {
	width: number,
	height: number,
	deltaX: number,
	deltaY: number,
	preview: boolean,
	background: string
}

export type gameOption = {
	maxPoint: number,
	numPlayer: number,
	ballSize: number,
	padSize: number,
	sound: boolean,
	mode: string,
	randomizer: boolean,
}

export type gameTexture = {
	type: 'color',
	color: string,
} | {
	type: 'image',
	image?: HTMLImageElement,
	imageSrc: string,
	imageRotation: 0 | 1 | 2 | 3,
}

export type gameTheme = {
	fontColor: string,
	background:		gameTexture,
	player_top:		gameTexture,
	player_bottom:	gameTexture,
	player_left:	gameTexture,
	player_right:	gameTexture,
	ball:			gameTexture,
}

export type gamePlayer = {
	active: boolean,
	isBot: boolean,
	position: number,
	score:number
}

export type gamePlayers = {
	top:	gamePlayer,
	bottom: gamePlayer,
	left:	gamePlayer,
	right:	gamePlayer,
}

export type gameState =  {
	_optionsList: gameOption,
	_theme: gameTheme,
	_player: gamePlayers,
	_ball: {
		x: number,
		y: number,
		dir: number,
		speed: number,
	},
	_screen: gameScreen,
	_controller: {[key: string]: { pressed: boolean, func: () => void }},
	_utils: {
		start: boolean
	}
}

export const useGameStore = defineStore('game', {
	state: (): gameState => ({
		_optionsList: {
			maxPoint: 1,
			numPlayer: 1,
			ballSize: 15,
			padSize: 100,
			sound: true,
			mode: "easy",
			randomizer: true
		},
		_theme: {
			fontColor:		"gray",
			background:		{ type: 'color', color: 'black' },
			player_top:		{ type: 'color', color: 'white' },
			player_bottom:	{ type: 'color', color: 'white' },
			player_left:	{ type: 'color', color: 'white' },
			player_right:	{ type: 'color', color: 'white' },
			ball:			{ type: 'color', color: 'white' },
		},
		_player: {
			top:	{ active: false, isBot: false, position: 0, score: 0 },
			bottom: { active: false, isBot: false, position: 0, score: 0 },
			left:	{ active: false, isBot: false, position: 0, score: 0 },
			right:	{ active: false, isBot: false, position: 0, score: 0 },
		},
		_ball: {
			x: 0,
			y: 0,
			dir: Math.PI/6,
			speed: 0
		},
		_screen: {
			width: 200,
			height: 200,
			deltaX: 0,
			deltaY: 0,
			preview: false,
			background: "default"
		},
		_controller: {
			w:			{ pressed: false, func: gameController.moveW },
			s:			{ pressed: false, func: gameController.moveS },
			ArrowUp:	{ pressed: false, func: gameController.moveUp },
			ArrowDown:	{ pressed: false, func: gameController.moveDown },
			c:			{ pressed: false, func: gameController.moveC },
			v:			{ pressed: false, func: gameController.moveV },
			u:			{ pressed: false, func: gameController.moveU },
			i:			{ pressed: false, func: gameController.moveI }
		},
		_utils: {
			start: false
		}
	}),
	getters: {
		optionsList:	(state) => computed(() => state._optionsList),
		theme:			(state) => computed(() => state._theme),
		player: 		(state) => computed(() => state._player),
		ball: 			(state) => computed(() => state._ball),
		screen: 		(state) => computed(() => state._screen),
		controller: 	(state) => computed(() => state._controller),
		utils: 			(state) => computed(() => state._utils)
	},
	actions: {
	}
})
