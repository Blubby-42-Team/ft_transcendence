<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number,
		required: true
	},
});

import { format } from 'date-fns'

const stats = {
	classic: {
		matchPlayed: 42,
		ranking: 872,
		winrate: 76,
		averagePointPerGame: 42,
	},
	random: {
		matchPlayed: 1,
		ranking: 423,
		winrate: 0,
		averagePointPerGame: 42,
	},
}

</script>

<template>
	<div class="grid h-full grid-cols-2 grid-rows-[max-content,max-content,1fr]">
		<div class="flex justify-center p-5 overflow-hidden h-max w-max">
			<GenericProfilePicture imageSrc="/amogus.png" class="w-64 h-64"/>
		</div>
		<div class="grid grid-cols-[3rem,auto] grid-rows-5">
			<div class="col-span-2"></div>
			<div class="self-center col-span-2 p-2 text-4xl ">Jamie</div>
			<div class="text-text-custom"><Icon name="material-symbols:person" class="w-full h-full"/></div>
			<div class="self-center ">James Milwaukee</div>
			<div class="p-2 text-text-custom"><Icon name="42" class="w-full h-full"/></div>
			<div class="self-center p-2 ">JMilwaukee</div>
		</div>
		<div class="col-span-2 pb-5">
			<div class="grid w-full grid-cols-[1fr,2rem,1fr] h-max">
				<ProfileStat name="Classic" :stat="stats.classic"/>
				<br>
				<ProfileStat name="Random" :stat="stats.random"/>
			</div>
		</div>
		<div class="h-full col-span-2 overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 scrollbar-thumb-rounded-full scrollbar-track">
			<div class="grid w-full grid-rows-[3rem] grid-cols-[2rem,auto,auto,auto,6rem]">
				<div class="sticky top-0 flex items-center justify-center h-12 border-b border-text border-opacity-30 bg-background1"></div>
				<div class="sticky top-0 flex items-center justify-center h-12 border-b border-text border-opacity-30 bg-background1">Date</div>
				<div class="sticky top-0 flex items-center justify-center h-12 border-b border-text border-opacity-30 bg-background1">Adversary</div>
				<div class="sticky top-0 flex items-center justify-center h-12 col-span-2 border-b border-text border-opacity-30 bg-background1">Score</div>
				<template v-for="i in 10">
					<div class="flex items-center justify-center h-12 overflow-hidden border-t whitespace-nowrap border-text border-opacity-30"><Icon name="material-symbols:shuffle" class="w-full h-full text-text-custom"/></div>
					<div class="flex items-center justify-center h-12 px-5 overflow-hidden border-t whitespace-nowrap border-text border-opacity-30"><ClientOnly>{{ format(new Date(), "dd MMM HH:MM") }}</ClientOnly></div>
					<div class="flex items-center h-12 px-5 overflow-hidden truncate border-t whitespace-nowrap border-text border-opacity-30">Karen69420</div>
					<div class="flex items-center justify-end h-12 px-5 overflow-hidden truncate border-t whitespace-nowrap border-text border-opacity-30">3-10</div>
					<div class="flex items-center h-12 overflow-hidden truncate border-t whitespace-nowrap border-text border-opacity-30"><Icon name="material-symbols:trophy" class="w-10 h-10 text-text-custom"/></div>
				</template>
			</div>
		</div>
	</div>
</template>