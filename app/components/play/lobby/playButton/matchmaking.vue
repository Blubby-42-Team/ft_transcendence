<script setup lang="ts">
import { LobbyStartingSequence } from '#imports';

const { timeRemaining, sequence, start: startLobby, cancel } = useLocalLobbyStore();
const hoverButton = ref(false);
const etc = ref(0);

const dotdotdot = [
	'.',
	'..',
	'...',
]

async function start(){
	startLobby();
	
	etc.value = 0;
	while(sequence.value === LobbyStartingSequence.STARTING){
		etc.value++;
		if(etc.value >= dotdotdot.length){
			etc.value = 0;
		}
		await new Promise(resolve => setTimeout(resolve, 500));
	}
}

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
				Finding other players {{ dotdotdot[etc] }}
			</template>
			<template v-else>
				Cancel ({{ dotdotdot[etc] }})
			</template>
		</GenericButton>
	</template>
	<template v-else-if="sequence === LobbyStartingSequence.STARTED">
		<GenericButton class="w-full h-16 text-black" :buttonStyle="3" :selected="true" :disabled="true">
			Starting...
		</GenericButton>
	</template>
</template>
