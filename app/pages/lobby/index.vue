<script setup lang="ts">

definePageMeta({
	redirect: () => {
		const { lobby, selectedLobby } = usePageStore();
		return lobby.value.find(el => el.id === selectedLobby.value)?.path ?? '/404';
	}
})

</script>

<template>
</template>