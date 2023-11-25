<script setup lang="ts">

const { gameList } = useGameListStore();

</script>

<template>
	<div class="grid h-full grid-cols-[5em,1fr,5em,1fr,max-content]">
		<div class="contents">
			<div class="p-2 text-center bg-pink-500">Status</div>
			<div class="p-2 text-right bg-pink-500">Player1</div>
			<div class="p-2 text-center bg-pink-500">Score</div>
			<div class="p-2 bg-pink-500">Player2</div>
			<div class="p-2 bg-pink-500">Tournament</div>
		</div>
		<template v-for="(game, i) in gameList">
			<NuxtLink :to="`/watch/game/id/${game.id}`" class="contents group">
				<div class="p-2 text-center bg-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">Started</div>
				<div class="p-2 text-right bg-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-75 " :class="i % 2 ? 'bg-opacity-70' : ''">{{ game.player1.name }}</div>
				<div class="p-2 text-center bg-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">{{ game.player1score }} - {{ game.player2score }}</div>
				<div class="p-2 bg-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">{{ game.player2.name }}</div>
				<div class="p-2 bg-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">{{ game.tournament }}</div>
			</NuxtLink>
		</template>
	</div>
</template>
