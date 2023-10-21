<script setup lang="ts">

const nbPlayer = useState<number>('nbPlayer');

// const tournament: ComputedRef<globalThis.ITournament> = computed(() => { return {
// 	id: 'test',
// 	name: 'hello',
// 	attendance: 8,
// 	maxAttendance: 4,
// }})

const nbRounds = computed(() => Math.ceil(Math.log2(nbPlayer.value)));
const reverseOrderedCount = computed(() => Array.from({ length: nbRounds.value }, (_, index) => nbRounds.value - index))

</script>

<template>
	<div class="grid h-auto overflow-auto" :style="{ gridTemplateColumns: '15em '.repeat(nbRounds - 1) + '12em' }">
		<template v-for="round in reverseOrderedCount">
			<div class="grid h-full" :style="{ gridTemplateRows: ' 1fr'.repeat(2 ** (round - 1)) }">
				<template v-for="m in 2 ** (round - 1)">
					<div class="grid grid-rows-[1fr,auto,auto,1fr] grid-cols-[auto,1.5em,1.5em] grid-flow-col"
						:class="round != 1 ? 'grid-cols-[auto,1.5em,1.5em]' : 'grid-cols-[auto]'"
					>
						<div class="bg-red-400 min-h-[1rem]"></div>
						<div class="grid h-20 grid-cols-2 row-span-2 bg-blue-500">
							<div>Player1</div>
							<div>Score1</div>
							<div>Player2</div>
							<div>Score2</div>
						</div>
						<div class="bg-red-500 min-h-[1rem]"></div>
						<template v-if="round != 1">
							<template v-if="m % 2">
								<template v-if="round != 1">
									<div class="bg-green-300 "></div>
									<div class="bg-green-400 "></div>
									<div class="bg-green-500 border-t-2"></div>
									<div class="bg-green-600 "></div>
									<div class="bg-yellow-300 "></div>
									<div class="bg-yellow-400 "></div>
									<div class="bg-yellow-500 border-l-2"></div>
									<div class="bg-yellow-600 border-l-2"></div>
								</template>
							</template>
							<template v-else>
								<div class="bg-green-300 "></div>
								<div class="bg-green-400 border-b-2"></div>
								<div class="bg-green-500 "></div>
								<div class="bg-green-600 "></div>
								<div class="bg-yellow-300 border-t-2 border-l-2"></div>
								<div class="bg-yellow-400 border-l-2"></div>
								<div class="bg-yellow-500 "></div>
								<div class="bg-yellow-600 "></div>
							</template>
						</template>
					</div>
				</template>
			</div>
		</template>
	</div>
</template>



