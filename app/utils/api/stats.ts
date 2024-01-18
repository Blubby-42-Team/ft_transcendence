export function fetchStats(
	userId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_GET(`/stats/${userId}`, callback);
}

export function fetchClassicMatchEnd(
	userId: number,
	points_won: number,
	points_lost: number,
	opp_mmr: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/stats/end/match/classic/${userId}`, {
		points_won: points_won,
		points_lost: points_lost,
		opp_mmr: opp_mmr
	}, callback);
}

export function fetchRandomMatchEnd(
	userId: number,
	points_won: number,
	points_lost: number,
	opp_mmr: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/stats/end/match/random/${userId}`, {
		points_won: points_won,
		points_lost: points_lost,
		opp_mmr: opp_mmr
	}, callback);
}
