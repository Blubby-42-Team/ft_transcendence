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
					this.moveAllPlayers();
					break ;
				case gameStatusType.STARTED: 
					this.moveAllPlayers();
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
				case Direction.RIGHT:	return Math.PI * (2 / 2 - (ball.center.y - player.center.y)/(4 * (ball.height_d_2 + player.height_d_2)));
				case Direction.LEFT:	return Math.PI * (0 / 2 + (ball.center.y - player.center.y)/(4 * (ball.height_d_2 + player.height_d_2)));
				case Direction.TOP:		return Math.PI * (3 / 2 + (ball.center.x - player.center.x)/(4 * (ball.width_d_2 + player.width_d_2)));
				case Direction.BOTTOM:	return Math.PI * (1 / 2 - (ball.center.x - player.center.x)/(4 * (ball.width_d_2 + player.width_d_2)));
			};
		})();
	}

	private calcutateNewBallDirectionAfterHittingObstacle(
		direction: Exclude<Direction, Direction.NONE>,
	){
		this.gamestate.ball.direction = (() => {
			switch (direction) {
				case Direction.RIGHT:
				case Direction.LEFT:
					return Math.PI - this.gamestate.ball.direction;
				case Direction.TOP:
				case Direction.BOTTOM:
					return 2 * Math.PI - this.gamestate.ball.direction;
			}
		})();
	}

	private resetRound(){
		this.gamestate.status = gameStatusType.ON_HOLD;
		if (this.gamestate.player_bottom.active){
			this.gamestate.player_bottom.eleminated = false;
			this.gamestate.obstacles.player4BottomElim.hidden = true;
		}
		if (this.gamestate.player_top.active){
			this.gamestate.player_top.eleminated = false;
			this.gamestate.obstacles.player4TopElim.hidden = true;
		}
		if (this.gamestate.player_right.active){
			this.gamestate.player_right.eleminated = false;
			if (this.gamestate.obstacles?.player4RightElim){
				this.gamestate.obstacles.player4RightElim.hidden = true;
			}
		}
		if (this.gamestate.player_left.active){
			this.gamestate.player_left.eleminated = false;
			if (this.gamestate.obstacles?.player4LeftElim){
				this.gamestate.obstacles.player4LeftElim.hidden = true;
			}
		}
	}

	private updatePoints(doesIntersect: Direction){
		if (this.gamestate.player_left.active && this.gamestate.player_right.active && this.gamestate.player_top.active && this.gamestate.player_bottom.active){
			switch (doesIntersect) {
				case Direction.BOTTOM:	this.gamestate.player_bottom.eleminated	= true; this.gamestate.obstacles.player4BottomElim.hidden = false; break;
				case Direction.TOP:		this.gamestate.player_top.eleminated	= true; this.gamestate.obstacles.player4TopElim.hidden = false; break;
				case Direction.LEFT:	this.gamestate.player_right.eleminated	= true; this.gamestate.obstacles.player4RightElim.hidden = false; break;
				case Direction.RIGHT:	this.gamestate.player_left.eleminated	= true; this.gamestate.obstacles.player4LeftElim.hidden = false; break;
			}
			if (this.gamestate.player_bottom.eleminated && this.gamestate.player_top.eleminated && this.gamestate.player_left.eleminated){
				this.gamestate.player_right.score += 1;
				this.resetRound();
			}
			else if (this.gamestate.player_bottom.eleminated && this.gamestate.player_top.eleminated && this.gamestate.player_right.eleminated){
				this.gamestate.player_left.score += 1;
				this.resetRound();
			}
			else if (this.gamestate.player_bottom.eleminated && this.gamestate.player_left.eleminated && this.gamestate.player_right.eleminated){
				this.gamestate.player_top.score += 1;
				this.resetRound();
			}
			else if (this.gamestate.player_left.eleminated && this.gamestate.player_top.eleminated && this.gamestate.player_right.eleminated){
				this.gamestate.player_bottom.score += 1;
				this.resetRound();
			}
			if (this.gamestate.player_bottom.score >= this.gameSettings.maxPoint || this.gamestate.player_top.score >= this.gameSettings.maxPoint ||
				this.gamestate.player_left.score >= this.gameSettings.maxPoint || this.gamestate.player_right.score >= this.gameSettings.maxPoint
			){
				this.gamestate.status = gameStatusType.GAMEOVER;
			}
		}
		else if (this.gamestate.player_left.active && this.gamestate.player_right.active){
			if (doesIntersect === Direction.LEFT){
				this.gamestate.player_right.score += 1;
				this.resetRound();
			}
			else if (doesIntersect === Direction.RIGHT){
				this.gamestate.player_left.score += 1;
				this.resetRound();
			}
		}
	}

	private checkBallHitPlayer(
		player: (Rectangle & gamePlayer) | { active: false; },
		direction: Exclude<Direction, Direction.NONE>,
		axis: Axis,
	){
		if (player.active && !player.eleminated){
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
				this.updatePoints(doesIntersect);
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

	private movePlayer(player: Rectangle & gamePlayer, axis: Axis, delta: number, blockIfDirectionIs: Direction){
		switch (axis) {
			case Axis.X:
				for (const obstacleKey in this.gamestate.obstacles){
					if (this.getIntersection(player, this.gamestate.obstacles[obstacleKey], Axis.X) === blockIfDirectionIs){
						return ;
					}
				}
				player.center.x += delta
				break;
			case Axis.Y:
				for (const obstacleKey in this.gamestate.obstacles){
					if (this.getIntersection(player, this.gamestate.obstacles[obstacleKey], Axis.Y) === blockIfDirectionIs){
						return ;
					}
				}
				player.center.y += delta
				break;
		}
	}

	private movePlayerTo(
		player: (Rectangle & gamePlayer) | { active: false },
		axis: Axis,
		dir1: Direction,
		dir2: Direction,
		controller1: boolean,
		controller2: boolean,
	){
		if (player.active && !player.eleminated){
			if (player.isBot){
				const newPosition = (axis === Axis.Y
					? this.gamestate.ball.center.y - player.center.y + this.gamestate.ball.height_d_2 * 2
					: this.gamestate.ball.center.x - player.center.x + this.gamestate.ball.width_d_2 * 2);

				if (Math.abs(newPosition) > this.gamestate.aispeed){
					if (newPosition < 0){
						this.movePlayer(player, axis, -this.gamestate.aispeed, dir1);
					}
					else {
						this.movePlayer(player, axis, this.gamestate.aispeed, dir2);
					}
				}
			}
			else {
				if (controller1){
					this.movePlayer(player, axis, -0.5, dir1);
				}
				if (controller2){
					this.movePlayer(player, axis, 0.5, dir2);
				}
			}
		}
	}

	private moveAllPlayers(){
		this.movePlayerTo(this.gamestate.player_left, Axis.Y, Direction.BOTTOM, Direction.TOP, this.controller.playerLeftMoveUp, this.controller.playerLeftMoveDown);
		this.movePlayerTo(this.gamestate.player_right, Axis.Y, Direction.BOTTOM, Direction.TOP, this.controller.playerRightMoveUp, this.controller.playerRightMoveDown);
		this.movePlayerTo(this.gamestate.player_top, Axis.X, Direction.LEFT, Direction.RIGHT, this.controller.playerTopMoveLeft, this.controller.playerTopMoveRight);
		this.movePlayerTo(this.gamestate.player_bottom, Axis.X, Direction.LEFT, Direction.RIGHT, this.controller.playerBottomMoveLeft, this.controller.playerBottomMoveRight);
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
