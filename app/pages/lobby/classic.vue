<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Classic',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
onMounted(() => { setPageDataLobby(EPageCategories.GAME, ESelectedLobby.Classic); })

let isFront = ref([
	{ type: CardType.PLAYER },
	{ type: CardType.EMPTY },
	{ type: CardType.COMING },
	{ type: CardType.COMING },
]);

</script>

<template>
	<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
		<template v-for="el of isFront">
			<div class="p-2">
				<PlayLobbyCard :type="el.type" @click="() => el.type = CardType.PLAYER"/>
			</div>
		</template>
	</div>
</template>
