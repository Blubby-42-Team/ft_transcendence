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
	<div class="grid h-full grid-cols-[max-content_repeat(1,auto)]">
		<PlaySettings/>
		<div class="p-5 bg-yellow-400">
		</div>
	</div>
</template>
