export type IUser = {
	id: number,
	name: string,
	fullName: string,
	login42: string,
	avatar: string,
};

export type IModeStats = {
	matchPlayed: number,
	ranking: number,
	mmr: number,
	winrate: number,
	averagePointPerGame: number,
};

export type IStats = {
	classic: IModeStats,
	random: IModeStats,
};

export type IHistory = {
	matchId: number,
	date: Date,
	duration: number,
	adversary: number,
	adversaryName: string,
	score: number,
	scoreAdv: number,

	// TODO That would be nice to have
	// players: Array<{
	// 	id: number,
	// 	name: string,
	// 	score: number,
	// }>,
};

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
		_primaryUser: 223,
		_users: {} as { [key: number]: IUser | null },
		_stats: {} as { [key: number]: IStats | null },
		_history: {} as { [key: number]: Array<IHistory> | null },
	}),
	getters: {
	},
	actions: {
		getPrimaryUser(){
			return this.getUser(this._primaryUser);
		},

		getUser(userId: number){
			if (this._users[userId] === undefined){
				this._users[userId] = null;
			}

			api.fetchUser(userId, (response) => {
				this._users[userId] = {
					id: userId,
					name: 'James',
					fullName: 'James Bond',
					login42: 'jbond',
					avatar: '/themes/anime/astolfo.jpg',
				};
			});

			return computed(() => {
				const user = this._users[userId];
				return (user !== null ? user : userPlaceHolder);
			});
		},

		getStats(userId: number){
			if (this._stats[userId] === undefined){
				this._stats[userId] = null;
			}

			api.fetchStats(userId, (response) => {
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
			
			return computed(() => {
				const stats = this._stats[userId];
				return (stats !== null ? stats : statsPlaceHolder);
			});
		},

		getHistory(userId: number){
			if (this._history[userId] === undefined){
				this._history[userId] = [];
			}

			api.fetchHistory(userId, (response) => {
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
			
			return computed(() => {
				const history = this._history[userId];
				return (history !== null && history.length ? history : []);
			});
		},
	},
})
