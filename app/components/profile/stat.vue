<script setup lang="ts">

const props = defineProps({
	name: {
		type: String,
		required: false,
	},
	stat: {
		type: Object as PropType<{
			matchPlayed: number;
			ranking: number;
			winrate: number;
			averagePointPerGame: number;
		}>,
		required: true
	},
});


</script>

<template>
	<div class="grid grid-cols-[auto,auto]">
		<template v-if="props.name">
			<div class="flex items-center justify-center h-16 col-span-2 mb-2 overflow-hidden text-2xl border-b whitespace-nowrap border-text">{{ props.name }}</div>
		</template>
		<div class="flex items-center h-12 overflow-hidden whitespace-nowrap">Match Played</div>
		<div class="flex items-center justify-end h-12 overflow-hidden whitespace-nowrap">{{ props.stat.matchPlayed }}</div>
		<div class="flex items-center h-12 overflow-hidden whitespace-nowrap">Ranking</div>
		<div class="flex items-center justify-end h-12 overflow-hidden whitespace-nowrap">#1</div>
		<div class="flex items-center h-12 overflow-hidden whitespace-nowrap">MMR</div>
		<div class="flex items-center justify-end h-12 overflow-hidden whitespace-nowrap">{{ props.stat.ranking }}</div>
		<div class="flex items-center h-12 overflow-hidden whitespace-nowrap">Winrate</div>
		<div class="flex items-center justify-end h-12 overflow-hidden whitespace-nowrap">{{ props.stat.winrate }}%</div>
		<div class="flex items-center h-12 overflow-hidden whitespace-nowrap">Average Point</div>
		<div class="flex items-center justify-end h-12 overflow-hidden whitespace-nowrap">{{ props.stat.averagePointPerGame }}</div>
	</div>
</template>

<!-- 
nb partie jouee

nb partie gagne 
nb partie perdue
ratio
nb de point pris
nb de point recus
mmr -->