import { Direction } from "#imports";

const controller = {
	playerTopMoveLeft:		false,
	playerTopMoveRight:		false,
	playerBottomMoveLeft:	false,
	playerBottomMoveRight:	false,
	playerLeftMoveUp:		false,
	playerLeftMoveDown:		false,
	playerRightMoveUp:		false,
	playerRightMoveDown:	false,
	startRound:				false,
}

function move(player: Direction, direction: Direction, status: boolean){
	switch (player) {
		case Direction.LEFT:
			switch (direction) {
				case Direction.TOP:		controller.playerLeftMoveUp = status;		return;
				case Direction.BOTTOM:	controller.playerLeftMoveDown = status;		return;
				default:															return;
			}
		case Direction.RIGHT:
			switch (direction) {
				case Direction.TOP:		controller.playerRightMoveUp = status;		return;
				case Direction.BOTTOM:	controller.playerRightMoveDown = status;	return;
				default:															return;
			}
		case Direction.TOP:
			switch (direction) {
				case Direction.LEFT:	controller.playerTopMoveLeft = status;		return;
				case Direction.RIGHT:	controller.playerTopMoveRight = status;		return;
				default:															return;
			}
		case Direction.BOTTOM:
			switch (direction) {
				case Direction.LEFT:	controller.playerBottomMoveLeft = status;	return;
				case Direction.RIGHT:	controller.playerBottomMoveRight = status;	return;
				default:															return;
			}
		default:																	return;
	}
}

function startRound(status: boolean){
	controller.startRound = status;
}

export default {
	controller,
	move,
	startRound,
}