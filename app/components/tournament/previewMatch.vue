<script setup lang='ts'>

import { ITournamentMatch } from './preview.vue'

const { match, position } = defineProps({
	match: {
		type: Object as () => ITournamentMatch,
		required: true,
	},
	position: {
		type: String
	}
})

</script>

<template>
	<div class="rtl-grid grid grid-rows-[max-content,max-content]"
		:class="match.player1?.hasOwnProperty('id') && match.player2?.hasOwnProperty('id') ? 'grid-cols-[max-content]' : 'grid-cols-[max-content,max-content]'"
	>
		<div class="grid grid-rows-[1fr,auto,auto,1fr] grid-flow-col grid-cols-[1.5em,auto,1.5em] row-span-2 w-60 ltr-grid">
			<div/>
			<div class="border-text"
				:class="match.player1?.hasOwnProperty('id') && match.player2?.hasOwnProperty('id') ? '' : 'border-b-2'"
			/>
			<div/>
			<div/>
			<div class="min-h-[1rem]"></div>
			<TournamentPreviewMatchBox class="row-span-2" :match="match"/>
			<div class="min-h-[1rem]"></div>
			<template v-if="position === 'top'">
				<div class=""></div>
				<div class="border-b-2 border-text"></div>
				<div class="border-r-2 border-text"></div>
				<div class="border-r-2 border-text"></div>
			</template>
			<template v-else-if="position === 'bottom'">
				<div class="border-r-2 border-text"></div>
				<div class="border-b-2 border-r-2 border-text"></div>
				<div class=""></div>
				<div class=""></div>
			</template>
			<template v-else-if="position === 'middle'">
				<div class=""></div>
				<div class="border-b-2 border-text"></div>
				<div class=""></div>
				<div class=""></div>
			</template>
		</div>
		<template v-if="!(match.player1?.hasOwnProperty('id'))">
			<TournamentPreviewMatch :match="(match.player1 as ITournamentMatch)"
				:position="match.player2?.hasOwnProperty('id') ? 'middle' : 'top'"
				:class="match.player2?.hasOwnProperty('id') ? 'row-span-2' : ''"
			/>
		</template>
		<template v-if="!(match.player2?.hasOwnProperty('id'))">
			<TournamentPreviewMatch :match="(match.player2 as ITournamentMatch)"
				:position="match.player1?.hasOwnProperty('id') ? 'middle' : 'bottom'"
				:class="match.player1?.hasOwnProperty('id') ? 'row-span-2' : ''"
			/>
		</template>
	</div>
</template>

<style>

.rtl-grid {
	direction: rtl;
}

.ltr-grid {
	direction: ltr;
}

</style>