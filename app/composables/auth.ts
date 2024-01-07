type authResponse = {
    statusCode: number,
    message: {
        requires2fa: boolean,
        message: string
    }
}

type qrCodeResponse = {
    statusCode: number,
    message: string,
    otpauthUrl: string,
}

type xxResponse = {
    statusCode: number,
    message: string,
}


import { appendResponseHeader, H3Event } from 'h3'

export function fetchAuth(
	event: H3Event,
	code: string,
	callback: (response: authResponse) => void = () => {},
){
	const back = getBackPath();

	return useFetch<authResponse>(`${back}/auth42/callback?code=${code}`, {
		method: 'POST',
		credentials: 'include',
		onResponse: ({ request, response, options }) => {
			// console.log('cookie', response.headers);
			callback(response._data);

			// if (process.server){
			// 	const cookies = (response.headers.get('set-cookie') || '').split(',')
			// 	for (const cookie of cookies) {
			// 		appendResponseHeader(event, 'set-cookie', cookie)
			// 	}
			// }

		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchGetQRCode(
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();

	return useFetch<qrCodeResponse>(`${back}/auth/2fa`, {
		credentials: 'include',
		onResponse: ({ request, response, options }) => {
			callback(response._data);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchChange2fa(
	status: boolean,
	code: string,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();

	return useFetch<xxResponse>(`${back}/auth/2fa`, {
		method: 'PUT',
		credentials: 'include',
		body: {
			action: status ? 'enable' : 'disable',
			code: code,
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchSubmitCode(
	code: string,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();

	return useFetch(`${back}/auth/2fa`, {
		method: 'POST',
		credentials: 'include',
		body: {
			code: code,
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}