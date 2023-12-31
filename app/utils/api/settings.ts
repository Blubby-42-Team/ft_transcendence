import { ETheme } from '#imports'

export function fetchSettings(
	userId: number,
	callback: (response: BackUserSettings) => void = () => {},
){
	const back = getBackPath();
	return useFetch<BackUserSettings>(`${back}/settings/${userId}`, {
		onResponse: ({ request, response, options }) => {
			callback(response._data);
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
	callback: (response: any) => void = () => {},
){
	const back = getBackPath();
	return useFetch(`${back}/settings/${userId}`, {
		method: 'PATCH',
		body: {
			'theme': theme,
			'sound': sound,
		},
		onResponse: ({ request, response, options }) => {
			callback(response._data);
			console.log('user game save fetched');
		},
		onRequestError: ({ request, error, options }) => {
			console.warn('error', error);
		},
	})
}
