<script lang="ts" setup>
import { ESelectedLobby } from '~/stores/page';


definePageMeta({
	name: 'Lobby Classic',
	pageTransition: false,
	layout: 'lobby',
})
const { setPageData, setSelectedLobby } = usePageStore();
onMounted(() => {
	setPageData(EPageCategories.GAME, "Play a Game");
	setSelectedLobby(ESelectedLobby.Classic);
})



</script>

<template>
	<div class="h-full">
		Classic
	</div>
</template>
