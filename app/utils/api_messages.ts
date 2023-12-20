import { EMsgType } from '@shared/types/messages';

export default {
    fetchPostMessage(
        userId: number,
		chatId: number,
        type: EMsgType,
		content: string,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/messages/${userId}`, {
			method: 'POST',
			body: {
				'chatId': chatId,
                'type': type,
                'content': content
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('post message fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},
}