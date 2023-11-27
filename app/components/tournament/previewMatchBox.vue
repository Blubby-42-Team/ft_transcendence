<script setup lang='ts'>


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
	<GenericButton class="w-full h-full border-pink-500 group" :buttonStyle="1"
		:class="css.has({'border-liveGameColor hover:border-opacity-60': match?.status == EGameStatus['IN_PROGRESS']})"
	>
		<div class="grid w-full h-20 grid-cols-[2.5em,auto,2.5em] grid-rows-[2.5em,2.5em] rounded bg-pink-500 overflow-hidden">
			<template v-for="(player, i) in players">
				<div class="h-full p-1 border-pink-500 group-hover:border-pink-500"
					:class="css.has({
						'bg-pink-500': player?.id !== undefined,
						'border-liveGameColor': match?.status == EGameStatus['IN_PROGRESS'],
						'border-b || border-t ': i == 0,
					})"
				>
					<template v-if="player?.id !== undefined">
						<GenericProfilePicture class="w-8 h-8" imageSrc="/amogus.png"/>
					</template>
				</div>
				<div class="pt-2 pr-2 text-left truncate border-pink-500 group-hover:border-pink-500"
					:class="css.has({
						'bg-pink-500': player?.id !== undefined,
						'border-liveGameColor': match?.status == EGameStatus['IN_PROGRESS'],
						'border-b || border-t ': i == 0,
					})"
				>
					{{ (player?.id !== undefined ? 'Player ' + player.id : '') }}
				</div>
				<div class="pt-2 border-l-2 border-pink-500 group-hover:border-pink-500"
					:class="css.has({
						'bg-pink-500': player?.id !== undefined,
						'border-liveGameColor': match?.status == EGameStatus['IN_PROGRESS'],
						'border-b || border-t ': i == 0,
					})"
				>
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