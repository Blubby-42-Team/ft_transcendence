<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Custom',
	pageTransition: false,
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<PlayLobby>
		<PlayCustom/>
    </PlayLobby>
</template>
