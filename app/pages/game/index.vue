<script lang="ts" setup>

definePageMeta({name: 'Game'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

</script>

<template>
	<div>
		<GenericButton :buttonStyle="1">TEST</GenericButton >	
		<GameCanvas />
	</div>
</template>

