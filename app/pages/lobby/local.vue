<script lang="ts" setup>
import { ESelectedLobby } from '~/stores/page';


definePageMeta({
	name: 'Lobby Local',
	pageTransition: false,
	layout: 'lobby',
})
const { setPageData, setSelectedLobby } = usePageStore();
onMounted(() => {
	setPageData(EPageCategories.GAME, "Play a Game");
	setSelectedLobby(ESelectedLobby.Local);
})

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(1,auto)]">
		<PlaySettings :preview="false"/>
		<div class="flex w-full h-full p-5 overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color2 scrollbar-thumb-rounded-full scrollbar-track">
			<GamePreviewCanvas uniqueToken="previewLocal"/>
		</div>
	</div>
</template>
