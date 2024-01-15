<script setup lang="ts">

const pageStore = usePageStore();
const { selectedLobby, lobby } = storeToRefs(pageStore);


onMounted(() => {
	navigateTo(lobby.value.find(elem => elem.id === selectedLobby.value)?.path ?? '/lobby/classic')
})

</script>

<template>
	<div></div>
</template>