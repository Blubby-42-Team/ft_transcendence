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
	@IsString()
	game_room_id: GameRoomIdDto;
}
