<script lang="ts" setup>
import { ESelectedLobby } from '~/stores/page';

definePageMeta({
	name: 'Lobby Random',
	pageTransition: false,
	layout: 'lobby',
})

onMounted(() => {
	const { setPageDataLobby } = usePageStore();
	setPageDataLobby(EPageCategories.GAME, "Play a Game", ESelectedLobby.Random);
})


</script>

<template>
	<div class="h-full">
		Random
	</div>
</template>
