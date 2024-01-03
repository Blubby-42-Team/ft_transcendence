export function fetchStats(
	userId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/stats/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('stats fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchClassicMatchEnd(
	userId: number,
	points_won: number,
	points_lost: number,
	opp_mmr: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/stats/end/match/classic/${userId}`, {
		method: 'PATCH',
		body: {
			'points_won': points_won,
			'points_lost': points_lost,
			'opp_mmr': opp_mmr
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user classic game end fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchRandomMatchEnd(
	userId: number,
	points_won: number,
	points_lost: number,
	opp_mmr: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/stats/end/match/random/${userId}`, {
		method: 'PATCH',
		body: {
			'points_won': points_won,
			'points_lost': points_lost,
			'opp_mmr': opp_mmr
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user random game end fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}
