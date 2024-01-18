import { ETheme } from '#imports'

export function fetchSettings(
	userId: number,
	callback: (response: BackUserSettings) => void = () => {},
){
	return HTTP_GET(`/settings/${userId}`, callback);
}

export function fetchSettingsPatch(
	userId: number,
	theme: ETheme,
	sound: boolean,
	callback: (response: any) => void = () => {},
){
	return HTTP_EDIT('PATCH', `/settings/${userId}`, {
		'theme': theme,
		'sound': sound,
	}, callback);
}
