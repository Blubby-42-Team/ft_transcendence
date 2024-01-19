import { SocketClientGame, ELobbyStatus, EGameMode } from "#imports"
import { gameState2PlayersDefault } from '../../../libs/game/getNewStateWithGameSettings'

export const useLobbyStore = defineStore('lobby', {
	state: () => ({
		_socket: null as SocketClientGame | null,
		_status: ELobbyStatus.NoLobby,
		_otherPlayer: 0 as number,
		_gameState: gameState2PlayersDefault as gameStateType,
		_behaviour: EGameMode.Classic as EGameMode,
	}),
	getters: {
		otherPlayer:	(state) => state._otherPlayer,
		status:			(state) => state._status,
		gameState:		(state) => state._gameState,
	},
	actions: {
		setup(){
			if (this._socket && this._socket.socket?.connected){
				return ;
			}
			this._socket = new SocketClientGame(
				(state) => {
					this._gameState = state;
				},
				(response) => {
					this.onLobbyStatusUpdate(response);
				},
			);
		},

		changeBehaviour(behaviour: EGameMode){
			this._behaviour = behaviour;
		},

		onLobbyStatusUpdate(response: GameResponse<{ msg: string, players?: Array<number>}>){
			if (response.status === ELobbyStatus.InQueue){
				// console.log(response.data.msg);
			}

			else if (response.status === ELobbyStatus.AllPlayersReady){
				// console.log(response.data.msg);
				navigateTo('/game/lobby');
			}

			else if (response.status === ELobbyStatus.WaitingForPlayers){
				const { primaryUser } = useUserStore();
				if (this._behaviour === EGameMode.Classic){
					this._otherPlayer = (response.data.players as Array<number>).find((player) => player !== primaryUser.value.id) ?? 0;
					this._status = ELobbyStatus.AllPlayersReady;
					setTimeout(() => {
						if (this._socket){
							this._socket.readyOrNot(true);
						}
					}, 5000);
				}
				else if (this._behaviour === EGameMode.Custom){
					this._otherPlayer = (response.data.players as Array<number>).find((player) => player !== primaryUser.value.id) ?? 0;
					if (this._otherPlayer){
						this._status = ELobbyStatus.AllPlayersReady;
						setTimeout(() => {
							if (this._socket){
								this._socket.readyOrNot(true);
							}
						}, 5000);
					}
				}

			}

			else if (response.status === ELobbyStatus.LobbyEnded){
				this._status = ELobbyStatus.NoLobby;
				const { addNotif } = useNotifStore();
				addNotif(response.data.msg);
				navigateTo('/');
			}

			else {
				// console.log('Unknown status');
			}
			
			// console.log(response.data, response.status);
		},

		reset(){
			this._status = ELobbyStatus.NoLobby;
			this._otherPlayer = 0;
		},
		startMatchMaking(){
			if (this._socket){
				this._status = ELobbyStatus.InQueue;
				this._socket.joinMatchMaking();
			}
		},
		cancelMatchMaking(){
			if (this._socket){
				this._status = ELobbyStatus.NoLobby;
				this._socket.cancelMatchMaking();
			}
		},
		move(dir: boolean, press: boolean){
			if (this._socket){
				this._socket.move(dir, press);
			}
		},
		startRound(press: boolean){
			if (this._socket){
				this._socket.startRound(press);
			}
		},
		endMatch(){
			if (this._socket){
				this._socket.leaveMatch();
			}
		},
		joinParty(lobbyId: string){
			if (this._socket){
				this._socket.joinParty(lobbyId);
			}
		},
		inviteToParty(userId: number){
			if (this._socket){
				this._socket.inviteToParty(userId);
			}
		}
	},
})
