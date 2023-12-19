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

type gameStoreType = {
	_users: { [key: number]: IUser | null },
	_stats: { [key: number]: IStats | null },
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
	state: (): gameStoreType => ({
		_users: {},
		_stats: {},
	}),
	getters: {
	},
	actions: {
		getUser(id: number){
			if (this._users[id] === undefined){
				this._users[id] = null;
			}
			// TODO: fetch user from server
			this.fetchUser(id);

			return computed(() => {
				const user = this._users[id];
				return (user !== null ? user : userPlaceHolder);
			});
		},

		getStats(userId: number){
			if (this._stats[userId] === undefined){
				this._stats[userId] = null;
			}
			// TODO: fetch user from server
			this.fetchStats(userId);

			return computed(() => {
				const stats = this._stats[userId];
				return (stats !== null ? stats : statsPlaceHolder);
			});
		},


		fetchUser(id: number){
			return useFetch('http://localhost:3001', {
				onResponse: ({ request, response, options }) => {
					this._users[id] = {
						id: id,
						name: 'James',
						fullName: 'James Bond',
						login42: 'jbond',
						avatar: '/amogus.png',
					};
					console.log('user fetched');
				},
			})
		},

		fetchStats(userId: number){
			return useFetch('http://localhost:3001', {
				onResponse: ({ request, response, options }) => {
					console.log(response._data)
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
					console.log('stats fetched');
				},
			})
		},
	},
})
