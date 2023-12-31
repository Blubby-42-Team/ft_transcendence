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
	const back = getBackPath();
	return useFetch(`${back}/history/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('history fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
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
	const back = getBackPath();
	return useFetch(`localhost:5000/history/game/save/${userId}`, {
		method: 'POST',
		body: {
			'opp_id': opp_id,
			'game_type': game_type,
			'player_score': player_score,
			'opp_score': opp_score,
			'date': date,
			'duration': duration
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user game save fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}
