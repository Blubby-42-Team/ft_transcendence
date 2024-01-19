<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Classic',
	layout: 'lobby',
})

const { primaryUser } = useUserStore();
const lobbyStore = useLobbyStore();
const { otherPlayer } = toRefs(lobbyStore);

const { setPageDataLobby } = usePageStore();

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, EGameMode.Classic);
	lobbyStore.changeBehaviour(EGameMode.Classic);
});



function redirect(){
	navigateTo('/game/local');
};

onUnmounted(() => {
	lobbyStore.reset();
});

</script>

<template>
	<div class="grid h-full grid-cols-[repeat(4,1fr)] grid-rows-[auto_max-content] w-full">
		<div/>
		<GameLobbyCard :id="primaryUser.id" :card="CardType.PLAYER"/>
		<GameLobbyCard :id="otherPlayer" :card="(otherPlayer !== 0 ? CardType.PLAYER : CardType.EMPTY)"/>
		<div/>
		<div/>
		<div class="w-full col-span-2 p-2">
			<GameLobbyButton :endFunc="redirect"/>
		</div>
		<div/>
	</div>
</template>