<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Classic',
	layout: 'lobby',
})

const { setPageDataLobby, waitingString } = usePageStore();
onMounted(() => setPageDataLobby(EPageCategories.GAME, EGameMode.Classic));

function redirect(){
	navigateTo('/game/local');
};

</script>

<template>
	<div class="grid h-full grid-cols-[repeat(4,1fr)] grid-rows-[auto_max-content] w-full">
		<div/>
		<GameLobbyCard :id="1" :card="CardType.PLAYER"/>
		<GameLobbyCard :id="1" :card="CardType.PLAYER"/>
		<div/>
		<div/>
		<div class="w-full col-span-2 p-2">
			<GameLobbyButton :endFunc="redirect"/>
		</div>
		<div/>
	</div>
</template>