// type authResponse = {
//     statusCode: number,
//     message: {
//         requires2fa: boolean,
//         message: string
//     }
// }

// export function fetchAuth(
// 	code: string,
// 	callback: (response: authResponse) => void = () => {},
// ){
// 	const config = useRuntimeConfig();
// 	return useFetch<authResponse>(`${config.public.back.uri}/auth42/callback?code=${code}`, {
// 		method: 'POST',
// 		credentials: 'include',
// 		onResponse: ({ request, response, options }) => {
// 			// console.log('cookie', response.headers);
// 			callback(response._data);

// 			if (process.server){
// 				const event = useRequestEvent();
// 				console.log('event', event);
// 				const x = response.headers.get('set-cookie');
// 				console.log('x', x);
// 				const cookies = (response.headers.get('set-cookie') || '').split(',')
// 				console.log('cookie', cookies);
// 				for (const cookie of cookies) {
// 					appendResponseHeader(event, 'set-cookie', cookie)
// 					console.log('cookie', cookie);
// 				}
// 			}

// 		},
// 		onRequestError: ({ request, error, options }) => {
// 			console.warn('error', error);
// 		},
// 	})
// }
