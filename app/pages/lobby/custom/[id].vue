<script lang="ts" setup>
const route = useRoute()
definePageMeta({
	name: 'Lobby Custom 2',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
const { reset } = useLobbyStore();

const { primaryUser } = useUserStore();

const lobbyStore = useLobbyStore();
const { otherPlayer } = toRefs(lobbyStore);


const roomId = route.params.id as string;

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, EGameMode.Custom);
	lobbyStore.joinParty(roomId);
});

onUnmounted(() => {
	reset();
});

</script>

<template>
	<div class="grid h-full grid-cols-[repeat(4,1fr)] grid-rows-[auto_max-content] w-full">
		<div/>
		<GameLobbyCard :id="primaryUser.id" :card="CardType.PLAYER"/>
		<GameLobbyCard :id="otherPlayer" :card="(otherPlayer !== 0 ? CardType.PLAYER : CardType.ADD)"/>
		<div/>
	</div>
</template>