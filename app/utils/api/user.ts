import { BackEndUser } from "#imports";

export function fetchLogout(
	callback: (response: BackEndUser) => void = () => {},
){
	return HTTP_EDIT('POST', `/auth/logout`, {}, callback);
}


export function fetchUser(
	userId: number,
	callback: (response: BackEndUser) => void,
){
	return HTTP_GET(`/user/${userId}`, callback);
}

export function fetchUserByName(
	name: string,
	callback: (response: BackEndUser) => void = () => {},
){
	return HTTP_GET(`/user/search/${name}`, callback);
}

export function fetchUserFriends(
	userId: number,
	callback: (response: Array<{id: number, display_name: string, profile_picture: string}>) => void,
){
	return HTTP_GET(`/user/friends/${userId}`, callback);
}

export function fetchUserWhitelist(
	userId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_GET(`/user/whitelist/${userId}`, callback);
}

export function fetchUserBlacklist(
	userId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_GET(`/user/blacklist/${userId}`, callback);
}

// TODO watch if result is boolean or string 'false'
export function fetchUserIsInBlacklist(
	userId: number,
	blacklistId: number,
	callback: (response: boolean) => void = () => {},
){
	return HTTP_GET(`/user/blacklist/is_in/${userId}/${blacklistId}`, callback);
}

export function fetchUserWhitelistPost(
	userId: number,
	whitelistId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('POST', `/user/whitelist/${userId}`, {
		id: whitelistId
	}, callback);
}

export function fetchUserBlacklistPost(
	userId: number,
	blacklistId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('POST', `/user/blacklist/${userId}`, {
		id: blacklistId
	}, callback);
}

export function fetchUserFriendDelete(
	userId: number,
	friendId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('DELETE', `/user/friends/${userId}`, {
		id: friendId
	}, callback);
}

export function fetchUserBlacklistDelete(
	userId: number,
	blacklistId: number,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('DELETE', `/user/blacklist/${userId}`, {
		id: blacklistId
	}, callback);
}

export function fetchChangeDisplayName(
	userId: number,
	name: string,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/user/name/${userId}`, {
		name: name
	}, callback);
}

export function changeUserPicture(
	userId: number,
	picture: FormData,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('POST', `/user/picture/${userId}`, picture, callback);
}