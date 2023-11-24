<script lang="ts" setup>
import { ESelectedLobby } from '~/stores/page';

definePageMeta({
	name: 'Lobby Random',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, "Play a Game", ESelectedLobby.Random);
})


</script>

<template>
	<div class="h-full">
		Random
	</div>
</template>
