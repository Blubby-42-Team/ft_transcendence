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
		_primaryUser: 0,
		_shortUsers: {} as { [key: number]: IShortUser | undefined },
		_users: {} as { [key: number]: IUser | undefined },
		_stats: {} as { [key: number]: IStats | undefined },
		_history: {} as { [key: number]: Array<IHistory> | undefined },
		_friends: {} as { [key: number]: Array<IShortUser> | undefined },
	}),
	getters: {
		primaryUser:  (state) => computed(() => state._users?.[state._primaryUser] ?? userPlaceHolder),
		getUser:      (state) => (userId: number) => computed(() => state._users?.[userId] ?? userPlaceHolder),
		getShortUser: (state) => (userId: number) => computed(() => state._shortUsers?.[userId] ?? shortUserPlaceHolder),
		getStat:      (state) => (userId: number) => computed(() => state._stats?.[userId] ?? statsPlaceHolder),
		getHistory:   (state) => (userId: number) => computed(() => state._history?.[userId] ?? []),
		getFriends:   (state) => (userId: number) => computed(() => state._friends?.[userId] ?? []),
	},
	actions: {
		async updatePrimaryUser(userId: number){
			this._primaryUser = userId;
		},

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
			return fetchUser(userId, (response) => {
				const data = response._data;
				this._users[userId] = {
					id: data.id,
					name: data.display_name,
					fullName: data.full_name,
					login42: data.login,
					avatar: data.profile_picture,
				};
			}
			);
		},
		
		async fetchStat(userId: number){
			if (userId === 0){
				return;
			}
			return fetchStats(userId, (response) => {
				const data = response._data;
				this._stats[userId] = {
					classic: {
						matchPlayed: 			data.classic_match_played,
						ranking: 				data.classic_ranking,
						mmr: 					data.classic_mmr,
						winrate: 				data.classic_winrate,
						averagePointPerGame:	data.classic_average_point,
					},
					random: {
						matchPlayed: 			data.random_match_played,
						ranking: 				data.random_ranking,
						mmr: 					data.random_mmr,
						winrate: 				data.random_winrate,
						averagePointPerGame: 	data.random_average_point,
					},
				};
			});
		},

		async fetchHistory(userId: number){
			if (userId === 0){
				return;
			}
			return await fetchHistory(userId, (response) => {
				const data = response._data;
				this._history[userId] = data.map((el: {
					id: number,
					game_type: 'classic' | 'random',
					player_score: number,
					opp_score: number,
					date: string,
					duration: number,
					playerId: number,
					oppId: number
				}) => ({
					matchId: 		el.id,
					date: 			new Date(el.date),
					duration: 		el.duration,
					adversary: 		el.playerId === userId ? el.oppId : el.playerId,
					score: 			el.playerId === userId ? el.player_score : el.opp_score,
					scoreAdv: 		el.playerId === userId ? el.opp_score : el.player_score,
				}));
			});
		},

		async fetchFriends(userId: number){
			if (userId === 0){
				return;
			}
			return await fetchUserFriends(userId, (response) => {
				const data = response._data;
				console.log('res', data);
			});
		},
	},
})
