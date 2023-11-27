<script setup lang="ts">

import { CardType } from '#imports'

const props = defineProps({
	type: {
		type: Number as PropType<CardType>,
    	required: true
	},
})

</script>

<template>
	<div class="relative w-full h-full">
		<transition name="flip" mode="in-out">
			<div v-if="props.type === CardType.EMPTY" class="absolute w-full h-full align-top card">
				<div class="w-full h-full overflow-hidden border-4 border-color2 bg-color1 text-color2 rounded-2xl">
					<Icon name="material-symbols:account-circle" class="w-full h-full"/>
				</div>
			</div>
			<div v-else-if="props.type === CardType.ADD" class="absolute w-full h-full align-top card">
				<GenericButton class="w-full h-full overflow-hidden border-4 text-color2 bg-color1 border-color2 hover:bg-opacity-80 rounded-2xl">
					<Icon name="material-symbols:add" class="w-full h-full"/>
				</GenericButton>
			</div>
			<div v-else-if="props.type === CardType.PLAYER" class="absolute w-full h-full align-top card">
				<div class="w-full h-full overflow-hidden border-4 bg-gradient-to-bl from-yellow-400 via-accent1 to-yellow-400 rounded-2xl border-accent1">
					<div class="h-full w-full p-2 bg-gradient-to-tl grid from-yellow-600 via-transparent to-yellow-600 grid-rows-[9rem_max-content_repeat(4,auto)] rounded-xl justify-items-center">
						<GenericProfilePicture imageSrc="/amogus.png" class="w-32 h-32"/>
						<div class="flex w-full pt-2 overflow-hidden text-2xl font-bold truncate text-text">James Milwaukee</div>
					</div>
				</div>
			</div>
		</transition>
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
