export default defineNuxtRouteMiddleware(async (to, from) => {
	
	const config = useRuntimeConfig();
	const cookie = useCookie('user_id', {
		default: () => 0,
		watch: false
	});

	if (cookie.value === 0) {
		if (!process.server){
			window.location.href = `${config.public.back.uri}/auth42/login`;
		}
	}

	const { fetchUser, updatePrimaryUser } = useUserStore();

	const res = await fetchUser(cookie.value);

	if (!res || res.error.value){
		if (!process.server){
			window.location.href = `${config.public.back.uri}/auth42/login`;
		}
	}

	updatePrimaryUser(cookie.value);
})