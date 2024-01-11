<script setup lang="ts">

import { CardType } from '#imports'

const props = defineProps({
	id: {
		type: Number,
    	required: true,
	},
	card: {
		type: Number as PropType<CardType>,
		required: true,
	},
})

const refInvitePlayerToLobby = ref()

</script>

<template>
	<div class="p-2">
		<div class="relative w-full h-full">
			<transition name="flip" mode="in-out">
				<div v-if="props.card === CardType.EMPTY" class="absolute w-full h-full align-top card">
					<div class="w-full h-full overflow-hidden border-4 border-color2 bg-color1 text-color2 rounded-2xl">
						<Icon name="material-symbols:account-circle" class="w-full h-full"/>
					</div>
				</div>
				<div v-else-if="props.card === CardType.ADD" class="absolute w-full h-full align-top card">
					<GenericButton class="w-full h-full overflow-hidden border-4 text-color2 bg-color1 border-color2 hover:bg-opacity-80 rounded-2xl"
						@click="refInvitePlayerToLobby?.open"
					>
						<Icon name="material-symbols:add" class="w-full h-full"/>
					</GenericButton>
					<GenericModal ref="refInvitePlayerToLobby">
						<GameLobbyInvite :closeFunc="refInvitePlayerToLobby?.close"/>
					</GenericModal>
				</div>
				<div v-else-if="props.card === CardType.PLAYER" class="absolute w-full h-full align-top card">
					<GameLobbyCardPlayer :userId="props.id"/>
				</div>
				<div v-else-if="props.card === CardType.COMING1" class="absolute w-full h-full align-top card">
					<div class="grid w-full h-full overflow-hidden border-4 rounded-2xl text-background2 bg-background1 border-background1 bg-opacity-80 place-content-center">
						<div class="flex justify-center text-4xl -rotate-45 select-none text-color2">Coming Soon</div>
					</div>
				</div>
				<div v-else-if="props.card === CardType.COMING2" class="absolute w-full h-full align-top card">
					<div class="flex w-full h-full overflow-hidden border-4 text-background2 bg-background1 border-background1 bg-opacity-80 rounded-2xl">
						<Icon name="material-symbols:account-circle" class="w-full h-full"/>
					</div>
				</div>
			</transition>
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
