import { ESocketServerEventName, ESocketClientEventName, ELobbyStatus } from '#imports';

export class SocketClientGame extends SocketClient {
	constructor(
		private updateGameState: (state: gameStateType) => void,
		private lobbyBehavior: (response: GameResponse<{ msg: string, players?: Array<number>}>) => void,
	) {
		if (process.server){
			return ;
		}
		super('game');
		this.listenForLobbyStatus();
		this.listenForGameStatus();
	}

	listenForLobbyStatus(){
		this.on(ESocketServerEventName.matchmakingStatus, this.lobbyBehavior);
	}

	listenForGameStatus(){
		this.on(ESocketServerEventName.matchState, this.updateGameState);
	}

	joinMatchMaking(){
		this.emit(ESocketClientEventName.joinMatchMaking, {});
	}

	cancelMatchMaking(){
		this.emit(ESocketClientEventName.leaveMatchMaking, {});
	}

	readyOrNot(status: boolean){
		this.emit(ESocketClientEventName.readyToPlay, {
			ready: status,
		});
	}

	move(direction: boolean, press: boolean){
		this.emit(ESocketClientEventName.movePlayer, {
			direction,
    		press,
		});
	}

	startRound(press: boolean){
		this.emit(ESocketClientEventName.startRound, {
			press,
		});
	}

	leaveMatch(){
		this.emit(ESocketClientEventName.leaveGame, {});
	}

	joinParty(lobbyId: string){
		this.emit(ESocketClientEventName.joinParty, {
			roomId: lobbyId,
		});
	}

	inviteToParty(userId: number){
		this.emit(ESocketClientEventName.inviteToParty, {
			userId: userId,
		});
	}
};