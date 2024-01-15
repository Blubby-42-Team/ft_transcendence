import { IUser, IShortUser, IStats, IHistory, SocketClientUser, UserTelemetryStatus } from "#imports"

const userPlaceHolder: IUser = {
	id:       0,
	name:     '...',
	fullName: '...',
	login42:  '...',
	avatar:   '/pp.png',
	status:   UserTelemetryStatus.Offline,
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
	avatar: '/pp.png',
};

export const useUserStore = defineStore('user', {
	state: () => ({
		_primaryUser: 0,
		_shortUsers: {} as { [key: number]: IShortUser | undefined },
		_users: {} as { [key: number]: IUser | undefined },
		_stats: {} as { [key: number]: IStats | undefined },
		_history: {} as { [key: number]: Array<IHistory> | undefined },
		_friends: {} as { [key: number]: Array<number> | undefined },
		_socket: null as SocketClientUser | null,
	}),
	getters: {
		primaryUser:  (state) => state._users?.[state._primaryUser] ?? userPlaceHolder,
		getUser:      (state) => (userId: number) => state._users?.[userId] ?? userPlaceHolder,
		getShortUser: (state) => (userId: number) => state._shortUsers?.[userId] ?? shortUserPlaceHolder,
		getStat:      (state) => (userId: number) => state._stats?.[userId] ?? statsPlaceHolder,
		getHistory:   (state) => (userId: number) => state._history?.[userId] ?? [],
		getFriends:   (state) => (userId: number) => state._friends?.[userId] ?? [],
	},
	actions: {
		setup(){
			if (this._socket && this._socket.socket?.connected){
				return ;
			}
			this._socket = new SocketClientUser();

			for (const user of Object.values(this._users)){
				if (!user){
					return ;
				}
				this._socket.listenForPlayer(user.id, (data) => {
					user.status = data;
				});
				// this._socket.askForPlayerStatus(user.id);
			}
		},

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
				this._users[userId] = {
					id:       response.id,
					name:     response.display_name,
					fullName: response.full_name,
					login42:  response.login,
					avatar:   response.profile_picture,
					status:   response.status,
				};
				if (process.client && this._socket){
					this._socket.listenForPlayer(userId, (newStatus) => {
						this._users[userId]!.status = newStatus;
					});
				}
			});
		},

		async getUserByName(userName: string){
			const { data } = await fetchUserByName(userName, (response) => {
				this._users[response.id] = {
					id:       response.id,
					name:     response.display_name,
					fullName: response.full_name,
					login42:  response.login,
					avatar:   response.profile_picture,
					status:   response.status,
				};
				if (process.client && this._socket){
					this._socket.listenForPlayer(response.id, (newStatus) => {
						this._users[response.id]!.status = newStatus;
					});
				}
			});
			return data.value?.id ?? 0;
		},
		
		async fetchStat(userId: number){
			if (userId === 0){
				return;
			}
			return fetchStats(userId, (response) => {
				this._stats[userId] = {
					classic: {
						matchPlayed: 			response.classic_match_played,
						ranking: 				response.classic_ranking,
						mmr: 					response.classic_mmr,
						winrate: 				response.classic_winrate,
						averagePointPerGame:	response.classic_average_point,
					},
					random: {
						matchPlayed: 			response.random_match_played,
						ranking: 				response.random_ranking,
						mmr: 					response.random_mmr,
						winrate: 				response.random_winrate,
						averagePointPerGame: 	response.random_average_point,
					},
				};
			});
		},

		async fetchHistory(userId: number){
			if (userId === 0){
				return;
			}
			return await fetchHistory(userId, (response) => {
				this._history[userId] = response.map(el => ({
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
				this.updateShortUser(response.map((el) => ({
					id: el.id,
					name: el.display_name,
					avatar: el.profile_picture,
				})));
				this._friends[userId] = response.map((el) => el.id);
			});
		},

		async removeFriend(userId: number){
			if (userId === 0){
				return;
			}
			const { data } = await fetchUserFriendDelete(this._primaryUser, userId);
			await this.fetchFriends(this._primaryUser);
			return data.value;
		},

		changeStatus(status: UserTelemetryStatus){
			if (this._socket){
				this._socket.status = status;
			}
		}
	},
})
