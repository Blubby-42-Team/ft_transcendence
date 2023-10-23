<script setup lang='ts'>

import { ITournamentMatch } from './preview.vue'

const { match } = defineProps({
	match: {
		type: Object as () => ITournamentMatch,
		required: true,
	},
})

</script>

<template>
	<div class="grid h-20 row-span-2 border-2 border-text">
		<div v-if="typeof match.player1 === 'number'" class="bg-blue-600">
			{{ match.player1 }}
		</div>
		<div v-else class="bg-slate-800">...</div>
		<div v-if="typeof match.player2 === 'number'" class="bg-blue-600">
			{{ match.player2 }}
		</div>
		<div v-else class="bg-slate-800">...</div>
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