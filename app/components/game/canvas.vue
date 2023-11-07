<script lang="ts" setup>

const { optionsList, scores, mouse, players, activePlayer, ball, screen, controller, utils } = useGameStore()

let time = 0;

console.log(document.getElementById('canvasDiv'));

if (document.getElementById('canvasDiv')?.offsetHeight >= 720/1080 * document.getElementById('canvasDiv')?.offsetWidth) {
	screen.value.width = document.getElementById('canvasDiv')?.offsetWidth * 0.95;
	screen.value.height = screen.value.width * 720/1080;
}
else {
	screen.value.height = document.getElementById('canvasDiv')?.offsetHeight * 0.95;
	screen.value.width = screen.value.height * 1080/720;
}

players.value.first = 360 - optionsList.value.padSize/2;
players.value.second = 360 - optionsList.value.padSize/2;
players.value.third = 540 - optionsList.value.padSize/2;
players.value.forth = 540 - optionsList.value.padSize/2;

ball.value.x = 540 - optionsList.value.ballSize/2;
ball.value.y = 360 - optionsList.value.ballSize/2;

const sleep = () => {
	if (time < 200)
		time++;
	else {
		utils.value.page = 0;
		scores.value.player1 = 0;
		scores.value.player2 = 0;
		scores.value.player3 = 0;
		scores.value.player4 = 0;
		time = 0;
		navigateTo("/game");
	}
}

const gameOver = (ctx) => {
	ctx.fillStyle = optionsList.value.assetsColor;
	ctx.font = "100px Arial";
	ctx.fillText("   GAME OVER", 100, 310);
	if (scores.value.player1 > scores.value.player2 && scores.value.player1 > scores.value.player3 && scores.value.player1 > scores.value.player4)
		ctx.fillText("   PLAYER 1 WINS!", 100, 410);
	else if (scores.value.player2 > scores.value.player1 && scores.value.player2 > scores.value.player3 && scores.value.player2 > scores.value.player4)
		ctx.fillText("   PLAYER 2 WINS!", 100, 410);
	else if (scores.value.player3 > scores.value.player1 && scores.value.player3 > scores.value.player2 && scores.value.player3 > scores.value.player4)
		ctx.fillText("   PLAYER 3 WINS!", 100, 410);
	else
		ctx.fillText("   PLAYER 4 WINS!", 100, 410);
	window.requestAnimationFrame(sleep);
}

const reload = () => {
	let ctx = document.querySelector("canvas").getContext("2d");
	if (document.getElementById('canvasDiv')?.offsetHeight > 720/1080 * document.getElementById('canvasDiv')?.offsetWidth) {
		screen.value.width = document.getElementById('canvasDiv')?.offsetWidth * 0.95;
		screen.value.height = screen.value.width * 720/1080;
	}
	else {
		screen.value.height = document.getElementById('canvasDiv')?.offsetHeight * 0.95;
		screen.value.width = screen.value.height * 1080/720;
	}
	
	//fond
	gameGraphics.buildBackground(ctx)
	//if game over
	if (scores.value.player1 >= optionsList.value.maxPoint || scores.value.player2 >= optionsList.value.maxPoint || scores.value.player3 >= optionsList.value.maxPoint || scores.value.player4 >= optionsList.value.maxPoint) {
		gameOver(ctx)
		return ;
	}
	//score
	gameGraphics.buildScores(ctx)
	//joueurs
	if (optionsList.value.numPlayer === 1 || optionsList.value.numPlayer === 2) {
		gameGraphics.buildPlayer(ctx, 20, players.value.first, "vertical");
		gameGraphics.buildPlayer(ctx, 1050, players.value.second, "vertical");
	}
	else if (optionsList.value.numPlayer === 4) {
		if (activePlayer.value.left)
			gameGraphics.buildPlayer(ctx, 20, players.value.first, "vertical");
		if (activePlayer.value.right)
			gameGraphics.buildPlayer(ctx, 1050, players.value.second, "vertical");
		if (activePlayer.value.top)
			gameGraphics.buildPlayer(ctx, players.value.third, 20, "horizontal");
		if (activePlayer.value.bottom)
			gameGraphics.buildPlayer(ctx, players.value.forth, 690, "horizontal");
	}
	//ball
	gameGraphics.buildBall(ctx, ball.value.x, ball.value.y)
}

const game = () => {
	gameController.executeMoves()
	gameEngine.moveBall();
	if (optionsList.value.numPlayer === 1)
		gameController.moveIA();
	if (optionsList.value.numPlayer === 1 || optionsList.value.numPlayer === 2) {
		gameEngine.checkCollisionWall();
		gameEngine.checkCollisionPad();
	}
	else if (optionsList.value.numPlayer === 4) {
		gameEngine.checkCollisionPadActive();
		gameEngine.checkEndPlay();
	}
	reload();
	if (utils.value.page === 1)
		window.requestAnimationFrame(game);
}

//Key pressed
document.addEventListener("keydown", (e) => {
	if(controller.value[e.key]){
		controller.value[e.key].pressed = true
	}
})

//Key released
document.addEventListener("keyup", (e) => {
	if(controller.value[e.key]){
		controller.value[e.key].pressed = false
	}
	if (e.key === " ") {
		if (!utils.value.start)
			ball.value.speed = 4;
		utils.value.start = true;
	}
})

//Get Mouse Position
document.addEventListener("mousemove", function(e) { 
	mouse.value.x = Math.round(e.clientX);
	mouse.value.y = Math.round(e.clientY);
});

window.requestAnimationFrame(game);


</script>

<template>
	<div class="">
		<client-only placeholder="loading...">
			<canvas class="bg-white" ref="canvas" :width="screen.width" :height="screen.height" style="border:1px solid #ffffff;"></canvas>
		</client-only>
	</div>
</template>
