import { Direction, Rectangle, gameSettingsType, gameStateType, gameStatusType } from "#imports";
import { getNewStateWithGameSettings } from "./getNewStateWithGameSettings";

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
			case Direction.RIGHT:	return Math.PI - (ball.center.y - player.center.y)/(ball.height_d_2 + player.height_d_2) * Math.PI/4;
			case Direction.LEFT:	return 0 + (ball.center.y - player.center.y)/(ball.height_d_2 + player.height_d_2) * Math.PI/4;
			case Direction.TOP:		return Math.PI * 3/2 + (ball.center.x - player.center.x)/(ball.width_d_2 + player.width_d_2) * Math.PI/4;
			case Direction.BOTTOM:	return Math.PI / 2 - (ball.center.x - player.center.x)/(ball.width_d_2 + player.width_d_2) * Math.PI/4;;
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

function resetRound(gamestate: gameStateType){
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
		gamestate.obstacles.player4RightElim.hidden = true;
	}
	if (gamestate.player_left.active){
		gamestate.player_left.eleminated = false;
		gamestate.obstacles.player4LeftElim.hidden = true;
	}
}

function updatePoints(gamestate: gameStateType, doesIntersect: Direction){
	const { gameSettings } = useGame2Store();

	if (gamestate.player_left.active && gamestate.player_right.active && gamestate.player_top.active && gamestate.player_bottom.active){
		switch (doesIntersect) {
			case Direction.BOTTOM:	gamestate.player_bottom.eleminated	= true; gamestate.obstacles.player4BottomElim.hidden = false; break;
			case Direction.TOP:		gamestate.player_top.eleminated		= true; gamestate.obstacles.player4TopElim.hidden = false; break;
			case Direction.LEFT:	gamestate.player_right.eleminated	= true; gamestate.obstacles.player4RightElim.hidden = false; break;
			case Direction.RIGHT:	gamestate.player_left.eleminated	= true; gamestate.obstacles.player4LeftElim.hidden = false; break;
		}
		if (gamestate.player_bottom.eleminated && gamestate.player_top.eleminated && gamestate.player_left.eleminated){
			gamestate.player_right.score += 1;
			resetRound(gamestate);
		}
		else if (gamestate.player_bottom.eleminated && gamestate.player_top.eleminated && gamestate.player_right.eleminated){
			gamestate.player_left.score += 1;
			resetRound(gamestate);
		}
		else if (gamestate.player_bottom.eleminated && gamestate.player_left.eleminated && gamestate.player_right.eleminated){
			gamestate.player_top.score += 1;
			resetRound(gamestate);
		}
		else if (gamestate.player_left.eleminated && gamestate.player_top.eleminated && gamestate.player_right.eleminated){
			gamestate.player_bottom.score += 1;
			resetRound(gamestate);
		}
		if (gamestate.player_bottom.score >= gameSettings.value.maxPoint || gamestate.player_top.score >= gameSettings.value.maxPoint ||
			gamestate.player_left.score >= gameSettings.value.maxPoint || gamestate.player_right.score >= gameSettings.value.maxPoint
		){
			gamestate.status = gameStatusType.GAMEOVER;
		}
	}
	else if (gamestate.player_left.active && gamestate.player_right.active){
		if (doesIntersect === Direction.LEFT){
			gamestate.player_right.score += 1;
			resetRound(gamestate);
		}
		else if (doesIntersect === Direction.RIGHT){
			gamestate.player_left.score += 1;
			resetRound(gamestate);
		}
	}
}

