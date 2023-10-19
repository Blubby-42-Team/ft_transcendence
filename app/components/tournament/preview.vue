<script setup lang="ts">

const tournamentId = "2"

const { tournaments } = useTournamentStore();
const tournament = tournaments.find((el) => el.id == tournamentId)
if (tournament === undefined){
	navigateTo('/tournament')
}

</script>

<template>
	<div>
		{{ tournament }}
	</div>
</template>
