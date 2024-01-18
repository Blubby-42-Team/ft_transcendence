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
	return HTTP_GET(`/chat/${userId}`, callback);
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
	return HTTP_GET(`/chat/list/${userId}`, callback);
}

export function fetchChatsByTypes(
	userId: number,
	chatType: EChatType,
	callback: (response: any) => void = () => {},
){
	return HTTP_GET(`/chat/${userId}/chat/${chatType}`, callback);
}

export function fetchChatsById(
	userId: number,
	chatId: number,
	callback: (response: BackChannelType) => void,
){
	return HTTP_GET(`/chat/${userId}/chat/${chatId}`, callback);
}

export function fetchIsInChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_GET(`/chat/${userId}/is_in/${chatId}`, callback);
}

export function fetchCreateChat(
	userId: number,
	type: EChatType,
	name: string,
	callback: (response: number) => void = () => {},
){
	return HTTP_EDIT('POST', `/chat/${userId}`, {
		type: type,
		name: name
	}, callback);
}

export function fetchCreateChatProtected(
	userId: number,
	type: EChatType,
	name: string,
	password: string,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('POST', `/chat/${userId}/protected`, {
		type: type,
		name: name,
		password: password
	}, callback);
}

export function fetchAddInChat(
	userId: number,
	friendId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${userId}/add`, {
		friendId: friendId,
		chatId: chatId
	}, callback);
}

export function fetchRemoveFromChat(
	userId: number,
	toRemoveId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('DELETE', `/chat/${userId}/remove`, {
		toRemoveId: toRemoveId,
		chatId: chatId
	}, callback);
}

export function fetchLeaveChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('DELETE', `/chat/${userId}/leave`, {
		id: chatId
	}, callback);
}

export function fetchAddAdminChat(
	userId: number,
	toAdd: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${userId}/admin_add`, {
		toAdd: toAdd,
		chatId: chatId
	}, callback);
}

export function fetchRemoveAdminFromChat(
	userId: number,
	toRemoveId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('DELETE', `/chat/${userId}/admin_remove`, {
		toRemoveId: toRemoveId,
		chatId: chatId
	}, callback);
}

export function fetchBanUser(
	userId: number,
	toBan: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${userId}/ban`, {
		toBan: toBan,
		chatId: chatId
	}, callback);
}

export function fetchUnanUser(
	userId: number,
	toUnban: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('DELETE', `/chat/${userId}/unban`, {
		toUnban: toUnban,
		chatId: chatId
	}, callback);
}

export function fetchDeleteChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('DELETE', `/chat/${userId}/delete`, {
		id: chatId
	}, callback);
}

export async function fetchJoinChat(
	userId: number,
	chatId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${userId}/join/${chatId}`, {}, callback);
}

export async function fetchJoinProtectedChat(
	userId: number,
	chatId: number,
	password: string,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${userId}/join_protected/${chatId}`, {
		password: password
	}, callback);
}

export function fetchChangeChatType(
	userId: number,
	chatId: number,
	password: string,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${userId}/change_type/${chatId}`, {
		password: password
	}, callback);
}

export function ChangeChatName(
	userId: number,
	chatId: number,
	name: string,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${userId}/name/${chatId}`, {
		name: name
	}, callback);
}

export function changeChatPicture(
	userId: number,
	chatId: number,
	picture: FormData,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('POST', `/chat/${chatId}/picture/${userId}`, picture, callback);
}

export function fetchMuteUser(
	userId: number,
	toMute: number,
	chatId: number,
	length: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/chat/${chatId}/mute/${userId}`, {
		toMute: toMute,
		length: length
	}, callback);
}