import { AsyncData } from "#app";
import { BackEndUser } from "#imports";
import { FetchError } from "ofetch"

export function fetchUser(
	userId: number,
	callback: (response: BackEndUser) => void,
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/${userId}`, {
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
): AsyncData<BackEndUser, FetchError<any> | null> {
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/search/${name}`, {
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
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/friends/${userId}`, {
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
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/whitelist/${userId}`, {
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
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/blacklist/${userId}`, {
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
	callback: (response: any) => void = () => {},
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/blacklist/is_in/${userId}/${blacklistId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
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
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/whitelist/${userId}`, {
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
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/blacklist/${userId}`, {
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
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/friends/${userId}`, {
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
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/user/blacklists/${userId}`, {
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
