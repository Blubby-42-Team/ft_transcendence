<script lang="ts" setup>
const route = useRoute()
const { tournaments, del } = useTournamentListStore();

const { setSelectedCategory } = usePageStore();

definePageMeta({name: 'Tournament'})

const tournament = tournaments.find((el) => el.id == route.params.id)
if (tournament === undefined){
	navigateTo('/tournament')
}

onMounted(() => {
	setSelectedCategory(EPageCategories.TOURNAMENT);
})

function deleteTournament(){
	del(route.params.id as string)
	navigateTo('/tournament')
}

</script>

<template>
	<div class="grid h-full grid-rows-[min-content,min-content,auto] p-5">
		<div class="flex">
			<GenericNuxtLink to="/tournament" :buttonStyle="1" class="h-10 mr-2">
				<Icon name="material-symbols:arrow-back-ios-new-rounded" class="w-full h-full"/>
			</GenericNuxtLink>
			<GenericButton :buttonStyle="1" class="h-10 pl-1 pr-1 mr-2">
				Update Event
			</GenericButton>
			<GenericButton :buttonStyle="1" class="h-10 pl-1 pr-1" @click="deleteTournament">
				Delete Event
			</GenericButton>
		</div>
		<div class="flex h-0 mt-5 mb-5 bg-pink-500 border-2 border-pink-500"></div>
		<TournamentPreview/>
	</div>
</template>