<script lang="ts" setup>

import { format } from 'date-fns'

// TODO Deferinceate between if match is mine or other and remove hover effect if yes

const personInteractionRef = ref();

</script>

<template>
	<div class="bg-background1 border-4 grid-flow-col border-color1 text-text rounded-2xl grid grid-rows-[repeat(6,max-content)] overflow-hidden gap-3 p-5">
		<button class="flex flex-col items-center p-2 hover:bg-color1 hover:bg-opacity-30 rounded-xl">
			<GenericProfilePicture class="w-32 h-32" imageSrc="/pp.png"/>
			<div class="pt-2 text-xl">James</div>
		</button>
		<div class="pt-5 text-right">42</div>
		<div class="text-right">#32</div>
		<div class="text-right">872</div>
		<div class="text-right">76%</div>
		<div class="text-right">7.764</div>

		<div class="flex flex-col items-center justify-center h-full">
			<div>Classic</div>
			<div class="text-9xl">8-10</div>
			<div>{{ format(new Date(), "dd MMMM HH:MM") }}</div>
		</div>
		
		<div class="pt-5 text-center">Match Player</div>
		<div class="text-center">Ranking</div>
		<div class="text-center">MMR</div>
		<div class="text-center">Winrate</div>
		<div class="text-center">Average Point</div>
				
		<button class="flex flex-col items-center p-2 hover:bg-color1 hover:bg-opacity-30 rounded-xl"
			@click.stop="personInteractionRef.open"
		>
			<GenericProfilePicture class="w-32 h-32" imageSrc="/pp.png"/>
			<div class="pt-2 text-xl">Karen69420</div>
			<GenericContextMenu ref="personInteractionRef">
				<InteractionsNonFriend/>
			</GenericContextMenu>
		</button>
		<div class="pt-5">632</div>
		<div class="">#12</div>
		<div class="">1253</div>
		<div class="">43%</div>
		<div class="">8.122</div>
	</div>
</template>