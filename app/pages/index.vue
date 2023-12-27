<script setup lang="ts">

definePageMeta({name: 'Home'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

</script>

<template>
	<div class="flex items-center justify-center h-full p-5 text-9xl">
		Welcome
	</div>
</template>