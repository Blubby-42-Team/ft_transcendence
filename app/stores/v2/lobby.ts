import { SocketClientGame, ELobbyStatusClient } from "#imports"

export const useLobbyStore = defineStore('lobby', {
	state: () => ({
		_socket: null as SocketClientGame | null,
		_status: ELobbyStatusClient.NOT_STARTED,
		_otherPlayer: 0 as number,
		_gameState: {
			status:				gameStatusType.ON_HOLD,
			aispeed:			0.1,
			playerspeed:		0.5,
			gameArea:			{	center: {	x: 0,	y: 0,		},	height_d_2: 25,		width_d_2: 35,	},
			ball:				{	center: {	x: 0,	y: 0,		},	height_d_2: 1,		width_d_2: 1,	speed: 0,		acceleration: 0, direction: Math.PI / 4	},
			player_left:		{	center: {	x: -25,	y: 0,		},	height_d_2: 10,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
			player_right:		{	center: {	x: 25,	y: 0,		},	height_d_2: 5,		width_d_2: 1,	active: true,	eleminated: false,	isBot: false,	score: 0	},
			player_top:			{	active: false,	},
			player_bottom:		{	active: false,	},
			obstacles: {
				player2Bottom:	{	center: {	x: 0,	y: 26 ,	},	height_d_2: 1,	width_d_2: 35,	hidden: false	},
				player2Top:		{	center: {	x: 0,	y: -26,	},	height_d_2: 1,	width_d_2: 35,	hidden: false	},
				
			}
		} as gameStateType,
	}),
	getters: {
		otherPlayer:	(state) => state._otherPlayer,
		status:			(state) => state._status,
		gameState:		(state) => state._gameState,
	},
	actions: {
		setup(){
			this._socket = new SocketClientGame(
				(players) => {
					const { primaryUser } = useUserStore();
					this._otherPlayer = players.find((player) => player !== primaryUser.value.id) ?? 0;
					this._status = ELobbyStatusClient.STARTING;
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
