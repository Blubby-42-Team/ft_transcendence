<script lang="ts" setup>
import { gameControllerType, gameStatus } from '~/stores/game';

const { screen, player, ball, optionsList, theme, utils, status, move, start, changeGameStatus, reset, setPlayer } = useGameStore()

function game() {
	let ctx = document.querySelector("canvas")?.getContext("2d");
	if (!ctx){
		window.requestAnimationFrame(game);
		return ;
	}
	
	gameGraphics.updateSize(screen, canvasParentId);
	
	switch (status.value){
		case gameStatus.ON_HOLD:
		case gameStatus.STARTED:
			gameController.executeKey(controller);
			gameEngine.gameTick(optionsList.value, utils, screen, ball, player);
		
			if (gameEngine.isGameOver(player.value, optionsList.value)){
				changeGameStatus(gameStatus.GAMEOVER);
			}
			gameGraphics.drawGame(ctx, screen.value, theme.value, optionsList.value, player.value, ball.value);

			break ;
		case gameStatus.GAMEOVER:
			gameGraphics.drawGameOver(ctx, screen.value, theme.value, player.value);
			time++;
			if (time > 200){
				reset();
				changeGameStatus(gameStatus.ON_HOLD);
				time = 0;
			}
			
			break ;
	}

	window.requestAnimationFrame(game);
}

const controller: gameControllerType = {
	w:			{ pressed: false, func: () => move(PlayerPosition.LEFT,		MoveDirection.LEFT)		},
	s:			{ pressed: false, func: () => move(PlayerPosition.LEFT,		MoveDirection.RIGHT)	},
	ArrowUp:	{ pressed: false, func: () => move(PlayerPosition.RIGHT,	MoveDirection.LEFT)		},
	ArrowDown:	{ pressed: false, func: () => move(PlayerPosition.RIGHT,	MoveDirection.RIGHT)	},
	c:			{ pressed: false, func: () => move(PlayerPosition.TOP,		MoveDirection.LEFT)		},
	v:			{ pressed: false, func: () => move(PlayerPosition.TOP,		MoveDirection.RIGHT)	},
	u:			{ pressed: false, func: () => move(PlayerPosition.BOTTOM,	MoveDirection.LEFT)		},
	i:			{ pressed: false, func: () => move(PlayerPosition.BOTTOM,	MoveDirection.RIGHT)	},
	' ':		{ pressed: false, func: () => start()												},
}
const canvasParentId = 'canvasDiv';
let time = 0;

setPlayer(PlayerPosition.LEFT, true, true);
setPlayer(PlayerPosition.RIGHT, true, false);

onMounted(() => {
	document.addEventListener("keydown", (e) => gameController.keyEvent(controller, e.key, true))
	document.addEventListener("keyup",   (e) => gameController.keyEvent(controller, e.key, false))

	gameGraphics.updateSize(screen, canvasParentId);
	gameGraphics.loadTheme(theme.value);
	reset();
	window.requestAnimationFrame(game);
})

</script>

<template>
	<div id="canvasDiv" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="bg-white border border-text" ref="canvas" :width="screen.width" :height="screen.height"></canvas>
		</client-only>
	</div>
</template>
