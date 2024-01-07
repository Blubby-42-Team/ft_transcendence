import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional} from 'class-validator'
import { Min } from 'class-validator';

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

export class MatchMakingRequestDto extends WsRequestDto {
	@IsOptional()
	party_id: string | undefined;
}

export class ReadyOrNotRequestDto extends WsRequestDto {
	@IsNotEmpty()
	@IsBoolean()
	ready: boolean;
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

export class moveRequestDto extends WsRequestDto {
	@IsNotEmpty()
	dir: boolean;

	@IsNotEmpty()
	press: boolean;

	@IsOptional()
	launch: boolean | undefined;
}


export type joinGameResponse = 'ok';
export type readyOrNotResponse = 'ok';
export type moveResponse = 'ok';

export type createGameRoomResponse = {
	game_room_id: string;
};

export type deleteGameRoomWSResponse = 'ok';
export type addOrRemovePlayerToWhiteListWSResponse = 'ok';

export type matchMakingWSResponse<T = undefined> = {
	status: ELobbyStatus,
	msg: string,
	data: T,
}

export enum emitName {
	matchMakingStatus	= 'matchMakingStatus',
	stateGame			= 'stateGame',
}

export enum ELobbyStatus {
	WAITING_IN_QUEUE	= 'waitingInQueue',
	FOUND_AND_WAIT		= 'foundAndWait',
	START_GAME			= 'startGame',
	STOP_GAME			= 'stopGame',
	NTFY				= 'ntfy',
	ERROR				= 'error',
}
