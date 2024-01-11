import { ETheme } from "../settings"

export type IUser = {
	id			: number,
	name		: string,
	fullName	: string,
	login42		: string,
	avatar		: string,
	status		: UserTelemetryStatus,
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

export enum UserTelemetryStatus {
	Online = 'online',
	Offline = 'offline',
	InGame = 'ingame',
}

export type BackEndUser = {
	id:					number,
	display_name:		string,
	full_name:			string,
	login:				string,
	profile_picture:	string,
	status: 			UserTelemetryStatus,
};

export type BackUserSettings = {
	id: number,
	theme: ETheme,
	sound: boolean,
}