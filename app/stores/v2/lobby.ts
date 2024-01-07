import { SocketClientGame, ELobbyStatusClient } from "#imports"

export const useLobbyStore = defineStore('lobby', {
	state: () => ({
		_socket: null as SocketClientGame | null,
		_status: ELobbyStatusClient.NOT_STARTED,
		_otherPlayer: 0 as number,
	}),
	getters: {
		otherPlayer:	(state) => state._otherPlayer,
		status:			(state) => state._status,
	},
	actions: {
		setup(){
			this._socket = new SocketClientGame(
				(players) => {
					console.log(players)
					const { primaryUser } = useUserStore();
					this._otherPlayer = players.find((player) => player !== primaryUser.value.id) ?? 0;
					this._status = ELobbyStatusClient.STARTING;
					setTimeout(() => {
						if (this._socket){
							this._socket.readyOrNot(true);
						}
					}, 5000);
				},
				(msg) => {
					console.log('ntfy', msg);
				},
				(msg) => {
					const { addNotif } = useNotifStore();
					addNotif(msg);
					navigateTo('/');
				},
			);
		},
		reset(){
			this._status = ELobbyStatusClient.NOT_STARTED;
			this._otherPlayer = 0;
		},
		startMatchMaking(){
			if (this._socket){
				this._status = ELobbyStatusClient.ON_HOLD;
				this._socket.joinMatchMaking();
			}
		},
		cancelMatchMaking(){
			if (this._socket){
				this._status = ELobbyStatusClient.NOT_STARTED;
				// this._socket.readyOrNot(false);
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
	},
})
