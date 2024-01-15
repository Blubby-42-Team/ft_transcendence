export default defineNuxtRouteMiddleware(async (to, from) => {
	if (['/login/2fa', '/login'].includes(to.path)){
		return ;
	}
	
	const cookie = useCookie('user_id', {
		watch: false
	});

	const userId = parseInt(cookie.value ?? '0');

	if (userId === 0) {
		return navigateTo('/login', { redirectCode: 301 })
	}

	const { fetchUser, updatePrimaryUser } = useUserStore();

	const res = await fetchUser(userId);

	if (!res || res.error.value){
		return navigateTo('/login', { redirectCode: 301 })
	}

	updatePrimaryUser(userId);
})