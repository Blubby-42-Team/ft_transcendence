import { Direction } from "../types/game/utils";

export class Controller {
	protected controller = {
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

	move(player: Direction, direction: boolean, status: boolean){
		switch (player) {
			case Direction.LEFT:
				switch (direction) {
					case true:		this.controller.playerLeftMoveUp = status;	return;
					case false:	this.controller.playerLeftMoveDown = status;	return;
					default:													return;
				}
			case Direction.RIGHT:
				switch (direction) {
					case true:		this.controller.playerRightMoveUp = status;	return;
					case false:	this.controller.playerRightMoveDown = status;	return;
					default:													return;
				}
			case Direction.TOP:
				switch (direction) {
					case true:	this.controller.playerTopMoveLeft = status;		return;
					case false:	this.controller.playerTopMoveRight = status;	return;
					default:													return;
				}
			case Direction.BOTTOM:
				switch (direction) {
					case true:	this.controller.playerBottomMoveLeft = status;	return;
					case false:	this.controller.playerBottomMoveRight = status;	return;
					default:													return;
				}
			default:															return;
		}
	}
	
	startRound(status: boolean){
		this.controller.startRound = status;
	}
}