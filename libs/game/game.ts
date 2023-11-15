import { Axis, Direction, Rectangle, gamePlayer, gameSettingsType, gameStateType, gameStatusType } from '../types/game';
import { Controller } from './controller';
import { getNewStateWithGameSettings } from './getNewStateWithGameSettings';

const updatePerSeconds = 30
const millisecondsPerUpdate = 1000/updatePerSeconds

export class GameEngine extends Controller {
	private gamestate: gameStateType;
	private continueLoop = false;
	private needsSleep = false;
	private datewip = new Date;
	private gameSettings: gameSettingsType;
	
	constructor(
		gameSettings: gameSettingsType,
		public sendGameStateUpdate:	(newGameState: gameStateType) => void = () => {},
		public editLocalState:		(state: gameStateType) => void = () => {},
	){
		super();
		this.gameSettings = JSON.parse(JSON.stringify(gameSettings));
		this.gamestate = getNewStateWithGameSettings(this.gameSettings, editLocalState);
	}
	
	private async loop() {
		console.log('Game Engine Start');
		while (this.continueLoop){
			switch (this.gamestate.status) {
				case gameStatusType.ON_HOLD:
					this.moveAllPlayers(this.gamestate);
					break ;
				case gameStatusType.STARTED: 
					this.moveAllPlayers(this.gamestate);
					this.moveBall();
					break ;
				case gameStatusType.GAMEOVER:
					if (this.needsSleep){
						this.needsSleep = false;
						this.datewip = new Date((new Date).getTime() + 10000);
					}
					else if (new Date() > this.datewip){
						this.needsSleep = true;
						this.restart(this.gameSettings);
					}
					break ;
			}
			this.sendGameStateUpdate(JSON.parse(JSON.stringify(this.gamestate)));
			if (this.controller.startRound && this.gamestate.status == gameStatusType.ON_HOLD){
				this.gamestate.status = gameStatusType.STARTED;
			}
	
			await new Promise(resolve => setTimeout(resolve, millisecondsPerUpdate));
		}
		console.log('Game Engine Stop');
	}

	private getIntersection(rec1: Rectangle, rec2: Rectangle, preference: Axis): Direction {
		// Calculate the boundaries of the rectangles
		const rec1Left = rec1.center.x - rec1.width_d_2;
		const rec1Right = rec1.center.x + rec1.width_d_2;
		const rec1Top = rec1.center.y - rec1.height_d_2;
		const rec1Bottom = rec1.center.y + rec1.height_d_2;
	
		const rec2Left = rec2.center.x - rec2.width_d_2;
		const rec2Right = rec2.center.x + rec2.width_d_2;
		const rec2Top = rec2.center.y - rec2.height_d_2;
		const rec2Bottom = rec2.center.y + rec2.height_d_2;
	
		// Check for intersection
		const intersects = rec1Left <= rec2Right && rec1Right >= rec2Left && rec1Top <= rec2Bottom && rec1Bottom >= rec2Top;
	
		if (!intersects) {
			return Direction.NONE;
		}

		// Check if one rectangle is completely inside the other
		const rec1InsideRec2 = rec1Left >= rec2Left && rec1Right <= rec2Right && rec1Top >= rec2Top && rec1Bottom <= rec2Bottom;
		const rec2InsideRec1 = rec2Left >= rec1Left && rec2Right <= rec1Right && rec2Top >= rec1Top && rec2Bottom <= rec1Bottom;

		if (rec1InsideRec2 || rec2InsideRec1) {
			return Direction.NONE; // One rectangle is inside the other
		}
		
		// If there is an intersection, determine which side has been hit
		const overlapLeft = rec2Right - rec1Left;
		const overlapRight = rec1Right - rec2Left;
		const overlapTop = rec1Bottom - rec2Top;
		const overlapBottom = rec2Bottom - rec1Top;

		// Find the minimum overlap to determine the side of intersection
		const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

		switch (preference) {
			case Axis.X:
				switch (minOverlap) {
					case overlapLeft:	return Direction.LEFT;
					case overlapRight:	return Direction.RIGHT;
					case overlapTop:	return Direction.TOP;
					case overlapBottom:	return Direction.BOTTOM;
					default:			return Direction.NONE; 
				}
			case Axis.Y:
				switch (minOverlap) {
					case overlapTop:	return Direction.TOP;
					case overlapBottom:	return Direction.BOTTOM;
					case overlapLeft:	return Direction.LEFT;
					case overlapRight:	return Direction.RIGHT;
					default:			return Direction.NONE; 
				}
		}
	}

