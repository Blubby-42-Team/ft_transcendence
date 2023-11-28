<script lang="ts" setup>
// This is a catch all file: all path undefined go here (Page Not Found)

definePageMeta({name: 'Not Found'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

</script>

<template>
	<div class="h-full">
		<h1 class="flex items-center justify-center w-full h-full text-5xl">This page doesn't exist</h1>
	</div>
</template>