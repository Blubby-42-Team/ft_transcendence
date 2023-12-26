import { EMsgType } from '#imports';

export function fetchPostMessage(
    userId: number,
    chatId: number,
    type: EMsgType,
    content: string,
    callback: (response: any) => void,
){
    return useFetch(`${config.public.back.uri}/messages/${userId}`, {
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
}
