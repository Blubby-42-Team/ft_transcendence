<script setup lang="ts">

const { tournament } = useTournamentStore();

</script>

<template>
	<div class="grid h-auto overflow-auto">
		<TournamentPreviewMatch :match="(tournament as ILazyTournamentMatch)"/>
	</div>
</template>



