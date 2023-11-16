<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Random',
	pageTransition: false,
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<PlayLobby>
		<PlayRandom/>
    </PlayLobby>
</template>
