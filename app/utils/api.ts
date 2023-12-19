export default {
	fetchUser(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/game/room`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

	fetchStats(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/game/room`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('stats fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

	fetchHistory(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/game/room`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('history fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	}
}

