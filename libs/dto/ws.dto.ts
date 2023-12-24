import { IsNotEmpty, IsJWT, isNotEmpty, IsString, IsNumber, IsPositive, IsBoolean} from 'class-validator'
import { Min } from 'class-validator';
import { DisconnectReason } from 'socket.io';

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
}

export class addPlayerToWhiteListRequestDto extends WsRequestDto {
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	user_to_white_list: number;
}

export class removePlayerFromWhiteListRequestDto extends WsRequestDto {
	@IsNotEmpty()
	@IsString()
	user_id: number;
}

export type GameRoomStatus = 'waiting' | 'playing' | 'finished';

export type joinGameResponse = 'ok';

export type createGameRoomResponse = {
	game_room_id: string;
};

export type deleteGameRoomResponse = 'ok';
export type addOrRemovePlayerToWhiteListResponse = 'ok';

export type disconnectClientFromTheLobbyResponse = {
	reason: 'KickByOwner' | 'DuplicateConnection' | 'KickByAdmin',
	msg: string,
}