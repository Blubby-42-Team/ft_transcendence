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
		status: gameStatus;
	}
}

export enum PlayerPosition {
	LEFT,
	RIGHT,
	TOP,
	BOTTOM,
};

export enum MoveDirection {
	LEFT,
	RIGHT,
};

export enum MoveDirection2 {
	VERTICAL,
	HORIZONTAL,
};

export enum gameStatus {
	ON_HOLD,
	STARTED,
	GAMEOVER,
};

export type gameControllerType = {[key: string]: { pressed: boolean, func: () => void }};

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
		_controller: {},
		_utils: {
			status: gameStatus.ON_HOLD,
		}
	}),
	getters: {
		optionsList:	(state) => computed(() => state._optionsList),
		theme:			(state) => computed(() => state._theme),
		player: 		(state) => computed(() => state._player),
		ball: 			(state) => computed(() => state._ball),
		screen: 		(state) => computed(() => state._screen),
		controller: 	(state) => computed(() => state._controller),
		utils: 			(state) => computed(() => state._utils),
		status:			(state) => computed(() => state._utils.status)
	},
	actions: {
		start(){
			if (this._utils.status === gameStatus.ON_HOLD){
				this._ball.speed = 4;
				this._utils.status = gameStatus.STARTED;
			}
		},
		reset(){
			this._ball.speed = 0;

			this._player.left.score		= 0;
			this._player.right.score	= 0;
			this._player.top.score		= 0;
			this._player.bottom.score	= 0;

			this._player.left.position		= 360 - this._optionsList.padSize/2;
			this._player.right.position		= 360 - this._optionsList.padSize/2;
			this._player.top.position		= 540 - this._optionsList.padSize/2;
			this._player.bottom.position	= 540 - this._optionsList.padSize/2;

			this._ball.x = 540 - this._optionsList.ballSize/2;
			this._ball.y = 360 - this._optionsList.ballSize/2;
		},
		setPlayer(position: PlayerPosition, isActive: boolean, isBot: boolean){
			switch (position) {
				case PlayerPosition.LEFT:
					this._player.left.active = isActive;
					this._player.left.isBot = isBot;
				case PlayerPosition.RIGHT:
					this._player.right.active = isActive;
					this._player.right.isBot = isBot;
				case PlayerPosition.TOP:
					this._player.top.active = isActive;
					this._player.top.isBot = isBot;
				case PlayerPosition.BOTTOM:
					this._player.bottom.active = isActive;
					this._player.bottom.isBot = isBot;
			}
		},
		changeGameStatus(newStatus: gameStatus){
			this._utils.status = newStatus;
		},
		move(pos: PlayerPosition, dir: MoveDirection){
			console.log(pos, dir)
			switch (pos) {
				case PlayerPosition.LEFT:
					if		(dir === MoveDirection.LEFT)	return this.movePlayer(this._player.left, MoveDirection2.VERTICAL, -20);
					else if	(dir === MoveDirection.RIGHT)	return this.movePlayer(this._player.left, MoveDirection2.VERTICAL, 20);
				case PlayerPosition.RIGHT:
					if		(dir === MoveDirection.LEFT)	return this.movePlayer(this._player.right, MoveDirection2.VERTICAL, -20);
					else if	(dir === MoveDirection.RIGHT)	return this.movePlayer(this._player.right, MoveDirection2.VERTICAL, 20);
				case PlayerPosition.TOP:
					if		(dir === MoveDirection.LEFT)	return this.movePlayer(this._player.top, MoveDirection2.HORIZONTAL, -20);
					else if	(dir === MoveDirection.RIGHT)	return this.movePlayer(this._player.top, MoveDirection2.HORIZONTAL, 20);
				case PlayerPosition.BOTTOM:
					if		(dir === MoveDirection.LEFT)	return this.movePlayer(this._player.top, MoveDirection2.HORIZONTAL, -20);
					else if	(dir === MoveDirection.RIGHT)	return this.movePlayer(this._player.top, MoveDirection2.HORIZONTAL, 20);
			}
		},
		movePlayer(player: gamePlayer, dir: MoveDirection2, delta: number){
			if (!player.active || player.isBot){
				return ;
			}
			if (dir === MoveDirection2.VERTICAL){
				if (0 + this._optionsList.padSize < player.position + delta && player.position + delta < 720 - this._optionsList.padSize)
					player.position += delta;
				else if (0 + this._optionsList.padSize > player.position + delta){
					player.position = 0 + this._optionsList.padSize;
				}
				else if (player.position + delta > 720 - this._optionsList.padSize){
					player.position = 720 - this._optionsList.padSize;
				}
			}
			else if (dir === MoveDirection2.HORIZONTAL){
				if (0 + this._optionsList.padSize < player.position + delta && player.position + delta < 1080 - this._optionsList.padSize)
					player.position += delta;
				else if (0 + this._optionsList.padSize > player.position + delta){
					player.position = 0 + this._optionsList.padSize;
				}
				else if (player.position + delta > 1080 - this._optionsList.padSize){
					player.position = 1080 - this._optionsList.padSize;
				}
			}
		}
	}
})
