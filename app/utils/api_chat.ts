import { EChatType } from '@shared/types/chat';

export default {
	fetchAllChats(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('all chats fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchChatsByTypes(
		userId: number,
        chatType: EChatType,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/chat/${chatType}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('all chats by type fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchChatsById(
		userId: number,
        chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/chat/${chatId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('chats by id fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchIsInChat(
		userId: number,
        chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/is_in/${chatId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('is in chats by id fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchCreateChat(
        userId: number,
		type: EChatType,
		name: string,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}`, {
			method: 'POST',
			body: {
				'type': type,
                'name': name
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('create chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchCreateChatProtected(
        userId: number,
		type: EChatType,
		name: string,
        password: string,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/protected`, {
			method: 'POST',
			body: {
				'type': type,
                'name': name,
                'password': password
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('create chat protected fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchAddInChat(
        userId: number,
		friendId: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/add`, {
			method: 'PATCH',
			body: {
				'friendId': friendId,
                'chatId': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('add in chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchRemoveFromChat(
        userId: number,
		toRemoveId: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/remove`, {
			method: 'DELETE',
			body: {
				'toRemove': toRemoveId,
                'chatId': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('remove from chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchLeaveChat(
        userId: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/leave`, {
			method: 'DELETE',
			body: {
                'id': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('leave chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchAddAdminChat(
        userId: number,
        toAdd: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/admin_add`, {
			method: 'PATCH',
			body: {
                'toAdd': toAdd,
                'chatId': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('add admin to chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchRemoveAdminFromChat(
        userId: number,
        toRemoveId: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/admin_remove`, {
			method: 'DELETE',
			body: {
                'toRemoveId': toRemoveId,
                'chatId': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('remove admin from chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchBanUser(
        userId: number,
        toBan: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/ban`, {
			method: 'PATCH',
			body: {
                'toBan': toBan,
                'chatId': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('ban user from chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchUnanUser(
        userId: number,
        toUnban: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/unban`, {
			method: 'DELETE',
			body: {
                'toUnban': toUnban,
                'chatId': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('unban user from chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchDeleteChat(
        userId: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/delete`, {
			method: 'DELETE',
			body: {
                'id': chatId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('delete chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchJoinChat(
        userId: number,
		chatId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/join/${chatId}`, {
			method: 'PATCH',
			body: {
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('join chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchJoinProtectedChat(
        userId: number,
		chatId: number,
        password: string,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/join_protected/${chatId}`, {
			method: 'PATCH',
			body: {
                'password': password
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('join protected chat fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

    fetchChangeChatType(
        userId: number,
		chatId: number,
        password: string,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/chat/${userId}/change_type/${chatId}`, {
			method: 'PATCH',
			body: {
                'password': password
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('change chat type fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
    },

}

