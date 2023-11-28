<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Random',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
onMounted(() => { setPageDataLobby(EPageCategories.GAME, ESelectedLobby.Random); })

</script>

<template>
	<div class="h-full">
		Random
	</div>
</template>
