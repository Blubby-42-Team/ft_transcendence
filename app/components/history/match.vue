<script lang="ts" setup>

import { format } from 'date-fns'

const props = defineProps({
	userId: {
		type: Number,
		required: true,
	},
	match: {
		type: Object as PropType<IHistory>,
		required: true,
	},
})

const { getUser, fetchUser, fetchStat, getStat, primaryUser } = useUserStore();
const user1 = getUser(computed(() => props.userId));
const user2 = getUser(computed(() => props.match.adversary));
const stat1 = getStat(computed(() => props.userId));
const stat2 = getStat(computed(() => props.match.adversary));
await fetchUser(props.userId);
await fetchUser(props.match.adversary);
await fetchStat(props.userId);
await fetchStat(props.match.adversary);


// TODO Deferinceate between if match is mine or other and remove hover effect if yes
</script>

<template>
	<div class="bg-background1 border-4 grid-flow-col border-color1 text-text rounded-2xl grid grid-rows-[repeat(6,max-content)] overflow-hidden gap-3 p-5">
		<div class="flex flex-col items-center p-2 rounded-xl">
			<GenericProfilePicture class="w-32 h-32" :imageSrc="user1.avatar"/>
			<div class="pt-2 text-xl">{{ user1.name }}</div>
		</div>
		<div class="pt-5 text-right">{{ stat1.classic.matchPlayed }}</div>
		<div class="text-right">#{{ stat1.classic.ranking }}</div>
		<div class="text-right">{{ stat1.classic.mmr }}</div>
		<div class="text-right">{{ stat1.classic.winrate }}%</div>
		<div class="text-right">{{ stat1.classic.averagePointPerGame }}</div>

		<div class="flex flex-col items-center justify-center h-full">
			<div>Classic</div>
			<div class="text-9xl">{{ match.score }}-{{ match.scoreAdv }}</div>
			<div>{{ format(match.date, "dd MMMM HH:mm") }}</div>
		</div>
		
		<div class="pt-5 text-center">Match Played</div>
		<div class="text-center">Ranking</div>
		<div class="text-center">MMR</div>
		<div class="text-center">Winrate</div>
		<div class="text-center">Average Point</div>
				
		<div class="flex flex-col items-center p-2 rounded-xl">
			<GenericProfilePicture class="w-32 h-32" :imageSrc="user2.avatar"/>
			<div class="pt-2 text-xl">{{ user2.name }}</div>
		</div>
		<div class="pt-5">{{ stat2.classic.matchPlayed }}</div>
		<div class="">#{{ stat2.classic.ranking }}</div>
		<div class="">{{ stat2.classic.mmr }}</div>
		<div class="">{{ stat2.classic.winrate }}%</div>
		<div class="">{{ stat2.classic.averagePointPerGame }}</div>
	</div>
</template>