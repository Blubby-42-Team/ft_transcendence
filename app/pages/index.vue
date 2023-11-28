<script setup lang="ts">

definePageMeta({name: 'Home'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

</script>

<template>
	<div class="flex p-5">
		<div class="flex p-10 bg-pink-500 rounded-3xl text-9xl">Play</div>
	</div>
</template>