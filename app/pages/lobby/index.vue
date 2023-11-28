<script setup lang="ts">

const { selectedLobby, lobby } = usePageStore()

onMounted(() => {
	navigateTo(lobby.find(elem => elem.id === selectedLobby.value)?.path ?? '/lobby/classic')
})

</script>

<template>
	<div></div>
</template>