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
	NTFY				= 'ntfy',
	ERROR				= 'error',
}

export enum EClientEmits {
	StartMatchMaking	= 'matchmake',
	ReadyOrNot			= 'readyOrNot',
	Move				= 'move',
}

export enum ELobbyStatusClient {
	NOT_STARTED	= 'NOT_STARTED',
	ON_HOLD		= 'ON_HOLD',
	STARTING	= 'STARTING',
}