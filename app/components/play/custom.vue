<script setup lang="ts">

const { optionsList } = useGameStore()

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(4,auto)]"
		:class="css.has({
			'grid-cols-[max-content_repeat(4,auto)]': optionsList.numPlayer === 4,
			'grid-cols-[max-content_repeat(2,auto)]': optionsList.numPlayer === 2,
			'grid-cols-[max-content_repeat(1,auto)]': optionsList.numPlayer === 1,
		})"
	>
		<PlaySettings/>
		<template v-for="i in optionsList.numPlayer">
			<div class="w-full h-full p-2">
				<div class="w-full h-full border-4 bg-gradient-to-bl from-yellow-400 via-accent-color to-yellow-400 rounded-2xl border-color2">
					<div class="h-full p-2 bg-gradient-to-tl grid from-yellow-600 via-transparent to-yellow-600 grid-rows-[max-content_repeat(4,auto)] rounded-xl">
						<GenericProfilePicture imageSrc="/amogus.png" class="w-32 h-32"/>
						<div class="pt-2 text-2xl font-bold text-background2">James</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
