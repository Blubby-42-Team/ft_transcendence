import { BackEndUser } from "#imports";

export function fetchUser(
	userId: number,
	callback: (response: BackEndUser) => void,
){
	const back = getBackPath();
	return useFetch(`${back}/user/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserByName(
	name: string,
	callback: (response: BackEndUser) => void = () => {},
){
	const back = getBackPath();
	return useFetch<BackEndUser>(`${back}/user/search/${name}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserFriends(
	userId: number,
	callback: (response: Array<{id: number, display_name: string, profile_picture: string}>) => void,
){
	const back = getBackPath();
	return useFetch(`${back}/user/friends/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user friends fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserWhitelist(
	userId: number,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/user/whitelist/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user whitelist fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserBlacklist(
	userId: number,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/user/blacklist/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user blacklist fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserIsInBlacklist(
	userId: number,
	blacklistId: number,
	callback: (response: boolean) => void = () => {},
){
	const back = getBackPath();
	return useFetch<'true' | 'false'>(`${back}/user/blacklist/is_in/${userId}/${blacklistId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data === 'true');
			console.log('user is in blacklist fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserWhitelistPost(
	userId: number,
	whitelistId: number,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/user/whitelist/${userId}`, {
		method: 'POST',
		body: {
			'id': whitelistId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user whitelist fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserBlacklistPost(
	userId: number,
	blacklistId: number,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/user/blacklist/${userId}`, {
		method: 'POST',
		body: {
			'id': blacklistId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user blacklist fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserFriendDelete(
	userId: number,
	friendId: number,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch<"OK">(`${back}/user/friends/${userId}`, {
		method: 'DELETE',
		body: {
			'id': friendId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user delete friend fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchUserBlacklistDelete(
	userId: number,
	blacklistId: number,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/user/blacklist/${userId}`, {
		method: 'DELETE',
		body: {
			'id': blacklistId
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user delete blacklist fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchChangeDisplayName(
	userId: number,
	name: string,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/user/name/${userId}`, {
		method: 'PATCH',
		body: {
			'name': name
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log(`${userId} changed display name`);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function changeUserPicture(
	userId: number,
	picture: FormData,
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/user/picture/${userId}`, {
		method: 'POST',
		body: picture,
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log(`changed user ${userId} picture`);
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}