<script lang="ts" setup>
import { ESelectedLobby } from '~/stores/page';

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
		<div class="flex w-full h-full p-5 overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-pink-500 scrollbar-thumb-rounded-full scrollbar-track">
			<GamePreviewCanvas uniqueToken="previewLocal"/>
		</div>
	</div>
</template>
