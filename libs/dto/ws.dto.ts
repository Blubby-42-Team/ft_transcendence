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

export interface WS<T> {
	status: 'ok' | 'error' | 'debug',
	message: T,
};

export type GameResponse<T = undefined> = {
	status: ELobbyStatus,
	data: T,
}

export enum ESocketRooms {
	matchMaking	= 'matchMaking',
}

export enum ESocketClientEventName {
	joinMatchMaking		= 'joinMatchMaking',
	leaveMatchMaking	= 'leaveMatchMaking',
	readyToPlay 		= 'readyToPlay',
	joinParty			= 'joinParty',
}

export enum ESocketServerEventName {
	matchmakingStatus	= 'matchmakingStatus',
	matchState			= 'matchState',
	error				= 'error',
}

export enum ELobbyStatus {
	WaitingForPlayers	= 'WaitingForPlayers',
	AllPlayersReady		= 'AllPlayersReady',
}
