export default defineNuxtRouteMiddleware((to, from) => {
	const appConfig = useAppConfig()

	let title = `${appConfig.app_name}`;
	if (to.name){
		title += ` - ${to.name?.toString()}`;
	}

	useSeoMeta({title})
})
