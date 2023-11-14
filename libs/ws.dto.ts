import { IsNotEmpty, IsJWT, isNotEmpty, IsString, IsNumber, IsPositive} from 'class-validator'

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
	@IsNotEmpty()
	@IsString()
	game_room_id: string;
}

export class JoinGameRoomRequestDto extends WsRequestDto {
	//TODO check if dto will validate GAmeRoomIdDto wiouth decorator
	game_room_id: string;
}

export class JoinGameRoomResponseDto extends AcknowledgmentWsDto {
	//TODO create dto
	@IsNotEmpty()
	@IsJWT()
	game_room_token: string;

	game_room_id: GameRoomIdDto;
}

export class GameOptDto /* //TODO extends with auth class (auth and game_auth)*/ {
	// TODO extend 
	// @IsNotEmpty()
	// @IsJWT()
	// auth_token: string;
	// @IsNotEmpty()
	// @IsJWT()
	// game_room_token: string;

	game_room_id: string;


	//TODO @mkoyamba: add game options
}