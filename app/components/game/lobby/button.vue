<script setup lang="ts">

import { LobbyStatus } from '#imports';

const props = defineProps({
	endFunc: {
		type: Function as PropType<() => void>,
		required: true,
	}
});

const { waitingString } = usePageStore();

const hoverButton = ref(false);
const timer = new SearchGame(props.endFunc);

</script>

<template>
	<template v-if="timer.status.value === LobbyStatus.NOT_STARTED">
		<GenericButton class="w-full h-16" :buttonStyle="1"
		@click="timer.play()"
		>
			Play
		</GenericButton>
	</template>
	<template v-else-if="timer.status.value === LobbyStatus.STARTING">
		<GenericButton class="w-full h-16 text-black hover:bg-opacity-70" :buttonStyle="3"
			:selected="true"
			@mouseover="hoverButton = false"
			@mouseleave="hoverButton = true"
			@click="timer.cancel()"
		>
			<template v-if="hoverButton">
				Finding other players {{ waitingString }}
			</template>
			<template v-else>
				Cancel ({{ waitingString }})
			</template>
		</GenericButton>
	</template>
	<template v-else-if="timer.status.value === LobbyStatus.STARTED">
		<GenericButton class="w-full h-16 text-black" :buttonStyle="3" :selected="true" :disabled="true">
			Starting...
		</GenericButton>
	</template>
</template>
