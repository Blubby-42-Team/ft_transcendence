export default defineNuxtRouteMiddleware(async (to, from) => {
	const event = useRequestEvent();

	const code = to.query.code;
	if (code && typeof code === 'string'){
		const res = await fetchAuth(event, code);
		if (!(res.data?.value?.message?.requires2fa)){
			console.log('navigate to /');
			return navigateTo('/');
		}
	}
})
