import { IsNotEmpty, IsJWT, isNotEmpty, IsString, IsNumber, IsPositive, IsBoolean} from 'class-validator'

export class AcknowledgmentWsDto {

	constructor(status: 'ok' | 'error' | 'debug', message: string) {
		this.status = status;
		this.message = message;
	}

	@IsNotEmpty()
	@IsString()
	status: 'ok' | 'error' | 'debug';

	@IsString()
	message: string;
}

export class WsRequestDto {
	@IsNotEmpty()
	@IsJWT()
	auth_token: string;
}

export class CreateGameRoomRequestDto extends WsRequestDto {
}

export class GameRoomIdDto {

	constructor(id: string) {
		this.game_room_id = id;
	}
	
	@IsNotEmpty()
	@IsString()
	game_room_id: string;
}

export class JoinGameRoomRequestDto extends WsRequestDto {
	@IsNotEmpty()
	@IsString()
	game_room_id: string;
}

export class JoinGameRoomResponseDto extends AcknowledgmentWsDto {
	@IsNotEmpty()
	@IsJWT()
	game_room_token: string;

	game_room_id: GameRoomIdDto;
}

export class GameOptDto  {

	@IsNotEmpty()
	@IsJWT()
	auth_token: string;

	@IsNotEmpty()
	@IsJWT()
	game_room_token: string;

	@IsNotEmpty()
	@IsString()
	game_room_id: string;

	game_opt: {
		padSize: number,
		ballSize: number,
		numPlayer: 1 | 2 | 3 | 4,
		random: boolean,
		pointMax: number,
	}
}
