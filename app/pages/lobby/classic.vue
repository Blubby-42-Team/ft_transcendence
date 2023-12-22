<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Classic',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
const { join, leave, cards } = useLobbyStore();

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, EGameMode.Classic);
	join(EGameMode.Classic);
})

onUnmounted(() => {
	leave();
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