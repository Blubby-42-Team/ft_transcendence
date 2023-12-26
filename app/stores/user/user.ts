const userPlaceHolder = {
	id: 0,
	name: '...',
	fullName: '...',
	login42: '...',
	avatar: '/amogus.png',
};

const statsPlaceHolder: IStats = {
	classic: {
		matchPlayed: 0,
		ranking: 0,
		mmr: 0,
		winrate: 0,
		averagePointPerGame: 0,
	},
	random: {
		matchPlayed: 0,
		ranking: 0,
		mmr: 0,
		winrate: 0,
		averagePointPerGame: 0,
	},
};

export const useUserStore = defineStore('user', {
	state: () => ({
		_primaryUser: 42,
		_users: {} as { [key: number]: IUser | undefined },
		_stats: {} as { [key: number]: IStats | undefined },
		_history: {} as { [key: number]: Array<IHistory> | undefined },
	}),
	getters: {
		primaryUser: (state) => computed(() => {
			const user = state._users[state._primaryUser];
			return (user !== undefined ? user : userPlaceHolder);
		}),
		getUser: (state) => (userId: number) => computed(() => {
			const user = state._users[userId];
			return (user !== undefined ? user : userPlaceHolder);
		}),
		getStat: (state) => (userId: number) => computed(() => {
			const stats = state._stats[userId];
			return (stats !== undefined ? stats : statsPlaceHolder);
		}),
		getHistory: (state) => (userId: number) => computed(() => {
			const history = state._history[userId];
			return (history !== undefined && history.length ? history : []);
		}),
	},
	actions: {
		async fetchPrimaryUser(){
			return this.fetchUser(this._primaryUser);
		},
		async fetchUser(userId: number){
			if (userId === 0){
				return;
			}
			return api.fetchUser(userId, (response) => {
				this._users[userId] = {
					id: userId,
					name: 'James',
					fullName: 'James Bond',
					login42: 'jbond',
					avatar: '/themes/anime/astolfo.jpg',
				};
			});
		},
		async fetchStat(userId: number){
			if (userId === 0){
				return;
			}
			return api.fetchStats(userId, (response) => {
				this._stats[userId] = {
					classic: {
						matchPlayed: Math.floor(Math.random() * 100),
						ranking: Math.floor(Math.random() * 100),
						mmr: Math.floor(Math.random() * 1000),
						winrate: Math.floor(Math.random() * 100),
						averagePointPerGame: Math.floor(Math.random() * 100),
					},
					random: {
						matchPlayed: Math.floor(Math.random() * 100),
						ranking: Math.floor(Math.random() * 100),
						mmr: Math.floor(Math.random() * 1000),
						winrate: Math.floor(Math.random() * 100),
						averagePointPerGame: Math.floor(Math.random() * 100),
					},
				};
			});
		},
		async fetchHistory(userId: number){
			if (userId === 0){
				return;
			}
			return await api.fetchHistory(userId, (response) => {
				console.log('fetchHistory', userId);
				if (this._history[userId] === undefined){
					this._history[userId] = [];
				}
				for (let i = 0; i < 10; i++){
					this._history[userId]?.push({
						matchId: 45,
						date: new Date,
						duration: 100,
						adversary: 3,
						adversaryName: 'Jameskii',
						score: 10,
						scoreAdv: Math.floor(Math.random() * 10),
					})
				}
			});
		},
	},
})
