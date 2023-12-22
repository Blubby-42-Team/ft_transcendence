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

export const useUserStore = defineStore('user', () => {
	let primaryUser = 223;
	let users = {} as { [key: number]: IUser | null };
	let stats = {} as { [key: number]: IStats | null };
	let history = {} as { [key: number]: Array<IHistory> | null };

	function getPrimaryUser(){
		return getUser(primaryUser);
	}

	function getUser(userId: number){
		if (users[userId] === undefined){
			users[userId] = null;
		}

		api.fetchUser(userId, (response) => {
			users[userId] = {
				id: userId,
				name: 'James',
				fullName: 'James Bond',
				login42: 'jbond',
				avatar: '/themes/anime/astolfo.jpg',
			};
		});

		return computed(() => {
			const user = users[userId];
			return (user !== null ? user : userPlaceHolder);
		});
	}

	function getStats(userId: number){
		if (stats[userId] === undefined){
			stats[userId] = null;
		}

		api.fetchStats(userId, (response) => {
			stats[userId] = {
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
			const newStats = stats[userId];
			return (newStats !== null ? newStats : statsPlaceHolder);
		});
	}

	function getHistory(userId: number){
		if (history[userId] === undefined){
			history[userId] = [];
		}

		api.fetchHistory(userId, (response) => {
			for (let i = 0; i < 10; i++){
				history[userId]?.push({
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
			const newHistory = history[userId];
			return (newHistory !== null && newHistory.length ? history : []);
		});
	}

	return {
		getPrimaryUser,
		getUser,
		getStats,
		getHistory,
	}
})
