<script setup lang="ts">

const { gameSettings } = useGameStore()

const props = defineProps({
	preview: {
		type: Boolean,
		default: true,		
	},
})

const isHost = ref(false)

function updatePadSize(delta: number){
	if (0 < gameSettings.value.padSize + delta && gameSettings.value.padSize + delta <= 10){
		gameSettings.value.padSize += delta
	}
}

function updateBallSize(delta: number){
	if (0 < gameSettings.value.ballSize + delta && gameSettings.value.ballSize + delta <= 10){
		gameSettings.value.ballSize += delta
	}
}

function updateRounds(delta: number){
	if (0 < gameSettings.value.maxPoint + delta && gameSettings.value.maxPoint + delta <= 10){
		gameSettings.value.maxPoint += delta
	}
}

function updateRandomizer() {
	gameSettings.value.randomizer = !gameSettings.value.randomizer
}

const difficulties = [
	{ name: BotDifficulty.NORMAL,	icon: 'material-symbols:sentiment-neutral' },
	{ name: BotDifficulty.HARD,		icon: 'material-symbols:sentiment-dissatisfied' },
	{ name: BotDifficulty.CRAZY,	icon: 'material-symbols:sentiment-extremely-dissatisfied' },
]

</script>

<template>
	<div class="grid grid-rows-[max-content_max-content_auto_max-content] border-r-4 w-96 bg-pink-500 border-pink-500">
		<div class="w-full p-2 text-3xl text-center bg-pink-500">Settings</div>
		<div class="grid grid-cols-[auto,5rem,3rem,3rem,3rem] p-1 gap-1 w-full">
			<div class="flex items-center h-full col-span-2">Number of Players</div>
			<GenericButton :buttonStyle="1" :disabled="!isHost" :selected="gameSettings.numPlayer === 1" class="w-full h-12" @click="() => gameSettings.numPlayer = 1"><Icon name="material-symbols:looks-one" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" :disabled="!isHost" :selected="gameSettings.numPlayer === 2" class="w-full h-12" @click="() => gameSettings.numPlayer = 2"><Icon name="material-symbols:looks-two" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" :disabled="!isHost" :selected="gameSettings.numPlayer === 4" class="w-full h-12" @click="() => gameSettings.numPlayer = 4"><Icon name="material-symbols:looks-4" class="w-full h-full"/></GenericButton>

			<div class="flex items-center h-full col-span-2">Max Round</div>
			<div class="flex items-center h-full">{{ gameSettings.maxPoint }}</div>
			<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12" @click="updateRounds(1)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12" @click="updateRounds(-1)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

			<div class="flex items-center h-full col-span-2">Ball Size</div>
			<div class="flex items-center h-full"><span v-if="!gameSettings.randomizer">{{ gameSettings.ballSize }}x</span></div>
			<GenericButton :buttonStyle="1" :disabled="gameSettings.randomizer || !isHost" class="w-full h-12" @click="updateBallSize(0.5)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" :disabled="gameSettings.randomizer || !isHost" class="w-full h-12" @click="updateBallSize(-0.5)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

			<div class="flex items-center h-full col-span-2">Pad Size</div>
			<div class="flex items-center h-full"><span v-if="!gameSettings.randomizer">{{ gameSettings.padSize }}x</span></div>
			<GenericButton :buttonStyle="1" :disabled="gameSettings.randomizer || !isHost" class="w-full h-12" @click="updatePadSize(1)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
			<GenericButton :buttonStyle="1" :disabled="gameSettings.randomizer || !isHost" class="w-full h-12" @click="updatePadSize(-1)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

			<div class="flex items-center h-full col-span-4">Activate Randomizer</div>
			<GenericButton :buttonStyle="1" :selected="gameSettings.randomizer" :disabled="!isHost" class="w-full h-12" @click="updateRandomizer">
				<Icon v-if="gameSettings.randomizer" name="material-symbols:check-box" class="w-full h-full"/>
				<Icon v-else name="material-symbols:check-box-outline-blank" class="w-full h-full"/>
			</GenericButton>
			
			<div class="flex items-center h-full col-span-2">Bot Difficulty</div>
			<template v-for="difficulty in difficulties">
				<GenericButton :buttonStyle="1" class="w-full h-12"
					:disabled="!isHost || gameSettings.numPlayer !== 1"
					:selected="gameSettings.mode === difficulty.name && gameSettings.numPlayer === 1"
					@click="() => gameSettings.mode = difficulty.name"
				>
					<Icon :name="difficulty.icon" class="w-full h-full"/>
				</GenericButton>
			</template>
		</div>
		
		<div class="p-5">
			<template v-if="props.preview">
				<GamePreviewCanvas uniqueToken="previewSettings"/>
			</template>
		</div>

		<div class="w-full p-2">
			<GenericButton :button-style="1" class="flex w-full p-2" @click="() => isHost = !isHost">Play</GenericButton>
		</div>
	</div>
</template>
