<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Custom',
	pageTransition: false,
	layout: 'lobby',
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<PlayCustom/>
</template>
