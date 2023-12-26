import { ETheme } from '#imports'

export function fetchSettings(
	userId: number,
	callback: (response: any) => void,
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/settings/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response);
			console.log('settings fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export function fetchSettingsPatch(
	userId: number,
	theme: ETheme,
	sound: boolean,
	callback: (response: any) => void,
){
	const config = useRuntimeConfig();
	return useFetch(`${config.public.back.uri}/settings/${userId}`, {
		method: 'PATCH',
		body: {
			'theme': theme,
			'sound': sound,
		},
		onResponse: ({ request, response, options }) => {
			callback(response);
			console.log('user game save fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}

export default {
    fetchSettings,
    fetchSettingsPatch,
}