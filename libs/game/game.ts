import { gamePlayer, gameSettingsType, gameStateType, gameStatusType } from '../types/game/game';
import { Axis, Coordinates, Direction, Rectangle } from '../types/game/utils';
import { Controller } from './controller';
import { getNewStateWithGameSettings } from './getNewStateWithGameSettings';

const updatePerSeconds = 60
const millisecondsPerUpdate = 1000/updatePerSeconds

const speedAcceleration = 0.0005;
const initialBallSpeed = 0.25;

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

	// Checks if the moving Rectangle does not intersect with the static Rectangle on its way to newPos.
	private intersects(moving_rec: Rectangle, static_rec: Rectangle, new_pos_for_moving_rec: Coordinates, inside: boolean = false): Direction {
		const width_large_rec = static_rec.width_d_2 + moving_rec.width_d_2;
		const height_large_rec = static_rec.height_d_2 + moving_rec.height_d_2;

		const topLeft       = { x: static_rec.center.x - width_large_rec, y: static_rec.center.y + height_large_rec };
		const topRight      = { x: static_rec.center.x + width_large_rec, y: static_rec.center.y + height_large_rec };
		const bottomLeft    = { x: static_rec.center.x - width_large_rec, y: static_rec.center.y - height_large_rec };
		const bottomRight   = { x: static_rec.center.x + width_large_rec, y: static_rec.center.y - height_large_rec };
	
		if ((!inside && moving_rec.center.x < new_pos_for_moving_rec.x) || (inside && moving_rec.center.x > new_pos_for_moving_rec.x)){
			if (this.doSegmentsIntersect(moving_rec.center, new_pos_for_moving_rec, bottomLeft, topLeft)){
				return Direction.LEFT;
			}
		}
		else {
			if (this.doSegmentsIntersect(moving_rec.center, new_pos_for_moving_rec, topRight, bottomRight)){
				return Direction.RIGHT;
			}
		
		}
		if ((!inside && moving_rec.center.y > new_pos_for_moving_rec.y) || (inside && moving_rec.center.y < new_pos_for_moving_rec.y)){
			if (this.doSegmentsIntersect(moving_rec.center, new_pos_for_moving_rec, topLeft, topRight)){
				return Direction.TOP;
			}
		}
		else {
			if (this.doSegmentsIntersect(moving_rec.center, new_pos_for_moving_rec, bottomRight, bottomLeft)){
				return Direction.BOTTOM;
			}
		}
		return Direction.NONE;
	}

	// Helper function to check if two line segments intersect
	private doSegmentsIntersect(a: Coordinates, b: Coordinates, c: Coordinates, d: Coordinates): boolean {
		const ccw = (p1: Coordinates, p2: Coordinates, p3: Coordinates) =>
			(p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
	
		return (
			ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d)
		);
	}

	private calcutateNewBallDirectionAfterHittingPlayer(
		ball: Rectangle & { speed: number, direction: number },
		player: Rectangle,
		direction: Exclude<Direction, Direction.NONE>,
	){
		ball.direction = (() => {
			switch (direction) {
				case Direction.RIGHT:	return Math.PI * (0 / 2 + (ball.center.y - player.center.y)/(4 * (ball.height_d_2 + player.height_d_2)));
				case Direction.LEFT:	return Math.PI * (2 / 2 - (ball.center.y - player.center.y)/(4 * (ball.height_d_2 + player.height_d_2)));
				case Direction.TOP:		return Math.PI * (1 / 2 - (ball.center.x - player.center.x)/(4 * (ball.width_d_2 + player.width_d_2)));
				case Direction.BOTTOM:	return Math.PI * (3 / 2 + (ball.center.x - player.center.x)/(4 * (ball.width_d_2 + player.width_d_2)));
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
				case Direction.TOP:		this.gamestate.player_bottom.eleminated	= true; this.gamestate.obstacles.player4BottomElim.hidden = false; break;
				case Direction.BOTTOM:	this.gamestate.player_top.eleminated	= true; this.gamestate.obstacles.player4TopElim.hidden = false; break;
				case Direction.RIGHT:	this.gamestate.player_right.eleminated	= true; this.gamestate.obstacles.player4RightElim.hidden = false; break;
				case Direction.LEFT:	this.gamestate.player_left.eleminated	= true; this.gamestate.obstacles.player4LeftElim.hidden = false; break;
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
			if (this.gamestate.player_left.score >= this.gameSettings.maxPoint || this.gamestate.player_right.score >= this.gameSettings.maxPoint){
				this.gamestate.status = gameStatusType.GAMEOVER;
			}
		}
	}

	private moveBall(){
		const newPos: Coordinates = {
			x: this.gamestate.ball.center.x + Math.cos(this.gamestate.ball.direction) * this.gamestate.ball.speed,
			y: this.gamestate.ball.center.y + Math.sin(this.gamestate.ball.direction) * this.gamestate.ball.speed,
		}
		
		{
			const gameArea = JSON.parse(JSON.stringify(this.gamestate.gameArea));
			gameArea.width_d_2 += this.gamestate.ball.width_d_2 * 2;
			gameArea.height_d_2 += this.gamestate.ball.height_d_2 * 2;

			const doesIntersect = this.intersects(this.gamestate.ball, gameArea, newPos, true);
			if (doesIntersect !== Direction.NONE){
				this.gamestate.ball.center.x = 0;
				this.gamestate.ball.center.y = 0;
				this.gamestate.ball.speed = initialBallSpeed;
				this.updatePoints(doesIntersect);
				return ;
			}
		}
	
		this.gamestate.ball.speed += speedAcceleration;
	
		for (const obstacleKey in this.gamestate.obstacles){
			if (this.gamestate.obstacles[obstacleKey].hidden){
				continue ;
			}
			const doesIntersect = this.intersects(this.gamestate.ball, this.gamestate.obstacles[obstacleKey], newPos);
			if (doesIntersect !== Direction.NONE){
				this.calcutateNewBallDirectionAfterHittingObstacle(doesIntersect);
			}
		}
		const players = [
			this.gamestate.player_bottom,
			this.gamestate.player_top,
			this.gamestate.player_right,
			this.gamestate.player_left,
		]
		for (const player of players){
			if (player.active && !player.eleminated){
				const doesIntersect = this.intersects(this.gamestate.ball, player, newPos);
				if (doesIntersect !== Direction.NONE){
					this.calcutateNewBallDirectionAfterHittingPlayer(this.gamestate.ball, player, doesIntersect);
					return ;
				}
			}
		}
		
		this.gamestate.ball.center.x += Math.cos(this.gamestate.ball.direction) * this.gamestate.ball.speed;
		this.gamestate.ball.center.y += Math.sin(this.gamestate.ball.direction) * this.gamestate.ball.speed;
	}

	private movePlayer(player: Rectangle & gamePlayer, axis: Axis, delta: number){
		const filteredObstacles = Object.entries(this.gamestate.obstacles).filter((elem) => elem[1].hidden === false)
		switch (axis) {
			case Axis.X:
				for (const obstacle of filteredObstacles){
					const res = this.intersects(player, obstacle[1], { x: player.center.x + delta, y: player.center.y });
					if (res !== Direction.NONE){
						return ;
					}
				}
				player.center.x += delta
				break;
			case Axis.Y:
				
				for (const obstacle of filteredObstacles){
					const res = this.intersects(player, obstacle[1], { x: player.center.x, y: player.center.y + delta });
					if (res !== Direction.NONE){
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
						this.movePlayer(player, axis, -this.gamestate.aispeed);
					}
					else {
						this.movePlayer(player, axis, this.gamestate.aispeed);
					}
				}
			}
			else {
				if (controller1){
					this.movePlayer(player, axis, -0.5);
				}
				if (controller2){
					this.movePlayer(player, axis, 0.5);
				}
			}
		}
	}

	private moveAllPlayers(){
		this.movePlayerTo(this.gamestate.player_left, Axis.Y, this.controller.playerLeftMoveUp, this.controller.playerLeftMoveDown);
		this.movePlayerTo(this.gamestate.player_right, Axis.Y, this.controller.playerRightMoveUp, this.controller.playerRightMoveDown);
		this.movePlayerTo(this.gamestate.player_top, Axis.X, this.controller.playerTopMoveLeft, this.controller.playerTopMoveRight);
		this.movePlayerTo(this.gamestate.player_bottom, Axis.X, this.controller.playerBottomMoveLeft, this.controller.playerBottomMoveRight);
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
