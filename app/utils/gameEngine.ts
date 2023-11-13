import { Direction, Rectangle, gameStateType, gameStatusType } from "#imports";
import { getNewStateWithGameSettings } from "./getNewStateWithGameSettings";

enum Axis {
	X,
	Y,
};

function getIntersection(rec1: Rectangle, rec2: Rectangle, preference: Axis): Direction {
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

function calcutateNewBallDirectionAfterHittingPlayer(
	ball: Rectangle & { speed: number, direction: number },
	player: Rectangle,
	direction: Direction.LEFT | Direction.RIGHT | Direction.TOP | Direction.BOTTOM,
){
	/**
	

	dir:		Angle of the bounce (0: right, 1: top, 2: left, 3: bottom) that need to be multiplied by PI / 2
	Py or Px:	position of the center of the player (depends on if looking on Axis X or Y);
	By or Bx:	position of the center of the ball (depends on if looking on Axis X or Y);
	H:			height of the player divided by two,

	res = dir * PI/2 + Min(Px - Bx, 1) * PI / 4
	                   ---------------
					         H
	res = PI * (dir/2 + Min(Px - Bx, 1))
	                    ---------------
						       4H

	*/
	
	ball.direction = (() => {
		switch (direction) {
			case Direction.RIGHT:	return Math.PI * (1 + (Math.min(player.center.y - ball.center.y, 1) / (4 * player.height_d_2) * Math.sign(ball.direction)));
			case Direction.LEFT:	return Math.PI * (0 + (Math.min(player.center.y - ball.center.y, 1) / (4 * player.height_d_2) * Math.sign(ball.direction)));
			case Direction.TOP:		return Math.PI * (3/2 + (Math.min(player.center.x - ball.center.x, 1) / (4 * player.width_d_2) * Math.sign(ball.direction)));
			case Direction.BOTTOM:	return Math.PI * (1/2 + (Math.min(player.center.x - ball.center.x, 1) / (4 * player.width_d_2) * Math.sign(ball.direction)));
		}
	})();
	
}



function calcutateNewBallDirectionAfterHittingObstacle(
	ball: Rectangle & { speed: number, direction: number },
	direction: Direction.LEFT | Direction.RIGHT | Direction.TOP | Direction.BOTTOM,
){
	ball.direction = (() => {
		switch (direction) {
			case Direction.RIGHT:	return Math.PI - ball.direction;
			case Direction.LEFT:	return Math.PI - ball.direction;
			case Direction.TOP:		return 2 * Math.PI - ball.direction;
			case Direction.BOTTOM:	return 2 * Math.PI - ball.direction;
		}
	})();
}

function moveBall(gamestate: gameStateType){
	{
		const doesIntersect = getIntersection(gamestate.ball, gamestate.gameArea, Axis.y);
		if (doesIntersect !== Direction.NONE){
			gamestate.ball.center.x = 0;
			gamestate.ball.center.y = 0;
			gamestate.ball.speed = 0;
			// RemovePlayer(direction)
			return ;
		}
	}

	for (const obstacleKey in gamestate.obstacles){
		const doesIntersect = getIntersection(gamestate.ball, gamestate.obstacles[obstacleKey], Axis.X);
		if (doesIntersect !== Direction.NONE){
			calcutateNewBallDirectionAfterHittingObstacle(gamestate.ball, doesIntersect);
			gamestate.ball.center.x += Math.cos(gamestate.ball.direction) * gamestate.ball.speed;
			gamestate.ball.center.y += Math.sin(gamestate.ball.direction) * gamestate.ball.speed;
			return ;
		}
	}
	
	if (gamestate.player_bottom.active){
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_bottom, Axis.X);
		if (doesIntersect === Direction.TOP){
			calcutateNewBallDirectionAfterHittingPlayer(gamestate.ball, gamestate.player_bottom, doesIntersect);
			gamestate.ball.center.x += Math.cos(gamestate.ball.direction) * gamestate.ball.speed;
			gamestate.ball.center.y += Math.sin(gamestate.ball.direction) * gamestate.ball.speed;
			return ;
		}
	}
	if (gamestate.player_top.active){
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_top, Axis.X);
		if (doesIntersect === Direction.BOTTOM){
			calcutateNewBallDirectionAfterHittingPlayer(gamestate.ball, gamestate.player_top, doesIntersect);
			gamestate.ball.center.x += Math.cos(gamestate.ball.direction) * gamestate.ball.speed;
			gamestate.ball.center.y += Math.sin(gamestate.ball.direction) * gamestate.ball.speed;
			return ;
		}
	}
	if (gamestate.player_left.active){
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_left, Axis.Y);
		if (doesIntersect === Direction.LEFT){
			calcutateNewBallDirectionAfterHittingPlayer(gamestate.ball, gamestate.player_left, doesIntersect);
			gamestate.ball.center.x += Math.cos(gamestate.ball.direction) * gamestate.ball.speed;
			gamestate.ball.center.y += Math.sin(gamestate.ball.direction) * gamestate.ball.speed;
			return ;
		}
	}
	if (gamestate.player_right.active){
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_right, Axis.Y);
		if (doesIntersect === Direction.RIGHT){
			calcutateNewBallDirectionAfterHittingPlayer(gamestate.ball, gamestate.player_right, doesIntersect);
			gamestate.ball.center.x += Math.cos(gamestate.ball.direction) * gamestate.ball.speed;
			gamestate.ball.center.y += Math.sin(gamestate.ball.direction) * gamestate.ball.speed;
			return ;
		}
	}
	
	gamestate.ball.center.x += Math.cos(gamestate.ball.direction) * gamestate.ball.speed;
	gamestate.ball.center.y += Math.sin(gamestate.ball.direction) * gamestate.ball.speed;
}


