import { Direction } from "../types/game";

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

	move(player: Direction, direction: Direction, status: boolean){
		switch (player) {
			case Direction.LEFT:
				switch (direction) {
					case Direction.TOP:		this.controller.playerLeftMoveUp = status;		return;
					case Direction.BOTTOM:	this.controller.playerLeftMoveDown = status;	return;
					default:																return;
				}
			case Direction.RIGHT:
				switch (direction) {
					case Direction.TOP:		this.controller.playerRightMoveUp = status;		return;
					case Direction.BOTTOM:	this.controller.playerRightMoveDown = status;	return;
					default:																return;
				}
			case Direction.TOP:
				switch (direction) {
					case Direction.LEFT:	this.controller.playerTopMoveLeft = status;		return;
					case Direction.RIGHT:	this.controller.playerTopMoveRight = status;	return;
					default:																return;
				}
			case Direction.BOTTOM:
				switch (direction) {
					case Direction.LEFT:	this.controller.playerBottomMoveLeft = status;	return;
					case Direction.RIGHT:	this.controller.playerBottomMoveRight = status;	return;
					default:																return;
				}
			default:																		return;
		}
	}
	
	startRound(status: boolean){
		this.controller.startRound = status;
	}
}