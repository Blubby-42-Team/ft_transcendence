<script setup lang="ts">
import { LobbyStartingSequence } from '#imports';

const { timeRemaining, sequence, start, cancel } = useLobbyStore();
const hoverButton = ref(false);

</script>

<template>
	<template v-if="sequence === LobbyStartingSequence.NOT_STARTED">
		<GenericButton class="w-full h-16" :buttonStyle="1"
			@click="start"
		>
			Play
		</GenericButton>
	</template>
	<template v-else-if="sequence === LobbyStartingSequence.STARTING">
		<GenericButton class="w-full h-16 text-black hover:bg-opacity-70" :buttonStyle="3"
			:selected="true"
			@mouseover="hoverButton = false"
			@mouseleave="hoverButton = true"
			@click="cancel"
		>
			<template v-if="hoverButton">
				Starting in {{ timeRemaining }}
			</template>
			<template v-else>
				Cancel ({{ timeRemaining }})
			</template>
		</GenericButton>
	</template>
	<template v-else-if="sequence === LobbyStartingSequence.STARTED">
		<GenericButton class="w-full h-16 text-black" :buttonStyle="3" :selected="true" :disabled="true">
			Starting...
		</GenericButton>
	</template>
</template>