	private calcutateNewBallDirectionAfterHittingPlayer(
		ball: Rectangle & { speed: number, direction: number },
		player: Rectangle,
		direction: Exclude<Direction, Direction.NONE>,
	){
		ball.direction = (() => {
			switch (direction) {
				case Direction.RIGHT:	return Math.PI - (ball.center.y - player.center.y)/(ball.height_d_2 + player.height_d_2) * Math.PI/4;
				case Direction.LEFT:	return 0 + (ball.center.y - player.center.y)/(ball.height_d_2 + player.height_d_2) * Math.PI/4;
				case Direction.TOP:		return Math.PI * 3/2 + (ball.center.x - player.center.x)/(ball.width_d_2 + player.width_d_2) * Math.PI/4;
				case Direction.BOTTOM:	return Math.PI / 2 - (ball.center.x - player.center.x)/(ball.width_d_2 + player.width_d_2) * Math.PI/4;;
			}
		})();
	}

	private calcutateNewBallDirectionAfterHittingObstacle(
		direction: Exclude<Direction, Direction.NONE>,
	){
		this.gamestate.ball.direction = (() => {
			switch (direction) {
				case Direction.RIGHT:	return Math.PI - this.gamestate.ball.direction;
				case Direction.LEFT:	return Math.PI - this.gamestate.ball.direction;
				case Direction.TOP:		return 2 * Math.PI - this.gamestate.ball.direction;
				case Direction.BOTTOM:	return 2 * Math.PI - this.gamestate.ball.direction;
			}
		})();
	}

	private resetRound(gamestate: gameStateType){
		gamestate.status = gameStatusType.ON_HOLD;
		if (gamestate.player_bottom.active){
			gamestate.player_bottom.eleminated = false;
			gamestate.obstacles.player4BottomElim.hidden = true;
		}
		if (gamestate.player_top.active){
			gamestate.player_top.eleminated = false;
			gamestate.obstacles.player4TopElim.hidden = true;
		}
		if (gamestate.player_right.active){
			gamestate.player_right.eleminated = false;
			if (gamestate.obstacles?.player4RightElim){
				gamestate.obstacles.player4RightElim.hidden = true;
			}
		}
		if (gamestate.player_left.active){
			gamestate.player_left.eleminated = false;
			if (gamestate.obstacles?.player4LeftElim){
				gamestate.obstacles.player4LeftElim.hidden = true;
			}
		}
	}

	private updatePoints(gamestate: gameStateType, doesIntersect: Direction){
		if (gamestate.player_left.active && gamestate.player_right.active && gamestate.player_top.active && gamestate.player_bottom.active){
			switch (doesIntersect) {
				case Direction.BOTTOM:	gamestate.player_bottom.eleminated	= true; gamestate.obstacles.player4BottomElim.hidden = false; break;
				case Direction.TOP:		gamestate.player_top.eleminated		= true; gamestate.obstacles.player4TopElim.hidden = false; break;
				case Direction.LEFT:	gamestate.player_right.eleminated	= true; gamestate.obstacles.player4RightElim.hidden = false; break;
				case Direction.RIGHT:	gamestate.player_left.eleminated	= true; gamestate.obstacles.player4LeftElim.hidden = false; break;
			}
			if (gamestate.player_bottom.eleminated && gamestate.player_top.eleminated && gamestate.player_left.eleminated){
				gamestate.player_right.score += 1;
				this.resetRound(gamestate);
			}
			else if (gamestate.player_bottom.eleminated && gamestate.player_top.eleminated && gamestate.player_right.eleminated){
				gamestate.player_left.score += 1;
				this.resetRound(gamestate);
			}
			else if (gamestate.player_bottom.eleminated && gamestate.player_left.eleminated && gamestate.player_right.eleminated){
				gamestate.player_top.score += 1;
				this.resetRound(gamestate);
			}
			else if (gamestate.player_left.eleminated && gamestate.player_top.eleminated && gamestate.player_right.eleminated){
				gamestate.player_bottom.score += 1;
				this.resetRound(gamestate);
			}
			if (gamestate.player_bottom.score >= this.gameSettings.maxPoint || gamestate.player_top.score >= this.gameSettings.maxPoint ||
				gamestate.player_left.score >= this.gameSettings.maxPoint || gamestate.player_right.score >= this.gameSettings.maxPoint
			){
				gamestate.status = gameStatusType.GAMEOVER;
			}
		}
		else if (gamestate.player_left.active && gamestate.player_right.active){
			if (doesIntersect === Direction.LEFT){
				gamestate.player_right.score += 1;
				this.resetRound(gamestate);
			}
			else if (doesIntersect === Direction.RIGHT){
				gamestate.player_left.score += 1;
				this.resetRound(gamestate);
			}
		}
	}

