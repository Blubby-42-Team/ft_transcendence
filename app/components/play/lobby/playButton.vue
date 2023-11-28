<script setup lang="ts">
import { LobbyStartingSequence } from '#imports';

const props = defineProps({
	sequence: {
		type: Number as PropType<LobbyStartingSequence>,
    	required: true
	},
	timeRemaining: {
		type: Number,
    	required: true
	},
})

const test2 = ref(false);
const hoverButton = ref(false);

</script>

<template>
	<template v-if="!test2">
		<GenericButton class="w-full h-16" :buttonStyle="1"
			@click="() => test2 = true"
		>
			Play
		</GenericButton>
	</template>
	<template v-else>
		<GenericButton class="w-full h-16 hover:bg-accent1 hover:bg-opacity-70" :buttonStyle="1"
			:selected="true"
			@mouseover="hoverButton = true"
			@mouseleave="hoverButton = false"
			@click="() => test2 = false"
		>
			<template v-if="hoverButton">
				Starting in {{ props.timeRemaining }}
			</template>
			<template>
				Cancel
			</template>
		</GenericButton>
	</template>
</template>
