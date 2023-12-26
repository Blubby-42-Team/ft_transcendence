// export async function fetchUser(
// 	userId: number,
// 	callback: (response: any) => void,
// ){
// 	const config = useRuntimeConfig()
// 	return useFetch(`${config.public.back.uri}/game/room`, {
// 		onResponse: ({ request, response, options }) => {
// 			callback(response);
// 			console.log('user fetched');
// 		},
// 		onRequestError: ({ request, error, options }) => {
// 			console.warn('error', error);
// 		},
// 	})
// }

// export function fetchStats(
// 	userId: number,
// 	callback: (response: any) => void,
// ){
// 	const config = useRuntimeConfig()
// 	return useFetch(`${config.public.back.uri}/game/room`, {
// 		onResponse: ({ request, response, options }) => {
// 			callback(response);
// 			console.log('stats fetched');
// 		},
// 		onRequestError: ({ request, error, options }) => {
// 			console.warn('error', error);
// 		},
// 	})
// }

// export function fetchHistory(
// 	userId: number,
// 	callback: (response: any) => void,
// ){
// 	const config = useRuntimeConfig()
// 	return useFetch(`${config.public.back.uri}/game/room`, {
// 		onResponse: ({ request, response, options }) => {
// 			callback(response);
// 			console.log('history fetched');
// 		},
// 		onRequestError: ({ request, error, options }) => {
// 			console.warn('error', error);
// 		},
// 	})
// }

