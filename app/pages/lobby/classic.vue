<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Classic',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
onMounted(() => { setPageDataLobby(EPageCategories.GAME, ESelectedLobby.Classic); })

</script>

<template>
	<div class="h-full">
		Classic
	</div>
</template>
