<script setup lang="ts">

const { optionsList } = useGameStore()

const isHost = ref(false)

function updatePadSize(delta: number){
	if (0 < optionsList.value.padSize + delta && optionsList.value.padSize + delta < 300){
		optionsList.value.padSize += delta
	}
}

function updateBallSize(delta: number){
	if (5 < optionsList.value.ballSize + delta && optionsList.value.ballSize + delta < 55){
		optionsList.value.ballSize += delta
	}
}

function updateRounds(delta: number){
	if (0 < optionsList.value.maxPoint + delta && optionsList.value.maxPoint + delta < 11){
		optionsList.value.maxPoint += delta
	}
}

const difficulties = [
	{ name:'easy', icon: 'material-symbols:sentiment-neutral' },
	{ name:'hard', icon: 'material-symbols:sentiment-dissatisfied' },
	{ name:'crazy', icon: 'material-symbols:sentiment-extremely-dissatisfied' },
]

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(4,auto)]">
		<div class="grid grid-rows-[max-content_max-content_auto_max-content] border-r-4 w-96 bg-color2 border-color3">
			<div class="w-full p-2 text-3xl text-center bg-color3">Settings</div>
			<div class="grid grid-cols-[auto,5rem,3rem,3rem,3rem] p-1 gap-1 w-full">
				<div class="flex items-center h-full col-span-2">Number of Players</div>
				<GenericButton :buttonStyle="1" :disabled="!isHost" :selected="optionsList.numPlayer === 1" class="w-full h-12" @click="() => optionsList.numPlayer = 1"><Icon name="material-symbols:looks-one" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="!isHost" :selected="optionsList.numPlayer === 2" class="w-full h-12" @click="() => optionsList.numPlayer = 2"><Icon name="material-symbols:looks-two" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="!isHost" :selected="optionsList.numPlayer === 4" class="w-full h-12" @click="() => optionsList.numPlayer = 4"><Icon name="material-symbols:looks-4" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-2">Max Round</div>
				<div class="flex items-center h-full">{{ optionsList.maxPoint }}</div>
				<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12" @click="updateRounds(1)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12" @click="updateRounds(-1)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-2">Ball Size</div>
				<div class="flex items-center h-full"><span v-if="!optionsList.randomizer">{{ optionsList.ballSize / 10}}x</span></div>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12" @click="updateBallSize(5)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12" @click="updateBallSize(-5)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-2">Pad Size</div>
				<div class="flex items-center h-full"><span v-if="!optionsList.randomizer">{{ optionsList.padSize / 100 }}x</span></div>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12" @click="updatePadSize(50)"> <Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12" @click="updatePadSize(-50)"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-4">Activate Randomizer</div>
				<GenericButton :buttonStyle="1" :selected="optionsList.randomizer" :disabled="!isHost" class="w-full h-12" @click="() => optionsList.randomizer = !optionsList.randomizer">
					<Icon v-if="optionsList.randomizer" name="material-symbols:check-box" class="w-full h-full"/>
					<Icon v-else name="material-symbols:check-box-outline-blank" class="w-full h-full"/>
				</GenericButton>
				
				<div class="flex items-center h-full col-span-2">Bot Difficulty</div>
				<template v-for="difficulty in difficulties">
					<GenericButton :buttonStyle="1" class="w-full h-12"
						:disabled="!isHost || optionsList.numPlayer !== 1"
						:selected="optionsList.mode === difficulty.name  && optionsList.numPlayer === 1"
						@click="() => optionsList.mode = difficulty.name"
					>
						<Icon :name="difficulty.icon" class="w-full h-full"/>
					</GenericButton>
				</template>
			</div>
			
			<div class="p-5">
				<GamePreviewCanvas/>
			</div>

			<div class="w-full p-2">
				<GenericButton :button-style="1" class="flex w-full p-2" @click="() => isHost = !isHost">Play</GenericButton>
			</div>
		</div>
		<div class="p-5 bg-yellow-400">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-yellow-500">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-yellow-600">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-yellow-700">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
	</div>
</template>
