<script setup lang='ts'>

import { ITournamentMatch } from './preview.vue'

const { match } = defineProps({
	match: {
		type: Object as () => ITournamentMatch,
		required: true,
	},
})

const players = computed(() => [match.player1, match.player2])

</script>

<template>
	<GenericButton class="w-full h-full border-text" :buttonStyle="1">
		<div class="grid w-full h-20 grid-cols-[2.5em,auto,2.5em] grid-rows-[2.5em,2.5em] rounded bg-color2 overflow-hidden">
			<template v-for="(player, i) in players">
				<div class="h-full p-1" :class="(i == 0 ? 'border-b ' : 'border-t ') + (players?.hasOwnProperty('id') ? 'bg-color3' : '')">
					<template v-if="players?.hasOwnProperty('id')">
						<GenericProfilePicture class="w-8 h-8" imageSrc="/amogus.png"/>
					</template>
				</div>
				<div class="pt-2 pr-2 text-left truncate" :class="(i == 0 ? 'border-b ' : 'border-t ') + (players?.hasOwnProperty('id') ? 'bg-color3' : '')">
					{{ (players?.hasOwnProperty('id') ? 'Player ' + player : '') }}
				</div>
				<div class="pt-2 border-l-2" :class="(i == 0 ? 'border-b ' : 'border-t ') + (players?.hasOwnProperty('id') ? 'bg-color3' : '')">
					<div class="text-center ">-</div>
				</div>
			</template>
		</div>
	</GenericButton>
</template>

<style>

.rtl-grid {
	direction: rtl;
}

.ltr-grid {
	direction: ltr;
}

</style>