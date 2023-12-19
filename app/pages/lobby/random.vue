<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Random',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
const { players, reset } = useLocalLobbyStore();

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, ESelectedLobby.Random);
	reset(1);
})

onUnmounted(() => {
	reset(1);
})

</script>

<template>
	<div class="grid h-full grid-cols-[repeat(4,1fr)] grid-rows-[auto_max-content] w-full">
		<template v-for="el of players">
			<div class="p-2">
				<PlayLobbyCard :type="el.type"/>
			</div>
		</template>
		<br>
		<div class="w-full col-span-2 p-2">
			<PlayLobbyPlayButtonMatchmaking/>
		</div>
		<br>
	</div>
</template>
