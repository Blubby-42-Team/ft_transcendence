export class PlayerInfoType {
	player_id: string;
	player_sessions_token: string;
}

export class roomType {

	constructor(roomId: string, ownerPlayerId: string) {
		this.status = false;
		this.playerInfo = {
			Top: {
				player_id: '',
				player_sessions_token: '',
			},
			Bottom: {
				player_id: '',
				player_sessions_token: '',
			},
			Left: {
				player_id: '',
				player_sessions_token: '',
			},
			Right: {
				player_id: '',
				player_sessions_token: '',
			},
		};
		this.controller = {
			playerTopMoveLeft:		false,
			playerTopMoveRight:		false,
			playerBottomMoveLeft:	false,
			playerBottomMoveRight:	false,
			playerLeftMoveUp:		false,
			playerLeftMoveDown:		false,
			playerRightMoveUp:		false,
			playerRightMoveDown:	false,
			startRound:				false,
		};
	}

	status: boolean;

	playerInfo: {
		Top: PlayerInfoType,
		Bottom: PlayerInfoType,
		Left: PlayerInfoType,
		Right: PlayerInfoType,
	}

	controller: {
		playerTopMoveLeft:		boolean,
		playerTopMoveRight:		boolean,
		playerBottomMoveLeft:	boolean,
		playerBottomMoveRight:	boolean,
		playerLeftMoveUp:		boolean,
		playerLeftMoveDown:		boolean,
		playerRightMoveUp:		boolean,
		playerRightMoveDown:	boolean,
		startRound:				boolean,
	}

	invitedPlayers: Array<string>;
	ownerPlayerId: string;
}