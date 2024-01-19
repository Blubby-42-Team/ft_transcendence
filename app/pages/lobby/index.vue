<script setup lang="ts">

onMounted(() => {
	const { lobby, selectedLobby } = usePageStore();
	navigateTo(lobby.find(elem => elem.id === selectedLobby)?.path ?? '/lobby/classic')
})

</script>

<template>
	<div></div>
</template>