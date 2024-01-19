<script setup lang="ts">

import { ELobbyStatus } from '#imports';

const props = defineProps({
	endFunc: {
		type: Function as PropType<() => void>,
		required: true,
	}
});

const { waitingString } = storeToRefs(usePageStore());

const hoverButton = ref(false);
const lobbyStore = useLobbyStore();
const { startMatchMaking, cancelMatchMaking } = lobbyStore;
const { status } = toRefs(lobbyStore);

</script>

<template>
	<template v-if="status === ELobbyStatus.NoLobby">
		<GenericButton class="w-full h-16" :buttonStyle="1"
		@click="startMatchMaking"
		>
			Play
		</GenericButton>
	</template>
	<template v-else-if="status === ELobbyStatus.InQueue">
		<GenericButton class="w-full h-16 text-black hover:bg-opacity-70" :buttonStyle="3"
			:selected="true"
			@mouseover="hoverButton = false"
			@mouseleave="hoverButton = true"
			@click="cancelMatchMaking"
		>
			<template v-if="hoverButton">
				Finding other players {{ waitingString }}
			</template>
			<template v-else>
				Cancel ({{ waitingString }})
			</template>
		</GenericButton>
	</template>
	<template v-else-if="status === ELobbyStatus.WaitingForPlayers">
		<GenericButton class="w-full h-16 text-black" :buttonStyle="3" :selected="true" :disabled="true">
			Starting...
		</GenericButton>
	</template>
</template>
