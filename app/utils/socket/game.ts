import { ESocketServerEventName, ESocketClientEventName, ELobbyStatus } from '#imports';

export class SocketClientGame extends SocketClient {
	constructor(
		private start_animation: (players: Array<number>) => void,
		private updateGameState: (state: gameStateType) => void,
		// private ntfy: (msg: string) => void,
		private end_lobby: (msg: string) => void,
	) {
		if (process.server){
			return ;
		}
		super('game');
		this.listenForLobbyStatus();
		this.listenForGameStatus();
	}

	listenForLobbyStatus(){
		this.on(ESocketServerEventName.matchmakingStatus, (data: GameResponse<{
			msg: string,
			players?: Array<number>
		}>) => {
			if (data.status === ELobbyStatus.InQueue){
				console.log(data.data.msg);
			}
			else if (data.status === ELobbyStatus.AllPlayersReady){
				console.log(data.data.msg);
				// redirect to game
			}
			else if (data.status === ELobbyStatus.WaitingForPlayers){
				console.log(data.data.msg);
				this.start_animation(data.data.players as Array<number>);
			}
			else if (data.status === ELobbyStatus.LobbyEnded){
				this.end_lobby(data.data.msg);
			}
			else {
				console.log('Unknown status');
			}
			console.log(data.data, data.status);
		});
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