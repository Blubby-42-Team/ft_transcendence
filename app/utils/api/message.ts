import { EMsgType } from '#imports';

export function fetchPostMessage(
	userId: number,
	chatId: number,
	content: string,
	callback: (response: 'ok') => void = () => {},
){
	return HTTP_EDIT('POST', `/messages/${userId}`, {
		chatId: chatId,
		type: EMsgType.user,
		content: content
	}, callback);
}
