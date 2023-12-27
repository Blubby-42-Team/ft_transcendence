<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Random',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
const { cards, reset } = useLobbyStore();

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, EGameMode.Random);
	reset(1);
})

onUnmounted(() => {
	reset(1);
})

</script>

<template>
	<div class="grid h-full grid-cols-[repeat(4,1fr)] grid-rows-[auto_max-content] w-full">
		<template v-for="player of cards">
			<div class="p-2">
				<PlayLobbyCard :player="player"/>
			</div>
		</template>
		<br>
		<div class="w-full col-span-2 p-2">
			<PlayLobbyPlayButtonMatchmaking/>
		</div>
		<br>
	</div>
</template>
