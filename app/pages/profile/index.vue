<script lang="ts" setup>

definePageMeta({name: 'My Profil'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })


</script>

<template>
	<div>
		profile
	</div>
</template>