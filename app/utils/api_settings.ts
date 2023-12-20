import { ETheme } from '@shared/types/settings'

export default {
	fetchSettings(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/settings/${userId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('settings fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

    fetchSettingsPatch(
		userId: number,
		theme: ETheme,
        sound: boolean,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/settings/${userId}`, {
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
	},
}