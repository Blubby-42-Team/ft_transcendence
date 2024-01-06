export default defineNuxtRouteMiddleware(async (to, from) => {
	if (['/login/2fa', 'login'].includes(to.path)){
		return ;
	}

	
	const config = useRuntimeConfig();

	// console.log(from.query.code)
	// if (from.query?.code){
	// 	const res = await fetchAuth(to.query?.code ?? '', async (res) => {
	// 		console.log(res, res?.message?.requires2fa)
	// 		await navigateTo('/login/2fa');
	// 		if (res?.message?.requires2fa ?? false === false){
	// 		}
	// 	});


	// 	return ;

	// }

	const cookie = useCookie('user_id', {
		default: () => 0,
		watch: false
	});

	if (cookie.value === 0) {
		await navigateTo(config.public.back.auth, {
			external: true
		})
	}

	const { fetchUser, updatePrimaryUser } = useUserStore();

	const res = await fetchUser(cookie.value);

	if (!res || res.error.value){
		await navigateTo(config.public.back.auth, {
			external: true
		})
	}

	updatePrimaryUser(cookie.value);
})