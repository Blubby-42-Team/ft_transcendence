<script setup lang="ts">

const { primaryUser, fetchPrimaryUser } = useUserStore();

const defaultSettings = {
	maxPoint:			2,
	numPlayer:			2,
	ballSize:			1,
	padSize:			5,
	mode:				BotDifficulty.NORMAL,
	randomizer:			false,
	initialBallSpeed:	0.5,
	speedAcceleration:	0.1,
};

const settings = useState<gameSettingsType>('settings', () => defaultSettings);

await fetchPrimaryUser();

const props = defineProps({
	preview: {
		type: Boolean,
		default: true,
	},
})

function updatePadSize(delta: number){
	if (0 < settings.value.padSize + delta && settings.value.padSize + delta <= 10){
		settings.value.padSize += delta
	}
}

function updateBallSize(delta: number){
	if (0 < settings.value.ballSize + delta && settings.value.ballSize + delta <= 10){
		settings.value.ballSize += delta
	}
}

function updateRounds(delta: number){
	if (0 < settings.value.maxPoint + delta && settings.value.maxPoint + delta <= 10){
		settings.value.maxPoint += delta
	}
}

function createLobby(){
	fetchCreateCustomLobby(
		primaryUser.value.id,
		settings.value.maxPoint,
		settings.value.ballSize,
		settings.value.padSize,
		(lobbyId) => {
			if (typeof lobbyId === 'string'){
				navigateTo(`/lobby/custom/${lobbyId}`);
			}
		},
	)
};


</script>

<template>
	<div class="grid grid-rows-[max-content_auto_max-content] w-96 bg-background1">
		<div class="grid grid-cols-[auto,5rem,3rem,3rem,3rem] p-1 gap-1 w-full">
			<div class="flex items-center h-full col-span-2">Max Round</div>
			<div class="flex items-center h-full">{{ settings.maxPoint }}</div>
			<GenericButton :buttonStyle="1" class="w-full h-12" @click="updateRounds(1)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" class="w-full h-12" @click="updateRounds(-1)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

			<div class="flex items-center h-full col-span-2">Ball Size</div>
			<div class="flex items-center h-full"><span v-if="!settings.randomizer">{{ settings.ballSize }}x</span></div>
			<GenericButton :buttonStyle="1" :disabled="settings.randomizer" class="w-full h-12" @click="updateBallSize(0.5)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" :disabled="settings.randomizer" class="w-full h-12" @click="updateBallSize(-0.5)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

			<div class="flex items-center h-full col-span-2">Pad Size</div>
			<div class="flex items-center h-full"><span v-if="!settings.randomizer">{{ settings.padSize }}x</span></div>
			<GenericButton :buttonStyle="1" :disabled="settings.randomizer" class="w-full h-12" @click="updatePadSize(1)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" :disabled="settings.randomizer" class="w-full h-12" @click="updatePadSize(-1)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>
		</div>
		
		<div class="p-5">
			<template v-if="props.preview">
				<GameInstancePreview uniqueToken="previewSettings"/>
			</template>
		</div>

		<div class="w-full p-2">
			<GenericButton class="w-full h-16" :buttonStyle="1"
				@click="createLobby"
			>
				Create Lobby
			</GenericButton>
		</div>
	</div>
</template>
