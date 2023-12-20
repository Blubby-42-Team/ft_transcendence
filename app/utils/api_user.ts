export default {
	fetchUser(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/${userId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

	fetchUserFriends(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/friends/${userId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user friends fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

	fetchUserWhitelist(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/whitelist/${userId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user whitelist fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

	fetchUserBlacklist(
		userId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/blacklist/${userId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user blacklist fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

	fetchUserIsInBlacklist(
		userId: number,
		blacklistId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/blacklist/is_in/${userId}/${blacklistId}`, {
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user is in blacklist fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},

	fetchUserWhitelistPost(
		userId: number,
		whitelistId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/whitelist/${userId}`, {
			method: 'POST',
			body: {
				'id': whitelistId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user whitelist fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		  })
	},

	fetchUserBlacklistPost(
		userId: number,
		blacklistId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/blacklist/${userId}`, {
			method: 'POST',
			body: {
				'id': blacklistId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user blacklist fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		  })
	},

	fetchUserFriendDelete(
		userId: number,
		friendId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/friends/${userId}`, {
			method: 'DELETE',
			body: {
				'id': friendId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user delete friend fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		  })
	},

	fetchUserBlacklistDelete(
		userId: number,
		blacklistId: number,
		callback: (response: any) => void,
	){
		return useFetch(`${process.env.NUXT_BACK_URI}/user/blacklists/${userId}`, {
			method: 'DELETE',
			body: {
				'id': blacklistId
			},
			onResponse: ({ request, response, options }) => {
				callback(response);
				console.log('user delete blacklist fetched');
			},
			onRequestError: ({ request, error, options }) => {
				console.warn('error', error);
			},
		})
	},
}