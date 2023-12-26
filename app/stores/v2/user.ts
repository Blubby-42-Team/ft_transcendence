import { IUser, IShortUser, IStats, IHistory } from "#imports"

const userPlaceHolder: IUser = {
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

const shortUserPlaceHolder: IShortUser = {
	id: 0,
	name: '...',
	avatar: '/amogus.png',
};

export const useUserStore = defineStore('user', {
	state: () => ({
		_primaryUser: 42,
		_shortUsers: {} as { [key: number]: IShortUser | undefined },
		_users: {} as { [key: number]: IUser | undefined },
		_stats: {} as { [key: number]: IStats | undefined },
		_history: {} as { [key: number]: Array<IHistory> | undefined },
	}),
	getters: {
		primaryUser:	(state) => computed(() => state._users?.[state._primaryUser] ?? userPlaceHolder),
		getUser:		(state) => (userId: number) => computed(() => state._users?.[userId] ?? userPlaceHolder),
		getShortUser:	(state) => (userId: number) => computed(() => state._shortUsers?.[userId] ?? shortUserPlaceHolder),
		getStat:		(state) => (userId: number) => computed(() => state._stats?.[userId] ?? statsPlaceHolder),
		getHistory:		(state) => (userId: number) => computed(() => state._history?.[userId] ?? []),
	},
	actions: {
		async updateShortUser(users: Array<IShortUser>){
			for (const user of users){
				this._shortUsers[user.id] = user;
			}
		},
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
