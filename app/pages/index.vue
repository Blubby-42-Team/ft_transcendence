<script setup lang="ts">

definePageMeta({name: 'Home'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.NONE, "Home"); })

</script>

<template>
	<div class="flex p-5">
		<div class="flex p-10 rounded-3xl bg-accent-color text-9xl">Play</div>
	</div>
</template>