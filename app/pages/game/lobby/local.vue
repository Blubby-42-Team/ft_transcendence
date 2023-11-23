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
		<PlaySettings :preview="false"/>
		<div class="flex w-full h-full p-5 overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color2 scrollbar-thumb-rounded-full scrollbar-track">
			<GamePreviewCanvas/>
		</div>
	</div>
</template>
