export interface ITournament {
	id:				string,
	name:			string,
	attendance:		number,
	maxAttendance:	number,
}

export const useTournamentListStore = defineStore('tournamentList', {
	state: (): {
		_tournaments: Array<ITournament>;
	} => ({
		_tournaments: [
			{	id: "1",	name: 'Pong Super Cup',				attendance: 4,		maxAttendance: 8	},
			{	id: "2",	name: 'EPP Pro League',				attendance: 2,		maxAttendance: 8	},
			{	id: "3",	name: 'EPP Masters Katowice',		attendance: 1,		maxAttendance: 4	},
			{	id: "4",	name: 'FACEPONG Masters',			attendance: 0,		maxAttendance: 8	},
			{	id: "5",	name: 'Pong Champions \'23',		attendance: 0,		maxAttendance: 4	},
			{	id: "6",	name: 'Pong Challengers \'23',		attendance: 0,		maxAttendance: 4	},
			{	id: "7",	name: 'Ping Pong Internationale',	attendance: 0,		maxAttendance: 4	},
			{	id: "8",	name: 'Olympic Pong Games',			attendance: 0,		maxAttendance: 8	},
			{	id: "9",	name: 'Pong World Cup',				attendance: 0,		maxAttendance: 8	},
		]
	}),
	getters: {
		tournaments: (state): Array<ITournament> => state._tournaments,
	},
	actions: {
		add(id: string, name: string, attendance: number, maxAttendance: number) {
			if (this._tournaments.find((el) => el.id == id) === undefined){
				let newElem: ITournament = { id, name, attendance, maxAttendance };
				this._tournaments.push(newElem);
			}
			else {
				console.log("Could not add new element");
			}
		},
		del(id: string) {
			console.log(id, this._tournaments, this._tournaments.find((el) => el.id === id))
			if (this._tournaments.find((el) => el.id === id) !== undefined){
				this._tournaments = this._tournaments.filter((el) => el.id !== id)
			}
			else {
				console.log("Could not delete element");
			}
		},
	},
})
