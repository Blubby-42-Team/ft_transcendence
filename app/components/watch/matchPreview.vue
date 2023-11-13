<script setup lang='ts'>

const { match } = defineProps({
	match: {
		type: Object as () => ILazyTournamentMatch,
		required: true,
	},
})

</script>

<template>
	<div class="bg-background2 border-4 border-background1 rounded-2xl grid grid-cols-[max-content_max-content_max-content] overflow-hidden gap-3 p-5">
		<div class="flex flex-col items-center p-2">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl">James</div>
		</div>
		<div class="flex flex-col items-center">
			<div class="flex ">FacePong League</div>
			<div class="flex text-9xl">1-2</div>
			<div class="flex p-1 border rounded text-liveGameColor border-liveGameColor bg-liveGameColor bg-opacity-10">● Live </div>
		</div>
		<div class="flex flex-col items-center p-2">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl">James</div>
		</div>
		<div class="text-right">17.36</div>
		<div class="text-center">Average Ball per Game</div>
		<div class="">15.86</div>
		<div class="text-right">64%</div>
		<div class="text-center">Winrate</div>
		<div class="">43%</div>
	</div>
</template>
