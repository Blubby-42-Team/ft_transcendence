import { EChatType } from "../../libs/types/chat"
import { EMsgType } from "../../libs/types/messages"

type message = {
	type: EMsgType,
	userId: number,
	content: string,
	messageId: number,
}

type chat = {
	chat_picture: string,
	id: number,
	messages: Array<message>,
	type: EChatType,
}

export default {
	fetchChat(
		userId: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`http://localhost:3000/chat/${userId}/chat/${chatId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	}
}

