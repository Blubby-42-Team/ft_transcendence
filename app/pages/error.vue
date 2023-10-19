<script lang="ts" setup>

definePageMeta({name: 'An Error Occured'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.NONE, ""); })


</script>

<template>
	<div class="h-full">
		<h1 class="flex items-center justify-center w-full h-full text-5xl">An Error Occured</h1>
	</div>
</template>