	private checkBallHitPlayer(
		player: (Rectangle & gamePlayer) | { active: false; },
		direction: Exclude<Direction, Direction.NONE>,
		axis: Axis,
	){
		if (player.active){
			const doesIntersect = this.getIntersection(this.gamestate.ball, player, axis);
			if (doesIntersect === direction){
				this.calcutateNewBallDirectionAfterHittingPlayer(this.gamestate.ball, player, doesIntersect);
			}
		}
	}

	private moveBall(){
		{
			const gameArea = JSON.parse(JSON.stringify(this.gamestate.gameArea));
			gameArea.width_d_2 += this.gamestate.ball.width_d_2 * 2;
			gameArea.height_d_2 += this.gamestate.ball.height_d_2 * 2;

			const doesIntersect = this.getIntersection(this.gamestate.ball, gameArea, Axis.Y);
			if (doesIntersect !== Direction.NONE){
				this.gamestate.ball.center.x = 0;
				this.gamestate.ball.center.y = 0;
				this.gamestate.ball.speed = 0.5;
				this.updatePoints(this.gamestate, doesIntersect);
				return ;
			}
		}
	
		this.gamestate.ball.speed += 0.01;
	
		for (const obstacleKey in this.gamestate.obstacles){
			if (this.gamestate.obstacles[obstacleKey].hidden){
				continue ;
			}
			const doesIntersect = this.getIntersection(this.gamestate.ball, this.gamestate.obstacles[obstacleKey], Axis.X);
			if (doesIntersect !== Direction.NONE){
				this.calcutateNewBallDirectionAfterHittingObstacle(doesIntersect);
			}
		}
		this.checkBallHitPlayer(this.gamestate.player_bottom, Direction.TOP, Axis.X);
		this.checkBallHitPlayer(this.gamestate.player_top, Direction.BOTTOM, Axis.X);
		this.checkBallHitPlayer(this.gamestate.player_left, Direction.LEFT, Axis.Y);
		this.checkBallHitPlayer(this.gamestate.player_right, Direction.RIGHT, Axis.Y);
		
		this.gamestate.ball.center.x += Math.cos(this.gamestate.ball.direction) * this.gamestate.ball.speed;
		this.gamestate.ball.center.y += Math.sin(this.gamestate.ball.direction) * this.gamestate.ball.speed;
	}

	private movePlayer(player: Rectangle & gamePlayer, axis: Axis, delta: number, blockIfDirectionIs: Direction, gamestate: gameStateType){
		switch (axis) {
			case Axis.X:
				for (const obstacleKey in gamestate.obstacles){
					if (this.getIntersection(player, gamestate.obstacles[obstacleKey], Axis.X) === blockIfDirectionIs){
						return ;
					}
				}
				player.center.x += delta
				break;
			case Axis.Y:
				for (const obstacleKey in gamestate.obstacles){
					if (this.getIntersection(player, gamestate.obstacles[obstacleKey], Axis.Y) === blockIfDirectionIs){
						return ;
					}
				}
				player.center.y += delta
				break;
		}
	}

