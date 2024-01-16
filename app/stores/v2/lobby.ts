import { SocketClientGame, ELobbyStatus } from "#imports"
import { gameState4PlayersDefault } from '../../../libs/game/getNewStateWithGameSettings'

export const useLobbyStore = defineStore('lobby', {
	state: () => ({
		_socket: null as SocketClientGame | null,
		_status: ELobbyStatus.NoLobby,
		_otherPlayer: 0 as number,
		_gameState: gameState4PlayersDefault as gameStateType,
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
				(players) => {
					const { primaryUser } = useUserStore();
					this._otherPlayer = players.find((player) => player !== primaryUser.value.id) ?? 0;
					this._status = ELobbyStatus.AllPlayersReady;
					setTimeout(() => {
						if (this._socket){
							this._socket.readyOrNot(true);
							navigateTo('/game/lobby');
						}
					}, 5000);
				},
				(state) => {
					this._gameState = state;
				},
				// (msg) => {
				// 	console.log('ntfy', msg);
				// },
				(msg) => {
					this._status = ELobbyStatus.NoLobby;
					const { addNotif } = useNotifStore();
					addNotif(msg);
					navigateTo('/');
				},
			);
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
	},
})