function moveBall(gamestate: gameStateType){
	{
		const gameArea: Rectangle = {
			center: {
				x: gamestate.gameArea.center.x,
				y: gamestate.gameArea.center.y
			},
			width_d_2: gamestate.gameArea.width_d_2 + gamestate.ball.width_d_2 * 2,
			height_d_2: gamestate.gameArea.height_d_2 + gamestate.ball.height_d_2 * 2
		};
		const doesIntersect = getIntersection(gamestate.ball, gameArea, Axis.Y);
		if (doesIntersect !== Direction.NONE){
			gamestate.ball.center.x = 0;
			gamestate.ball.center.y = 0;
			gamestate.ball.speed = 0.5;
			updatePoints(gamestate, doesIntersect);
			return ;
		}
	}

	gamestate.ball.speed += 0.01;

	for (const obstacleKey in gamestate.obstacles){
		if (gamestate.obstacles[obstacleKey].hidden){
			continue ;
		}
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
	if (gamestate.player_left.active && !gamestate.player_left.eleminated){
		if (gamestate.player_left.isBot){
			const newPosition = gamestate.ball.center.y - gamestate.player_left.center.y + gamestate.ball.height_d_2 * 2;
			if (Math.abs(newPosition) > gamestate.aispeed){
				if (newPosition < 0){
					movePlayer(gamestate.player_left, Axis.Y, -gamestate.aispeed, Direction.BOTTOM, gamestate);
				}
				else {
					movePlayer(gamestate.player_left, Axis.Y, gamestate.aispeed, Direction.TOP, gamestate);
				}
			}
		}
		else {
			if (gameController.controller.playerLeftMoveUp){
				movePlayer(gamestate.player_left, Axis.Y, -0.5, Direction.BOTTOM, gamestate);
			}
			if (gameController.controller.playerLeftMoveDown){
				movePlayer(gamestate.player_left, Axis.Y, 0.5, Direction.TOP, gamestate);
			}
		}
	}
	if (gamestate.player_right.active && !gamestate.player_right.eleminated){
		if (gamestate.player_right.isBot){
			const newPosition = gamestate.ball.center.y - gamestate.player_right.center.y - gamestate.ball.height_d_2 * 2;
			if (Math.abs(newPosition) > gamestate.aispeed){
				if (newPosition < 0){
					movePlayer(gamestate.player_right, Axis.Y, -gamestate.aispeed, Direction.BOTTOM, gamestate);
				}
				else {
					movePlayer(gamestate.player_right, Axis.Y, gamestate.aispeed, Direction.TOP, gamestate);
				}
			}
		}
		else {
			if (gameController.controller.playerRightMoveUp){
				movePlayer(gamestate.player_right, Axis.Y, -0.5, Direction.BOTTOM, gamestate);
			}
			if (gameController.controller.playerRightMoveDown){
				movePlayer(gamestate.player_right, Axis.Y, 0.5, Direction.TOP, gamestate);
			}
		}
	}
	if (gamestate.player_top.active && !gamestate.player_top.eleminated){
		if (gamestate.player_top.isBot){
			const newPosition = gamestate.ball.center.x - gamestate.player_top.center.x + gamestate.ball.width_d_2 * 2;
			if (Math.abs(newPosition) > gamestate.aispeed){
				if (newPosition < 0){
					movePlayer(gamestate.player_top, Axis.X, -gamestate.aispeed, Direction.LEFT, gamestate);
				}
				else {
					movePlayer(gamestate.player_top, Axis.X, gamestate.aispeed, Direction.RIGHT, gamestate);
				}
			}
		}
		else {
			if (gameController.controller.playerTopMoveLeft){
				movePlayer(gamestate.player_top, Axis.X, -0.5, Direction.LEFT, gamestate);
			}
			if (gameController.controller.playerTopMoveRight){
				movePlayer(gamestate.player_top, Axis.X, 0.5, Direction.RIGHT, gamestate);
			}
		}
	}
	if (gamestate.player_bottom.active && !gamestate.player_bottom.eleminated){
		if (gamestate.player_bottom.isBot){
			const newPosition = gamestate.ball.center.x - gamestate.player_bottom.center.x - gamestate.ball.width_d_2 * 2;
			if (Math.abs(newPosition) > gamestate.aispeed){
				if (newPosition < 0){
					movePlayer(gamestate.player_bottom, Axis.X, -gamestate.aispeed, Direction.LEFT, gamestate);
				}
				else {
					movePlayer(gamestate.player_bottom, Axis.X, gamestate.aispeed, Direction.RIGHT, gamestate);
				}
			}
		}
		else {
			if (gameController.controller.playerBottomMoveLeft){
				movePlayer(gamestate.player_bottom, Axis.X, -0.5, Direction.LEFT, gamestate);
			}
			if (gameController.controller.playerBottomMoveRight){
				movePlayer(gamestate.player_bottom, Axis.X, 0.5, Direction.RIGHT, gamestate);
			}
		}
	}
}

const updatePerSeconds = 30
const millisecondsPerUpdate = 1000/updatePerSeconds

async function start(
	sendGameStateUpdate: (newGameState: gameStateType) => void,
	editLocalState: (state: gameStateType) => void = () => {}
){
	const { gameSettings } = useGame2Store();
	let continueLoop = true;
	let gamestate = getNewStateWithGameSettings();
	editLocalState(gamestate);
	let needsSleep = false;
	let datewip = new Date;
	
	async function loop() {
		console.log('Game Engine Start');
		while (continueLoop){
			switch (gamestate.status) {
				case gameStatusType.ON_HOLD:
					moveAllPlayers(gamestate);
					break ;
				case gameStatusType.STARTED: 
					moveAllPlayers(gamestate);
					moveBall(gamestate);
					break ;
				case gameStatusType.GAMEOVER:
					if (needsSleep){
						needsSleep = false;
						datewip = new Date((new Date).getTime() + 10000);
					}
					else if (new Date() > datewip){
						needsSleep = true;
						restart();
					}
					break ;
			}
			sendGameStateUpdate(gamestate);
			if (gameController.controller.startRound && gamestate.status == gameStatusType.ON_HOLD){
				gamestate.status = gameStatusType.STARTED;
			}
	
			await new Promise(resolve => setTimeout(resolve, millisecondsPerUpdate));
		}
		console.log('Game Engine Stop');
	}

	function restart() {
		console.log('restart')
		gamestate = getNewStateWithGameSettings();
		editLocalState(gamestate);
		gamestate.status = gameStatusType.ON_HOLD;
	}

	function stop() {
		continueLoop = false;
	}

	function changeGameStatus(newStatus: gameStatusType){
		gamestate.status = newStatus;
	}
	
	loop();
	return { stop, restart, changeGameStatus };
}

export default {
	start,
}
