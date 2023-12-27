export function fetchTest(
	userId: number,
	callback: (response: any) => void,
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/game/room`, {
		onResponse: ({ request, response, options }) => {
			callback(response);
			console.log('stats fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}
