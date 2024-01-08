import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional} from 'class-validator'

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

export type GameResponse<T = undefined> = {
	status: ELobbyStatus,
	msg: string,
	data?: T,
}

export enum ESocketRooms {
	matchMaking	= 'matchMaking',
}

export enum ESocketEventName {
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
