<script lang="ts" setup>
import { gameStatusType } from '#imports';

const theme = useState<gameTheme>('gameTheme');

const screenSize = ref({
	width: 0,
	height: 0,
})

const lobbyStore = useLobbyStore();
const { gameState } = toRefs(lobbyStore);

const emptyFunction = (status: boolean) => {};
const controller: gameControllerType = {
	w:			(status: boolean) => lobbyStore.move(true,	status),
	s:			(status: boolean) => lobbyStore.move(false,	status),
	ArrowUp:	(status: boolean) => lobbyStore.move(true,	status),
	ArrowDown:	(status: boolean) => lobbyStore.move(false,	status),
	' ':		(status: boolean) => lobbyStore.startRound(status),
}

const graphic = new GraphicEngine('canvasDiv', theme.value, () => gameState.value, (ctx, screen) => {
		screenSize.value.width = screen.width;
		screenSize.value.height = screen.height;
		
		switch (gameState.value.status) {
			case gameStatusType.ON_HOLD:
			case gameStatusType.STARTED:
				graphic.drawGame(ctx);
				break ;
			case gameStatusType.GAMEOVER:
				navigateTo('/');
				break ;
		}
});

onMounted(async () => {
	document.addEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.addEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));
	
	graphic.start();
})

onUnmounted(() => {
	document.removeEventListener("keydown", (e) => (controller?.[e.key] ?? emptyFunction)(true));
	document.removeEventListener("keyup",   (e) => (controller?.[e.key] ?? emptyFunction)(false));
	
	graphic.stop();
})

</script>

<template>
	<div id="canvasDiv" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="border bg-text border-text" ref="canvas" :width="screenSize.width" :height="screenSize.height"></canvas>
		</client-only>
	</div>
</template>
