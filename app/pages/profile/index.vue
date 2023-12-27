<script lang="ts" setup>

definePageMeta({name: 'My Profil'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

const { primaryUser } = useUserStore();

</script>

<template>
	<Profile :userId="primaryUser.id"/>
</template>