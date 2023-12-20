export enum EGameType {
	Classic = 'classic',
	Random = 'random',
	Custom = 'custom',
}

export default {
	fetchHistory(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/history/${userId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('history fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchSaveGame(
		userId: number,
		opp_id: number,
        game_type: EGameType,
        player_score: number,
        opp_score: number,
        date: Date,
        duration: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/history/game/save/${userId}`, {
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
				callback(response);
				console.log('user game save fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		  })
	},
}