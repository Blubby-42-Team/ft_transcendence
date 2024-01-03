<script setup lang="ts">

definePageMeta({name: 'Home'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

const { addNotif } = useNotifStore();

</script>

<template>
	<div class="flex items-center justify-center h-full p-5 text-9xl">
		<div>Welc</div>
		<GenericButton :buttonStyle="2" @click="addNotif('EasterEgg')">o</GenericButton>
		<div>me</div>
	</div>
</template>