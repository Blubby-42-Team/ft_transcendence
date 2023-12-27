export type IUser = {
	id			: number,
	name		: string,
	fullName	: string,
	login42		: string,
	avatar		: string,
};

export interface IShortUser {
	id		: number,
	name	: string,
	avatar	: string,
};

export type IModeStats = {
	matchPlayed			: number,
	ranking				: number,
	mmr					: number,
	winrate				: number,
	averagePointPerGame	: number,
};

export type IStats = {
	classic	: IModeStats,
	random	: IModeStats,
};

export type IHistory = {
	matchId			: number,
	date			: Date,
	duration		: number,
	adversary		: number,
	score			: number,
	scoreAdv		: number,

	// TODO That would be nice to have
	// players: Array<{
	// 	id: number,
	// 	name: string,
	// 	score: number,
	// }>,
};