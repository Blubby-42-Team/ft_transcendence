<script setup lang='ts'>

const { match, position } = defineProps({
	match: {
		type: Object as () => ILazyTournamentMatch,
		required: true,
	},
	position: {
		type: String
	}
})

const matchPreviewModalRef = ref()

</script>

<template>
	<div class="rtl-grid grid grid-rows-[max-content,max-content]"
		:class="match.player1?.id !== undefined && match.player2?.id !== undefined ? 'grid-cols-[max-content]' : 'grid-cols-[max-content,max-content]'"
	>
		<div class="grid grid-rows-[1fr,auto,auto,1fr] grid-flow-col grid-cols-[1.5em,auto,1.5em] row-span-2 w-60 ltr-grid">
			<div/>
			<div class="border-pink-500"
				:class="match.player1?.id !== undefined && match.player2?.id !== undefined ? '' : 'border-b-2'"
			/>
			<div/>
			<div/>
			<div class="min-h-[1rem]"></div>
			<GenericModal ref="matchPreviewModalRef">
				<WatchMatchPreview :match="match"/>
			</GenericModal>
			<TournamentPreviewMatchBox class="row-span-2" :match="(match as any)"
				@click="matchPreviewModalRef?.open"
			/>
			<div class="min-h-[1rem]"></div>
			<template v-if="position === 'top'">
				<div class=""></div>
				<div class="border-b-2 border-pink-500"></div>
				<div class="border-r-2 border-pink-500"></div>
				<div class="border-r-2 border-pink-500"></div>
			</template>
			<template v-else-if="position === 'bottom'">
				<div class="border-r-2 border-pink-500"></div>
				<div class="border-b-2 border-r-2 border-pink-500"></div>
				<div class=""></div>
				<div class=""></div>
			</template>
			<template v-else-if="position === 'middle'">
				<div class=""></div>
				<div class="border-b-2 border-pink-500"></div>
				<div class=""></div>
				<div class=""></div>
			</template>
		</div>
		<template v-if="match.player1?.id === undefined">
			<TournamentPreviewMatch
				:match="(match.player1 as ILazyTournamentMatch)"
				:position="match.player2?.id !== undefined ? 'middle' : 'top'"
				:class="match.player2?.id !== undefined ? 'row-span-2' : ''"
			/>
		</template>
		<template v-if="match.player2?.id === undefined">
			<TournamentPreviewMatch
				:match="(match.player2 as ILazyTournamentMatch)"
				:position="match.player1?.id !== undefined ? 'middle' : 'bottom'"
				:class="match.player1?.id !== undefined ? 'row-span-2' : ''"
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