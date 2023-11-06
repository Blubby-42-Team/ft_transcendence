<script setup lang="ts">

enum EGameStatus {
	NOT_STARTED,
	IN_PROGRESS,
	COMPLETED,
}

const { tournament } = useTournamentStore();

</script>

<template>
	<div class="grid h-auto overflow-auto">
		<TournamentPreviewMatch :match="(tournament as ILazyTournamentMatch)"/>
	</div>
</template>



