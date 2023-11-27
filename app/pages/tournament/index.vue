<script lang="ts" setup>

const { tournaments } = useTournamentListStore();

definePageMeta({name: 'Tournaments'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.TOURNAMENT, "Tournaments"); })

</script>

<template>
	<div class="flex flex-col p-5">
		<div class="flex flex-row">
			<GenericButton :buttonStyle="1" class="w-10 h-10 mr-2">
				<Icon name="material-symbols:refresh" class="w-full h-full"/>
			</GenericButton>
			<GenericNuxtLink to="/" :buttonStyle="1" class="h-10 pl-1 pr-1">
				Create new event
			</GenericNuxtLink>
		</div>

		<div class="flex mt-5 mb-5 border-2 border-pink-500"></div>
		
		<template v-if="tournaments.length > 0">
			<div class="block w-full max-h-[70vh] overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-pink-500 scrollbar-thumb-rounded-none scrollbar-track">
				<TournamentList/>
			</div>
		</template>
		<template v-else>
			<div class="text-3xl">No Tournaments Yet</div>
		</template>
	</div>
</template>