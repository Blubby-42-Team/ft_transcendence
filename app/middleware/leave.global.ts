export default defineNuxtRouteMiddleware(async (to, from) => {
	if (!(from.path.startsWith('/lobby') && to.path === '/game/lobby')) {
		const { endMatch } = useLobbyStore();
		endMatch();
	}
})
