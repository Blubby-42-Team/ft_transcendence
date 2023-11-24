<script lang="ts" setup>
import { ESelectedLobby } from '~/stores/page';

definePageMeta({
	name: 'Lobby Classic',
	layout: 'lobby',
})


onMounted(() => {
	const { setPageDataLobby } = usePageStore();
	setPageDataLobby(EPageCategories.GAME, "Play a Game", ESelectedLobby.Classic);
})




</script>

<template>
	<div class="h-full">
		Classic
	</div>
</template>
