import { EGameType } from '#imports'

type TFetchHistoryResponse = {
	id: number,
	game_type: 'classic' | 'random',
	player_score: number,
	opp_score: number,
	date: string,
	duration: number,
	playerId: number,
	oppId: number
}[]

export function fetchHistory(
	userId: number,
	callback: (response: TFetchHistoryResponse) => void,
){
	return HTTP_GET(`/history/${userId}`, callback);
}

export function fetchSaveGame(
	userId: number,
	opp_id: number,
	game_type: EGameType,
	player_score: number,
	opp_score: number,
	date: Date,
	duration: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('POST', `/history/game/save/${userId}`, {
		opp_id: opp_id,
		game_type: game_type,
		player_score: player_score,
		opp_score: opp_score,
		date: date,
		duration: duration
	}, callback);
}
