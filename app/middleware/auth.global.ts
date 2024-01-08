export default defineNuxtRouteMiddleware(async (to, from) => {
	if (['/login/2fa', '/login'].includes(to.path)){
		return ;
	}
	
	const auth = getAuthPath();

	const cookie = useCookie('user_id', {
		watch: false
	});

	const userId = parseInt(cookie.value ?? '0');

	if (userId === 0) {
		await navigateTo(auth, {
			external: true
		})
		return ;
	}

	const { fetchUser, updatePrimaryUser } = useUserStore();

	const res = await fetchUser(userId);

	if (!res || res.error.value){
		await navigateTo(auth, {
			external: true
		})
		return ;
	}

	updatePrimaryUser(userId);
})