<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Local',
	pageTransition: false,
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<PlayLobby>
		<PlayLocal/>
    </PlayLobby>
</template>
