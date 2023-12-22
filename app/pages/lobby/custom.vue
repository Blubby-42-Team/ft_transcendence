<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Custom',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
const { join, leave, cards } = useLobbyStore();
const { getPrimaryUser } = useUserStore();

const user = getPrimaryUser();

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, EGameMode.Custom);
	join(user.value.id, EGameMode.Custom);
})

onUnmounted(() => {
	leave(user.value.id);
})


watch(cards, () => {
	console.log(cards.value);
})

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_auto]">
		<PlaySettings/>
		<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
			<template v-for="player of cards">
				<div class="p-2">
					<PlayLobbyCard :player="player"/>
				</div>
			</template>
		</div>
	</div>
</template>
