export function HTTP_GET<Output>(
	url: string,
	callback: (response: Output) => void = () => {},
){
	const back = getBackPath();
	return useFetch<Output>(`${back}${url}`, {
		credentials: 'include',
		onResponse: ({ request, response, options }) => {
			callback(response._data);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function HTTP_EDIT<Body extends object, Output>(
	method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
	url: string,
	body: Body,
	callback: (response: Output) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}${url}`, {
		method: method,
		body: body,
		credentials: 'include',
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user whitelist fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}
