import { emitName, EClientEmits } from '#imports';

export class SocketClientGame extends SocketClient {
	constructor(
		private start_animation: (players: Array<number>) => void,
		private updateGameState: (state: gameStateType) => void,
		private ntfy: (msg: string) => void,
		private error: (msg: string) => void,
	) {
		if (process.server){
			return ;
		}
		super('game');
		this.listenForLobbyStatus();
		this.listenForGameStatus();
	}

	listenForLobbyStatus(){
		this.on(emitName.matchMakingStatus, (data: matchMakingWSResponse<unknown>) => {
			console.log(data)
			if (data.status === ELobbyStatus.START_GAME){
				console.log('Start game');
				// redirect to game
			}
			else if (data.status === ELobbyStatus.FOUND_AND_WAIT){
				this.start_animation(data.data as Array<number>);
			}
			else if (data.status === ELobbyStatus.WAITING_IN_QUEUE){
				console.log('Waiting in queue');
			}
			else if (data.status === ELobbyStatus.NTFY){
				this.ntfy(data.msg);
			}
			else if (data.status === ELobbyStatus.ERROR){
				this.error(data.msg);
			}
			else {
				console.log('Unknown status');
			}
			console.log(data.msg, data.status);
			console.log(data);
		});
	}

	listenForGameStatus(){
		this.on(emitName.stateGame, this.updateGameState);
	}

	joinMatchMaking(){
		this.emit(EClientEmits.StartMatchMaking, {});
	}

	cancelMatchMaking(){

	}

	readyOrNot(status: boolean){
		this.emit(EClientEmits.ReadyOrNot, {
			ready: status,
		});
	}

	move(dir: boolean, press: boolean){
		this.emit(EClientEmits.Move, {
			dir,
    		press,
		});
	}

	startRound(press: boolean){
		this.emit(EClientEmits.Move, {
			dir: false,
			press: false,
			launch: press,
		});
	}
};