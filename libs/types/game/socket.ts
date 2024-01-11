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

	movePlayer			= 'movePlayer',
	startRound			= 'startRound',
}

export enum ESocketServerEventName {
	matchmakingStatus	= 'matchmakingStatus',
	matchState			= 'matchState',
	error				= 'error',
}

export enum ELobbyStatus {
	NoLobby				= 'NoLobby',
	InQueue				= 'InQueue',
	WaitingForPlayers	= 'WaitingForPlayers',
	AllPlayersReady		= 'AllPlayersReady',
	LobbyEnded			= 'LobbyEnded',
}

export enum ESocketActionType {
	Primary		= 'Primary',
	WeakPrimary	= 'WeakPrimary',
	Secondary	= 'Secondary',
}