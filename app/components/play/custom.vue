<script setup lang="ts">

const { optionsList } = useGameStore()

const test = [
	{ name: 'James iewweawewsertrwa', profilepic: '/amogus.png' },
	{ name: 'James iewweawewsertrwa', profilepic: '/amogus.png' },
];

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_auto]">
		<PlaySettings/>
		<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
			<template v-for="i in optionsList.numPlayer">
				<div class="w-full h-full p-2">
					<div class="w-full h-full border-4 bg-gradient-to-bl from-yellow-400 via-accent-color to-yellow-400 rounded-2xl border-color2">
						<div class="h-full w-full p-2 bg-gradient-to-tl grid from-yellow-600 via-transparent to-yellow-600 grid-rows-[9rem_max-content_repeat(4,auto)] rounded-xl justify-items-center">
							<GenericProfilePicture imageSrc="/amogus.png" class="w-32 h-32"/>
							<div class="flex w-full pt-2 overflow-hidden text-2xl font-bold truncate text-background2">James iyaweiyawhjewerreerer</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
