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
	background: gameTexture,
	player1: gameTexture,
	player2: gameTexture,
	player3: gameTexture,
	player4: gameTexture,
	ball: gameTexture,
}

export type gameState =  {
	_optionsList: gameOption,
	_theme: gameTheme,
	_scores: {
		player1: number,
		player2: number,
		player3: number,
		player4: number
	},
	_players: {
		first: number,
		second: number,
		third: number,
		forth: number
	},
	_activePlayer: {
		top: boolean,
		bottom: boolean,
		left: boolean,
		right: boolean
	},
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
			fontColor:	"gray",
			background:	{ type: 'color', color: 'black' },
			player1:	{ type: 'color', color: 'white' },
			player2:	{ type: 'color', color: 'white' },
			player3:	{ type: 'color', color: 'white' },
			player4:	{ type: 'color', color: 'white' },
			ball:		{ type: 'color', color: 'white' },
		},
		_scores: {
			player1: 0,
			player2: 0,
			player3: 0,
			player4: 0
		},
		_players: {
			first: 0,
			second: 0,
			third: 0,
			forth: 0
		},
		_activePlayer: {
			top: false,
			bottom: false,
			left: true,
			right: true
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
			w: {pressed: false, func: gameController.moveW},
			s: {pressed: false, func: gameController.moveS},
			ArrowUp: {pressed: false, func: gameController.moveUp},
			ArrowDown: {pressed: false, func: gameController.moveDown},
			c: {pressed: false, func: gameController.moveC},
			v: {pressed: false, func: gameController.moveV},
			u: {pressed: false, func: gameController.moveU},
			i: {pressed: false, func: gameController.moveI}
		},
		_utils: {
			start: false
		}
	}),
	getters: {
		optionsList: (state) => computed(() => state._optionsList),
		theme: (state) => computed(() => state._theme),
		scores: (state) => computed(() => state._scores),
		players: (state) => computed(() => state._players),
		activePlayer: (state) => computed(() => state._activePlayer),
		ball: (state) => computed(() => state._ball),
		screen: (state) => computed(() => state._screen),
		controller: (state) => computed(() => state._controller),
		utils: (state) => computed(() => state._utils)
	},
	actions: {
	}
})
