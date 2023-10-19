<script lang="ts" setup>

definePageMeta({name: 'My Profil'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.NONE, "My Profile"); })


</script>

<template>
	<div>
		profile
	</div>
</template>