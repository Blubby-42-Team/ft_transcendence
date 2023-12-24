<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Custom',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
const { players, reset } = useLocalLobbyStore();

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, ESelectedLobby.Custom);
	reset(1);
});

onUnmounted(() => {
	reset(1);
});

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_auto]">
		<PlaySettings/>
		<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
			<template v-for="el of players">
				<div class="p-2">
					<PlayLobbyCard :type="el.type"/>
				</div>
			</template>
		</div>
	</div>
</template>
