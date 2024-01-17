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
	callback: (res: authResponse) => void = () => {},
){
	const back = getBackPath();
	return useFetch<authResponse>(`${back}/auth42/callback?code=${code}`, {
		method: 'POST',
		credentials: 'include',
		onResponse: ({ request, response, options }) => {
			response.headers.forEach((value, name) => {
				if (name === 'set-cookie'){
					appendResponseHeader(event, 'set-cookie', value);
				}
			})
			callback(response._data);
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
