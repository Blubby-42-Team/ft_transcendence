export default {
	fetchUser(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch('http://localhost:3001', {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user fetched');
			},
		})
	},
	fetchStats(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch('http://localhost:3001', {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('stats fetched');
			},
		})
	},
}