	private moveAllPlayers(gamestate: gameStateType){
		if (gamestate.player_left.active && !gamestate.player_left.eleminated){
			if (gamestate.player_left.isBot){
				const newPosition = gamestate.ball.center.y - gamestate.player_left.center.y + gamestate.ball.height_d_2 * 2;
				if (Math.abs(newPosition) > gamestate.aispeed){
					if (newPosition < 0){
						this.movePlayer(gamestate.player_left, Axis.Y, -gamestate.aispeed, Direction.BOTTOM, gamestate);
					}
					else {
						this.movePlayer(gamestate.player_left, Axis.Y, gamestate.aispeed, Direction.TOP, gamestate);
					}
				}
			}
			else {
				if (this.controller.playerLeftMoveUp){
					this.movePlayer(gamestate.player_left, Axis.Y, -0.5, Direction.BOTTOM, gamestate);
				}
				if (this.controller.playerLeftMoveDown){
					this.movePlayer(gamestate.player_left, Axis.Y, 0.5, Direction.TOP, gamestate);
				}
			}
		}
		if (gamestate.player_right.active && !gamestate.player_right.eleminated){
			if (gamestate.player_right.isBot){
				const newPosition = gamestate.ball.center.y - gamestate.player_right.center.y - gamestate.ball.height_d_2 * 2;
				if (Math.abs(newPosition) > gamestate.aispeed){
					if (newPosition < 0){
						this.movePlayer(gamestate.player_right, Axis.Y, -gamestate.aispeed, Direction.BOTTOM, gamestate);
					}
					else {
						this.movePlayer(gamestate.player_right, Axis.Y, gamestate.aispeed, Direction.TOP, gamestate);
					}
				}
			}
			else {
				if (this.controller.playerRightMoveUp){
					this.movePlayer(gamestate.player_right, Axis.Y, -0.5, Direction.BOTTOM, gamestate);
				}
				if (this.controller.playerRightMoveDown){
					this.movePlayer(gamestate.player_right, Axis.Y, 0.5, Direction.TOP, gamestate);
				}
			}
		}
		if (gamestate.player_top.active && !gamestate.player_top.eleminated){
			if (gamestate.player_top.isBot){
				const newPosition = gamestate.ball.center.x - gamestate.player_top.center.x + gamestate.ball.width_d_2 * 2;
				if (Math.abs(newPosition) > gamestate.aispeed){
					if (newPosition < 0){
						this.movePlayer(gamestate.player_top, Axis.X, -gamestate.aispeed, Direction.LEFT, gamestate);
					}
					else {
						this.movePlayer(gamestate.player_top, Axis.X, gamestate.aispeed, Direction.RIGHT, gamestate);
					}
				}
			}
			else {
				if (this.controller.playerTopMoveLeft){
					this.movePlayer(gamestate.player_top, Axis.X, -0.5, Direction.LEFT, gamestate);
				}
				if (this.controller.playerTopMoveRight){
					this.movePlayer(gamestate.player_top, Axis.X, 0.5, Direction.RIGHT, gamestate);
				}
			}
		}
		if (gamestate.player_bottom.active && !gamestate.player_bottom.eleminated){
			if (gamestate.player_bottom.isBot){
				const newPosition = gamestate.ball.center.x - gamestate.player_bottom.center.x - gamestate.ball.width_d_2 * 2;
				if (Math.abs(newPosition) > gamestate.aispeed){
					if (newPosition < 0){
						this.movePlayer(gamestate.player_bottom, Axis.X, -gamestate.aispeed, Direction.LEFT, gamestate);
					}
					else {
						this.movePlayer(gamestate.player_bottom, Axis.X, gamestate.aispeed, Direction.RIGHT, gamestate);
					}
				}
			}
			else {
				if (this.controller.playerBottomMoveLeft){
					this.movePlayer(gamestate.player_bottom, Axis.X, -0.5, Direction.LEFT, gamestate);
				}
				if (this.controller.playerBottomMoveRight){
					this.movePlayer(gamestate.player_bottom, Axis.X, 0.5, Direction.RIGHT, gamestate);
				}
			}
		}
	}

	public start() {
		this.continueLoop = true;
		this.loop();
	}

	public stop() {
		this.continueLoop = false;
	}

	public restart(gameSettings: gameSettingsType) {
		this.gameSettings = JSON.parse(JSON.stringify(gameSettings));
		this.gamestate = getNewStateWithGameSettings(this.gameSettings, this.editLocalState);
	}

	public changeGameStatus(newStatus: gameStatusType){
		this.gamestate.status = newStatus;
	}
}
