<script lang="ts" setup>

import { format } from 'date-fns'


</script>

<template>
	<div class="bg-background1 border-4 border-color1 text-text rounded-2xl grid grid-cols-[max-content_max-content_max-content] overflow-hidden gap-3 p-5">
		<button class="flex flex-col items-center p-2 hover:bg-color1 hover:bg-opacity-30 rounded-xl">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl">James</div>
		</button>
		<div class="flex flex-col items-center justify-center h-full">
			<div>Classic</div>
			<div class="text-9xl">8-10</div>
			<div>{{ format(new Date(), "dd MMMM HH:MM") }}</div>
		</div>
		<button class="flex flex-col items-center p-2 hover:bg-color1 hover:bg-opacity-30 rounded-xl">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl">Karen69420</div>
		</button>

		<div class="h-4 col-span-3"></div>
		
		<div class="text-right">42</div>
		<div class="text-center">Match Player</div>
		<div class="">632</div>

		<div class="text-right">#32</div>
		<div class="text-center">Ranking</div>
		<div class="">#12</div>

		<div class="text-right">872</div>
		<div class="text-center">MMR</div>
		<div class="">1253</div>

		<div class="text-right">76%</div>
		<div class="text-center">Winrate</div>
		<div class="">43%</div>

		<div class="text-right">7.764</div>
		<div class="text-center">Average Point</div>
		<div class="">8.122</div>
	</div>
</template>