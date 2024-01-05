import { EChatType, BackChannelType } from '#imports';

export function fetchAllChats(
	userId: number,
	callback: (response: Array<{
		id: number,
		name: string,
		type: EChatType,
		chat_picture: string,
	}>) => void,
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('all chats fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchAllChatsUserCanJoin(
	userId: number,
	callback: (response: Array<{
		id: number,
		name: string,
		type: EChatType,
		chat_picture: string,
	}>) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch<Array<{
		id: number,
		name: string,
		type: EChatType,
		chat_picture: string,
	}>>(`${config.public.back.uri}/chat/list/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('all chats fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchChatsByTypes(
	userId: number,
	chatType: EChatType,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/chat/${chatType}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('all chats by type fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchChatsById(
	userId: number,
	chatId: number,
	callback: (response: BackChannelType) => void,
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/chat/${chatId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('chats by id fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchIsInChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/is_in/${chatId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('is in chats by id fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchCreateChat(
	userId: number,
	type: EChatType,
	name: string,
	callback: (response: number) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch<number>(`${config.public.back.uri}/chat/${userId}`, {
		method: 'POST',
		body: {
			'type': type,
			'name': name
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('create chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchCreateChatProtected(
	userId: number,
	type: EChatType,
	name: string,
	password: string,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch<number>(`${config.public.back.uri}/chat/${userId}/protected`, {
		method: 'POST',
		body: {
			'type': type,
			'name': name,
			'password': password
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('create chat protected fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchAddInChat(
	userId: number,
	friendId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/add`, {
		method: 'PATCH',
		body: {
			'friendId': friendId,
			'chatId': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('add in chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchRemoveFromChat(
	userId: number,
	toRemoveId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/remove`, {
		method: 'DELETE',
		body: {
			'toRemoveId': toRemoveId,
			'chatId': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('remove from chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchLeaveChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch<"OK">(`${config.public.back.uri}/chat/${userId}/leave`, {
		method: 'DELETE',
		body: {
			'id': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('leave chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchAddAdminChat(
	userId: number,
	toAdd: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/admin_add`, {
		method: 'PATCH',
		body: {
			'toAdd': toAdd,
			'chatId': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('add admin to chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchRemoveAdminFromChat(
	userId: number,
	toRemoveId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/admin_remove`, {
		method: 'DELETE',
		body: {
			'toRemoveId': toRemoveId,
			'chatId': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('remove admin from chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchBanUser(
	userId: number,
	toBan: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/ban`, {
		method: 'PATCH',
		body: {
			'toBan': toBan,
			'chatId': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('ban user from chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUnanUser(
	userId: number,
	toUnban: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/unban`, {
		method: 'DELETE',
		body: {
			'toUnban': toUnban,
			'chatId': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('unban user from chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchDeleteChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/delete`, {
		method: 'DELETE',
		body: {
			'id': chatId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('delete chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export async function fetchJoinChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch<"ok">(`${config.public.back.uri}/chat/${userId}/join/${chatId}`, {
		method: 'PATCH',
		body: {
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('join chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export async function fetchJoinProtectedChat(
	userId: number,
	chatId: number,
	password: string,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch<"ok">(`${config.public.back.uri}/chat/${userId}/join_protected/${chatId}`, {
		method: 'PATCH',
		body: {
			'password': password
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('join protected chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchChangeChatType(
	userId: number,
	chatId: number,
	password: string,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/change_type/${chatId}`, {
		method: 'PATCH',
		body: {
			'password': password
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('change chat type fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function ChangeChatName(
	userId: number,
	chatId: number,
	name: string,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${chatId}/name/${userId}`, {
		method: 'PATCH',
		body: {
			'name': name
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log(`${userId} changed chat ${chatId} name`);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function changeChatPicture(
	userId: number,
	chatId: number,
	picture: FormData,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${chatId}/picture/${userId}`, {
		method: 'POST',
		body: picture,
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log(`changed chat ${chatId} picture`);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchMuteUser(
	userId: number,
	toMute: number,
	chatId: number,
	length: number,
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/chat/${userId}/mute/${chatId}`, {
		method: 'PATCH',
		body: {
			'toMute': toMute,
			'length': length
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('add admin to chat fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}