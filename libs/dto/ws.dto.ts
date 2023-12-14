import { IsNotEmpty, IsJWT, isNotEmpty, IsString, IsNumber, IsPositive, IsBoolean} from 'class-validator'

export class AcknowledgmentWsDto<T> {

	constructor(status: 'ok' | 'error' | 'debug', message: T) {
		this.status = status;
		this.message = message;
	}

	@IsNotEmpty()
	@IsString()
	status: 'ok' | 'error' | 'debug';

	@IsString()
	message: T;
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

export class createRoomRequestDto extends WsRequestDto {
}

export class deleteGameRoomRequestDto extends WsRequestDto {
	@IsNotEmpty()
	@IsString()
	game_room_id: string;
}

export type GameRoomStatus = 'waiting' | 'playing' | 'finished';

export type joinGameResponse = {
	game_room_id: string;
};

export type createGameRoomResponse = {
	game_room_id: string;
};

export type deleteGameRoomResponse = 'ok';