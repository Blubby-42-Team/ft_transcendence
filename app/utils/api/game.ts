export function fetchCreateCustomLobby(
	userId: number,
	maxPoint: number,
    ballSize: number,
    padSize: number,
	callback: (lobbyId: string) => void,
){
	const back = getBackPath();
	return useFetch(`${back}/game`, {
		method: 'POST',
		body: {
			userId: userId,
			max_round: maxPoint,
			ball_size: ballSize,
			pad_size: padSize,
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('all chats fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}
