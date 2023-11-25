<script lang="ts" setup>

definePageMeta({name: 'Watch'})
const { setPageData } = usePageStore();

onMounted(() => { setPageData(EPageCategories.WATCH, "Match In Progress"); })

const { gameList } = useGameListStore();

</script>

<template>
	<div class="flex flex-col p-5">
		<div class="flex flex-row">
			<GenericButton :buttonStyle="1" class="w-10 h-10">
				<Icon name="material-symbols:refresh" class="w-full h-full"/>
			</GenericButton>
		</div>

		<div class="flex w-full mt-5 mb-5 border-2 border-pink-500"></div>
		
		<template v-if="gameList.length > 0">
			<div class="block w-full max-h-[70vh] overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-pink-500 scrollbar-thumb-rounded-none">
				<WatchList/>
			</div>
		</template>
		<template v-else>
			<div class="text-3xl">No Games Yet</div>
		</template>
	</div>
</template>