<script setup lang="ts">

definePageMeta({name: 'Home'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.NONE, "Home"); })

</script>

<template>
	<div>
		<test/>
	</div>
</template>