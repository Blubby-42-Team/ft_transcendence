export default {
	fetchUser(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch('http://localhost:3001/game/room', {
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
		return useFetch('http://localhost:3001/game/room', {
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
		return useFetch('http://localhost:3001/game/room', {
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

