export default defineNuxtRouteMiddleware(async (to, from) => {
	if (!(from.path.startsWith('/lobby') && from.path !== '/lobby/custom' && to.path === '/game/lobby')) {
		const { endMatch } = useLobbyStore();
		endMatch();
	}
})
