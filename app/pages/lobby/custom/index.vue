<script lang="ts" setup>

definePageMeta({
	name: 'Lobby Custom',
	layout: 'lobby',
})

const { setPageDataLobby } = usePageStore();
const { reset, changeBehaviour } = useLobbyStore();

onMounted(() => {
	setPageDataLobby(EPageCategories.GAME, EGameMode.Custom);
	changeBehaviour(EGameMode.Custom);
});

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(1,auto)]">
		<GameLobbySettingsCustom :preview="false"/>
		<div class="flex w-full h-full p-5">
			<GameInstancePreview uniqueToken="previewLocal"/>
		</div>
	</div>
</template>
