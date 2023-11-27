<script lang="ts" setup>

const route = useRoute()

definePageMeta({name: 'Profil'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })


</script>

<template>
	<div>
		profile {{ route.params.id }}
	</div>
</template>