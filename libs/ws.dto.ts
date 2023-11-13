import { IsNotEmpty, IsJWT, isNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator'

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

export class JoinGameRoomRequestDto extends WsRequestDto {
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	game_room_id: number;
}

export class JoinGameRoomResponseDto extends AcknowledgmentWsDto {
	@IsNotEmpty()
	@IsJWT()
	game_room_token: string;

	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	game_room_id: number;
}