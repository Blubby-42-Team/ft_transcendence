<script lang="ts" setup>

const route = useRoute()

definePageMeta({name: 'Profil'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.NONE, "My Profile"); })


</script>

<template>
	<div>
		profile {{ route.params.id }}
	</div>
</template>