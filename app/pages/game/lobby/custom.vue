<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Custom',
	pageTransition: false,
	layout: 'lobby',
})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Play a Game"); })

let isFront = useState(() => [
	{ type: CardType.PLAYER },
	{ type: CardType.ADD },
	{ type: CardType.ADD },
	{ type: CardType.EMPTY },
]);

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_auto]">
		<PlaySettings/>
		<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
			<template v-for="el of isFront">
				<div class="p-2">
					<PlayLobbyCard :type="el.type" @click="() => el.type = CardType.PLAYER"/>
				</div>
			</template>
		</div>
	</div>
</template>
