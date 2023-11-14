<script setup lang="ts">

const playerList = [
	'James iewweawewsertrwa',
	'Alexei iewweawewsertrwa',
	null,
	null,
];

let isFront = ref(true);

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_auto]">
		<PlaySettings/>
		<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
			<template v-for="i in 4">
				<div class="p-4">
					<div class="relative w-full h-full">
						<transition name="flip" mode="in-out">
							<div v-if="isFront" class="absolute w-full h-full align-top card" @click="() => isFront = !isFront">
								<div class="w-full h-full border-4 bg-gradient-to-bl from-yellow-400 via-accent-color to-yellow-400 rounded-2xl border-color2">
									<div class="h-full w-full p-2 bg-gradient-to-tl grid from-yellow-600 via-transparent to-yellow-600 grid-rows-[9rem_max-content_repeat(4,auto)] rounded-xl justify-items-center">
										<GenericProfilePicture imageSrc="/amogus.png" class="w-32 h-32"/>
										<div class="flex w-full pt-2 overflow-hidden text-2xl font-bold truncate text-background2">James iyaweiyawhjewerreerer</div>
									</div>
								</div>
							</div>
							<div v-else class="absolute w-full h-full align-top bg-green-500 card" @click="() => isFront = !isFront">
								HELLO
							</div>
						</transition>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style>

.card {
	backface-visibility: hidden;
	transition: transform 1s;
}

.flip-enter-active {
	transform: rotateY(-180deg);
}

.flip-enter {
	transform: rotateY(-180deg);
}

.flip-leave-active {
	transform: rotateY(180deg);
}

.flip-leave{
	transform: rotateY(180deg);
}

</style>
