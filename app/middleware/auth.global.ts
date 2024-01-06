export default defineNuxtRouteMiddleware(async (to, from) => {
	if (['/login/2fa', '/login'].includes(to.path)){
		return ;
	}
	
	const auth = getAuthPath();

	const cookie = useCookie('user_id', {
		default: () => 0,
		watch: false
	});

	if (cookie.value === 0) {
		await navigateTo(auth, {
			external: true
		})
	}

	const { fetchUser, updatePrimaryUser } = useUserStore();

	const res = await fetchUser(cookie.value);

	if (!res || res.error.value){
		await navigateTo(auth, {
			external: true
		})
	}

	updatePrimaryUser(cookie.value);
})