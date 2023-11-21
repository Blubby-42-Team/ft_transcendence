<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Classic',
	pageTransition: false,
	layout: 'lobby',
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<PlayClassic/>
</template>

