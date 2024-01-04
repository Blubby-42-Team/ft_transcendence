import { EMsgType } from '#imports';

export function fetchPostMessage(
	userId: number,
	chatId: number,
	content: string,
	callback: (response: 'ok') => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/messages/${userId}`, {
		method: 'POST',
		body: {
			'chatId': chatId,
			'type': 'user',
			'content': content
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('post message fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}
