<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Random',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
onMounted(() => { setPageDataLobby(EPageCategories.GAME, ESelectedLobby.Random); })

const lobby = new FrontLobbyMatchMakingInstance(2);

const test = computed(() => lobby)

</script>

<template>
	<div class="grid h-full grid-cols-[repeat(4,1fr)] grid-rows-[auto_max-content] w-full">
		<template v-for="el of lobby.players">
			<div class="p-2">
				<PlayLobbyCard :type="el.type"/>
			</div>
		</template>
		<br>
		<div class="w-full col-span-2 p-2">
			<PlayLobbyPlayButton :timeRemaining="test.timeRemaining" :sequence="test.sequence"/>
		</div>
		<br>
	</div>
</template>
