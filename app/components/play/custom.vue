<script setup lang="ts">

const { optionsList } = useGameStore()

const isHost = ref(false)

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(4,auto)]">
		<div class="grid grid-rows-[max-content_max-content_auto_max-content] border-r-4 w-96 bg-color2 border-color3">
			<div class="w-full p-2 text-3xl text-center bg-color3">Settings</div>
			<div class="grid grid-cols-[auto,5rem,3rem,3rem,3rem] p-1 gap-1 w-full">
				<div class="flex items-center h-full col-span-2">Number of Players</div>
				<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12"><Icon name="material-symbols:looks-one" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12"><Icon name="material-symbols:looks-two" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12"><Icon name="material-symbols:looks-4" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-2">Max Round</div>
				<div class="flex items-center h-full">{{ optionsList.maxPoint }}</div>
				<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12"><Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="!isHost" class="w-full h-12"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-2">Ball Size</div>
				<div class="flex items-center h-full"><span v-if="!optionsList.randomizer">{{ optionsList.ballSize / 10}}x</span></div>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12"><Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-2">Pad Size</div>
				<div class="flex items-center h-full"><span v-if="!optionsList.randomizer">{{ optionsList.padSize / 100 }}x</span></div>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12"><Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" :disabled="optionsList.randomizer || !isHost" class="w-full h-12"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>

				<div class="flex items-center h-full col-span-4">Activate Randomizer</div>
				<GenericButton :buttonStyle="1" :selected="optionsList.randomizer" :disabled="!isHost" class="w-full h-12" @click="() => optionsList.randomizer = !optionsList.randomizer">
					<Icon v-if="optionsList.randomizer" name="material-symbols:check-box" class="w-full h-full"/>
					<Icon v-else name="material-symbols:check-box-outline-blank" class="w-full h-full"/>
				</GenericButton>
				
				<div class="flex items-center h-full col-span-2">Bot Difficulty</div>
				<GenericButton :buttonStyle="1" class="w-full h-12" :disabled="!isHost" :selected="optionsList.mode === 'easy'"  @click="() => optionsList.mode = 'easy'"> <Icon name="material-symbols:sentiment-neutral" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" class="w-full h-12" :disabled="!isHost" :selected="optionsList.mode === 'hard'"  @click="() => optionsList.mode = 'hard'"> <Icon name="material-symbols:sentiment-dissatisfied" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" class="w-full h-12" :disabled="!isHost" :selected="optionsList.mode === 'crazy'" @click="() => optionsList.mode = 'crazy'"><Icon name="material-symbols:sentiment-extremely-dissatisfied" class="w-full h-full"/></GenericButton>
			</div>
			{{ isHost }}
			<!-- <client-only placeholder="loading...">
				<GamePreviewCanvas/>
			</client-only> -->

			<div class="w-full p-2">
				<GenericButton :button-style="1" class="flex w-full p-2"
					@click="() => { isHost = !isHost; console.log(isHost) }"
				>
					Play
				</GenericButton>
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
