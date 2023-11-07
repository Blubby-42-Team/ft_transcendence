<script setup lang='ts'>
import { ILazyTournamentMatch } from '~/stores/tournament';

enum EGameStatus {
	NOT_STARTED,
	IN_PROGRESS,
	COMPLETED,
}

const { match } = defineProps({
	match: {
		type: Object as () => ILazyTournamentMatch,
		required: true,
	},
})

const players = computed(() => [match.player1, match.player2])

</script>

<template>
	<GenericButton class="w-full h-full border-text" :buttonStyle="1"
		:class="(match?.status == EGameStatus['IN_PROGRESS'] ? 'drop-shadow-[0_0_10px_rgba(255,0,0,255)]' : '')"
	>
		<div class="grid w-full h-20 grid-cols-[2.5em,auto,2.5em] grid-rows-[2.5em,2.5em] rounded bg-color2 overflow-hidden">
			<template v-for="(player, i) in players">
				<div class="h-full p-1 border-text" :class="(i == 0 ? 'border-b ' : 'border-t ') + (player?.id !== undefined ? 'bg-color3' : '')">
					<template v-if="player?.id !== undefined">
						<GenericProfilePicture class="w-8 h-8" imageSrc="/amogus.png"/>
					</template>
				</div>
				<div class="pt-2 pr-2 text-left truncate border-text" :class="(i == 0 ? 'border-b ' : 'border-t ') + (player?.id !== undefined ? 'bg-color3' : '')">
					{{ (player?.id !== undefined ? 'Player ' + player.id : '') }}
				</div>
				<div class="pt-2 border-l-2 border-text" :class="(i == 0 ? 'border-b ' : 'border-t ') + (player?.id !== undefined ? 'bg-color3' : '')">
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