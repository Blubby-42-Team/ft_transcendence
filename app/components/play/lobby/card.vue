<script setup lang="ts">

import { CardType } from '#imports'

const props = defineProps({
	type: {
		type: Number as PropType<CardType>,
    	required: true
	},
})

const { getUser, getStats, getHistory } = useUserStore();
const user = getUser(42);
const stats = getStats(42);

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
				<PlayLobbyPlayerCard/>
			</div>
			<div v-else-if="props.type === CardType.COMING1" class="absolute w-full h-full align-top card">
				<div class="grid w-full h-full overflow-hidden border-4 rounded-2xl text-background2 bg-background1 border-background1 bg-opacity-80 place-content-center">
					<div class="flex justify-center text-4xl -rotate-45 select-none text-color2">Coming Soon</div>
				</div>
			</div>
			<div v-else-if="props.type === CardType.COMING2" class="absolute w-full h-full align-top card">
				<div class="flex w-full h-full overflow-hidden border-4 text-background2 bg-background1 border-background1 bg-opacity-80 rounded-2xl">
					<Icon name="material-symbols:account-circle" class="w-full h-full"/>
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
