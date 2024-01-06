export function getBackPath(){
	const config = useRuntimeConfig();
	if (process.client){
		return config.public.back.uri;
	}
	else {
		return config.back.uri;
	}
}

export function getAuthPath(){
	const config = useRuntimeConfig();
	return config.public.back.auth;
}