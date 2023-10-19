<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.FRIENDS, "My Friends"); })

</script>

<template>
	<div>
		friends
	</div>
</template>