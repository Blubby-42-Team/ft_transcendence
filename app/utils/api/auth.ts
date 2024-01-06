type authResponse = {
    statusCode: number,
    message: {
        requires2fa: boolean,
        message: string
    }
}

export function fetchAuth(
	code: string,
	callback: (response: authResponse) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch<authResponse>(`${config.public.back.uri}/auth42/callback?code=${code}`, {
		method: 'POST',
		onResponse: ({ request, response, options }) => {
			console.log(request);
			console.log(response, response.headers);
			console.log(options);
			callback(response._data);
			console.log('all chats fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}