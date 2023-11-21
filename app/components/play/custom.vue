<script setup lang="ts">



let isFront = useState(() => [1, 0, 0, 0]);

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_auto]">
		<PlaySettings/>
		<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
			<template v-for="i in 4">
				<div class="p-4">
					<div class="relative w-full h-full">
						<transition name="flip" mode="in-out">
							<div v-if="isFront[i - 1] === 1" class="absolute w-full h-full align-top card">
								<div class="w-full h-full border-4 bg-gradient-to-bl from-yellow-400 via-accent-color to-yellow-400 rounded-2xl border-color2">
									<div class="h-full w-full p-2 bg-gradient-to-tl grid from-yellow-600 via-transparent to-yellow-600 grid-rows-[9rem_max-content_repeat(4,auto)] rounded-xl justify-items-center">
										<GenericProfilePicture imageSrc="/amogus.png" class="w-32 h-32"/>
										<div class="flex w-full pt-2 overflow-hidden text-2xl font-bold truncate text-background2">James Milwaukee</div>
									</div>
								</div>
							</div>
							<div v-else-if="isFront[i - 1] === 0" class="absolute w-full h-full align-top card">
								<GenericButton
									class="w-full h-full border-4 bg-background3 hover:bg-color2 rounded-2xl border-color2"
									@click="() => isFront[i - 1] = 1"
								>
									<Icon name="material-symbols:add" class="w-full h-full text-color3"/>
								</GenericButton>
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
