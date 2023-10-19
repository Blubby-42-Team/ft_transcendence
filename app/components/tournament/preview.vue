<script setup lang="ts">

const tournament: globalThis.ITournament = {
	id: 'test',
	name: 'hello',
	attendance: 32,
	maxAttendance: 4,
}

const { tournaments } = useTournamentStore();

const nbRounds = Math.ceil(Math.log2(tournament.attendance));
const test = Array.from({ length: nbRounds }, (_, index) => nbRounds - index)

function getCols(): string {
	let res = 'auto'
	for (let i = 1; i < nbRounds; i++){
		res += ' auto'
	}
	return res
}

function getRows(round: number): string{
	let res = '';
	for (let i = 0; i < (2 ** (round - 1)); i++){
		res += ' 1fr'
	}
	return res;
}

</script>

<template>
	<div class="grid h-auto overflow-auto bg-color1" :style="{ gridTemplateColumns: getCols() }">
		<template v-for="round in test">
			<div class="grid h-full" :style="{ gridTemplateRows: getRows(round) }">
				<template v-for="m in 2 ** (round - 1)">
					<div class="grid grid-rows-[1fr,auto,auto,1fr] grid-cols-[auto,1.5em,1.5em] grid-flow-col">
						<div class="h-4"></div>
						<div class="h-16 row-span-2 bg-blue-500">TEST</div>
						<div class="h-4"></div>
						<template v-if="m % 2">
							<template v-if="round != 1">
								<div class=""></div>
								<div class="border-b"></div>
								<div class="border-t border-r"></div>
								<div class="border-r"></div>
								<div class=""></div>
								<div class=""></div>
								<div class="border-l"></div>
								<div class="border-b border-l"></div>
							</template>
						</template>
						<template v-else>
							<div class="border-r "></div>
							<div class="border-b border-r "></div>
							<div class="border-t "></div>
							<div class=""></div>
							<div class="border-t border-l"></div>
							<div class="border-l"></div>
							<div class=""></div>
							<div class=""></div>
						</template>
					</div>
				</template>
			</div>
		</template>
	</div>
</template>



