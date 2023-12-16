<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.FRIENDS); })

</script>

<template>
	<div class="grid h-full grid-rows-[4rem,1fr] grid-cols-[max-content,auto]">
		<div class="col-span-2 bg-color1"></div>
		<FriendsList class="scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 scrollbar-thumb-rounded-full scrollbar-track"/>
		<Profile class="max-h-full overflow-hidden" :userId="1" />
	</div>
</template>