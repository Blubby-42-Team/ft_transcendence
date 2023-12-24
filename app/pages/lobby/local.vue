<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Local',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
onMounted(() => { setPageDataLobby(EPageCategories.GAME, ESelectedLobby.Local); })

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(1,auto)]">
		<PlaySettings :preview="false"/>
		<div class="flex w-full h-full p-5">
			<GamePreviewCanvas uniqueToken="previewLocal"/>
		</div>
	</div>
</template>
