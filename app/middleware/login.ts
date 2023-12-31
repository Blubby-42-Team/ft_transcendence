export default defineNuxtRouteMiddleware(async (to, from) => {
	const event = useRequestEvent();
	const router = useRouter()

	const code = to.query.code;
	if (process.client && code && typeof code === 'string'){
		const res = await fetchAuth(event, code);
		if (!(res.data.value?.message.requires2fa)){
			await router.push({path: '/'})
		}
	}
})
