export default defineNuxtRouteMiddleware(async (to, from) => {
	
	const config = useRuntimeConfig();
	const cookie = useCookie('user_id', {
		default: () => 0,
		watch: false
	});

	if (cookie.value === 0) {
		await navigateTo(`${config.public.back.uri}/auth42/login`, {
			external: true
		})
	}

	const { fetchUser, updatePrimaryUser } = useUserStore();

	const res = await fetchUser(cookie.value);

	if (!res || res.error.value){
		await navigateTo(`${config.public.back.uri}/auth42/login`, {
			external: true
		})
	}

	updatePrimaryUser(cookie.value);
})