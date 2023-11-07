<script lang="ts" setup>

definePageMeta({name: 'Game'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })


const modes = ['Local', 'Classic', 'Random', 'Custom']
const selectedMode = useState('selectedMode', () => modes[0]);

</script>

<template>
	<div class="grid h-full grid-rows-[4rem_auto]">
		<div class="grid h-16 grid-cols-4 gap-1 p-1 bg-color1">
			<template v-for="mode in modes">
				<GenericButton :button-style="1" @click="() => selectedMode = mode"
					class="rounded-md bg-color3 bg-opacity-20"
					:class="css.has({
						'bg-opacity-80': mode === selectedMode,
					})"	
				>
					{{ mode }}
				</GenericButton>
			</template>
		</div>
		<div>
			<TransitionFade mode="out-in" :duration="{ enter: 100, leave: 100 }">
				<template v-if="selectedMode === 'Local'">
					<PlayLocal/>
				</template>
				<template v-else-if="selectedMode === 'Classic'">
					<PlayClassic/>
				</template>
				<template v-else-if="selectedMode === 'Random'">
					<PlayRandom/>
				</template>
				<template v-else-if="selectedMode === 'Custom'">
					<PlayCustom/>
				</template>
			</TransitionFade>
		</div>
		<!-- <client-only placeholder="loading...">
			<GameCanvas />
		</client-only>-->
	</div>
</template>

