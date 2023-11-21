<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Local',
	pageTransition: false,
	layout: 'lobby',
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<PlayLocal/>
</template>
