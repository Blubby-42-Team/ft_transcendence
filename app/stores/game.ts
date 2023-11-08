export const useGameStore = defineStore('game', {
	state: () => ({
		_optionsList: {
			maxPoint: 1,
			numPlayer: 1,
			ballSize: 15,
			padSize: 100,
			theme: "dark mode",
			backgroundColor: "black",
			fontColor: "gray",
			assetsColor: "white",
			sound: true,
			mode: "easy",
			randomizer: true
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
			width: 1080,
			height: 720,
			preview: false
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
		scores: (state) => computed(() => state._scores),
		mouse: (state) => computed(() => state._mouse),
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
