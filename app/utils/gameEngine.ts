import { Direction, Rectangle, gameStatusType } from "#imports";
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

function moveBall(){
	{
		const doesIntersect = getIntersection(gamestate.ball, gamestate.gameArea, Axis.X);
		if (doesIntersect !== Direction.NONE){
			gamestate.ball.center.x = 0;
			gamestate.ball.center.y = 0;
			gamestate.ball.speed = 0;
			// RemovePlayer(direction)
			return ;
		}
	}
	
	{
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_bottom as Rectangle, Axis.X);
		if (doesIntersect !== Direction.NONE){
			return ;
		}
	}
	{
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_top as Rectangle, Axis.X);
		if (doesIntersect !== Direction.NONE){
			return ;
		}
	}
	{
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_left as Rectangle, Axis.X);
		if (doesIntersect !== Direction.NONE){
			return ;
		}
	}
	{
		const doesIntersect = getIntersection(gamestate.ball, gamestate.player_right as Rectangle, Axis.X);
		if (doesIntersect !== Direction.NONE){
			return ;
		}
	}
	for (const obstacleKey in gamestate.obstacles){
		const doesIntersect = getIntersection(gamestate.ball, gamestate.obstacles[obstacleKey], Axis.X);
		if (doesIntersect !== Direction.NONE){
			return ;
		}
	}
	gamestate.ball.center.x += Math.cos(gamestate.ball.direction) * gamestate.ball.speed;
	gamestate.ball.center.y += Math.sin(gamestate.ball.direction) * gamestate.ball.speed;
}


function movePlayer(player: Rectangle & gamePlayer2, axis: Axis, delta: number, blockIfDirectionIs: Direction){
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

function moveAllPlayers(){
	if (gamestate.player_left.active && !gamestate.player_left.isBot && !gamestate.player_left.eleminated){
		if (gameController.controller.playerLeftMoveUp){
			movePlayer(gamestate.player_left, Axis.Y, -0.5, Direction.BOTTOM);
		}
		if (gameController.controller.playerLeftMoveDown){
			movePlayer(gamestate.player_left, Axis.Y, 0.5, Direction.TOP);
		}
	}
	if (gamestate.player_right.active && !gamestate.player_right.isBot && !gamestate.player_right.eleminated){
		if (gameController.controller.playerRightMoveUp){
			movePlayer(gamestate.player_right, Axis.Y, -0.5, Direction.BOTTOM);
		}
		if (gameController.controller.playerRightMoveDown){
			movePlayer(gamestate.player_right, Axis.Y, 0.5, Direction.TOP);
		}
	}
	if (gamestate.player_top.active && !gamestate.player_top.isBot && !gamestate.player_top.eleminated){
		if (gameController.controller.playerTopMoveLeft){
			movePlayer(gamestate.player_top, Axis.X, -0.5, Direction.LEFT);
		}
		if (gameController.controller.playerTopMoveRight){
			movePlayer(gamestate.player_top, Axis.X, 0.5, Direction.RIGHT);
		}
	}
	if (gamestate.player_bottom.active && !gamestate.player_bottom.isBot && !gamestate.player_bottom.eleminated){
		if (gameController.controller.playerBottomMoveLeft){
			movePlayer(gamestate.player_bottom, Axis.X, -0.5, Direction.LEFT);
		}
		if (gameController.controller.playerBottomMoveRight){
			movePlayer(gamestate.player_bottom, Axis.X, 0.5, Direction.RIGHT);
		}
	}
}

let continueLoop = true;
let updatePerSeconds = 30
let millisecondsPerUpdate = 1000/updatePerSeconds
let gamestate: gameStateType;
let gameStatus: gameStatusType = gameStatusType.ON_HOLD;

async function start(updateGameState: (newGameState: gameStateType, gameStatus: gameStatusType) => void){
	console.log('Game Engine Start');
	continueLoop = true;
	gamestate = getNewStateWithGameSettings();
	while (continueLoop){
		if (gameController.controller.startRound){
			gamestate.ball.speed = 0.5
		}
		moveAllPlayers();
		moveBall();
		// Move IA
		// Move Ball
		// Check Colisition

		updateGameState(gamestate, gameStatus);

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
