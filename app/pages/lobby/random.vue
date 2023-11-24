<script lang="ts" setup>
import { ESelectedLobby } from '~/stores/page';

definePageMeta({
	name: 'Lobby Random',
	pageTransition: false,
	layout: 'lobby',
})
const { setPageData, setSelectedLobby } = usePageStore();
onMounted(() => {
	setPageData(EPageCategories.GAME, "Play a Game");
	setSelectedLobby(ESelectedLobby.Random);
})


</script>

<template>
	<div class="h-full">
		Random
	</div>
</template>