function movePlayer(player: Rectangle & gamePlayer2, axis: Axis, delta: number, blockIfDirectionIs: Direction, gamestate: gameStateType){
	switch (axis) {
		case Axis.X:
			for (const obstacleKey in gamestate.obstacles){
				if (getIntersection(player, gamestate.obstacles[obstacleKey], Axis.X) === blockIfDirectionIs){
					return ;
				}
			}
			player.center.x += delta
			break;
		case Axis.Y:
			for (const obstacleKey in gamestate.obstacles){
				if (getIntersection(player, gamestate.obstacles[obstacleKey], Axis.Y) === blockIfDirectionIs){
					return ;
				}
			}
			player.center.y += delta
			break;
	}
}

function moveAllPlayers(gamestate: gameStateType){
	if (gamestate.player_left.active && !gamestate.player_left.isBot && !gamestate.player_left.eleminated){
		if (gameController.controller.playerLeftMoveUp){
			movePlayer(gamestate.player_left, Axis.Y, -0.5, Direction.BOTTOM, gamestate);
		}
		if (gameController.controller.playerLeftMoveDown){
			movePlayer(gamestate.player_left, Axis.Y, 0.5, Direction.TOP, gamestate);
		}
	}
	if (gamestate.player_right.active && !gamestate.player_right.isBot && !gamestate.player_right.eleminated){
		if (gameController.controller.playerRightMoveUp){
			movePlayer(gamestate.player_right, Axis.Y, -0.5, Direction.BOTTOM, gamestate);
		}
		if (gameController.controller.playerRightMoveDown){
			movePlayer(gamestate.player_right, Axis.Y, 0.5, Direction.TOP, gamestate);
		}
	}
	if (gamestate.player_top.active && !gamestate.player_top.isBot && !gamestate.player_top.eleminated){
		if (gameController.controller.playerTopMoveLeft){
			movePlayer(gamestate.player_top, Axis.X, -0.5, Direction.LEFT, gamestate);
		}
		if (gameController.controller.playerTopMoveRight){
			movePlayer(gamestate.player_top, Axis.X, 0.5, Direction.RIGHT, gamestate);
		}
	}
	if (gamestate.player_bottom.active && !gamestate.player_bottom.isBot && !gamestate.player_bottom.eleminated){
		if (gameController.controller.playerBottomMoveLeft){
			movePlayer(gamestate.player_bottom, Axis.X, -0.5, Direction.LEFT, gamestate);
		}
		if (gameController.controller.playerBottomMoveRight){
			movePlayer(gamestate.player_bottom, Axis.X, 0.5, Direction.RIGHT, gamestate);
		}
	}
}

const updatePerSeconds = 30
const millisecondsPerUpdate = 1000/updatePerSeconds
let continueLoop = true;

async function start(updateGameState: (newGameState: gameStateType, gameStatus: gameStatusType) => void){
	console.log('Game Engine Start');
	let gamestate = getNewStateWithGameSettings();
	let gamestatus = gameStatusType.ON_HOLD;

	while (continueLoop){
		if (gameController.controller.startRound){
			gamestate.ball.speed = 0.5
		}
		moveAllPlayers(gamestate);
		// Move IA
		moveBall(gamestate);

		updateGameState(gamestate, gamestatus);

		await new Promise(resolve => setTimeout(resolve, millisecondsPerUpdate));
	}
	console.log('Game Engine Stop');
}

function stop(){
	continueLoop = false;
}

export default {
	start,
	stop,
}
