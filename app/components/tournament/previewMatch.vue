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
		:class="typeof match.player1 === 'number' && typeof match.player2 === 'number' ? 'grid-cols-[max-content]' : 'grid-cols-[max-content,max-content]'"
	>
		<div class="grid grid-rows-[1fr,auto,auto,1fr] grid-flow-col grid-cols-[1.5em,auto,1.5em] row-span-2 w-60 ltr-grid">
			<div/>
			<div class="border-text"
				:class="typeof match.player1 === 'number' && typeof match.player2 === 'number' ? '' : 'border-b-2'"
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
		<template v-if="typeof match.player1 === 'object'">
			<TournamentPreviewMatch :match="match.player1"
				:position="typeof match.player2 === 'number' ? 'middle' : 'top'"
				:class="typeof match.player2 === 'number' ? 'row-span-2' : ''"
			/>
		</template>
		<template v-if="typeof match.player2 === 'object'">
			<TournamentPreviewMatch :match="match.player2"
				:position="typeof match.player1 === 'number' ? 'middle' : 'bottom'"
				:class="typeof match.player1 === 'number' ? 'row-span-2' : ''"
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