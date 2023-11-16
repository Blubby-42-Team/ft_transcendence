<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Classic',
	pageTransition: false,
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<PlayLobby>
		<PlayClassic/>
	</PlayLobby>
</template>

