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
		window.requestAnimationFrame(menu);
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
	if (utils.value.page === 0)
		window.requestAnimationFrame(menu);
	if (utils.value.page === 1) {
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
}

const menu = () => {
	if (document.getElementById('canvasDiv')?.offsetHeight > 720/1080 * document.getElementById('canvasDiv')?.offsetWidth) {
		screen.value.width = document.getElementById('canvasDiv')?.offsetWidth * 0.95;
		screen.value.height = screen.value.width * 720/1080;
	}
	else {
		screen.value.height = document.getElementById('canvasDiv')?.offsetHeight * 0.95;
		screen.value.width = screen.value.height * 1080/720;
	}
	if (utils.value.page === 0) {
		gameGraphics.reloadMenu();
		window.requestAnimationFrame(menu);
	}
}

const reloadOptions = () => {
	if (document.getElementById('canvasDiv')?.offsetHeight > 720/1080 * document.getElementById('canvasDiv')?.offsetWidth) {
		screen.value.width = document.getElementById('canvasDiv')?.offsetWidth * 0.95;
		screen.value.height = screen.value.width * 720/1080;
	}
	else {
		screen.value.height = document.getElementById('canvasDiv')?.offsetHeight * 0.95;
		screen.value.width = screen.value.height * 1080/720;
	}
	let ctx = document.querySelector("canvas").getContext("2d");
	//background
	gameGraphics.buildBackground(ctx);
	//Options template
	if (utils.value.page === 2)
		gameGraphics.buildOptionsTemplate(ctx);
	else if (utils.value.page === 3)
		gameGraphics.buildOptionsTemplate2(ctx);
}

const options = () => {
	if (utils.value.page === 2 || utils.value.page === 3) {
		reloadOptions();
		window.requestAnimationFrame(options);
	}
}

function ratio () {
	const { screen } = useGameStore()
	return screen.value.width/1080;
}

//report the mouse.value position on click
document.addEventListener("click", function (evt) {
	//MENU
	//click sur start
	if (utils.value.page === 0 && mouse.value.x > ratio() * 560 && mouse.value.x < ratio() * 730 && mouse.value.y > ratio() * 520 && mouse.value.y < ratio() * 565) {
		utils.value.page = 1;
		window.requestAnimationFrame(game);
	}
	//click sur option
	else if (mouse.value.x > ratio() * 525 && mouse.value.x < ratio() * 750 && mouse.value.y > ratio() * 615 && mouse.value.y < ratio() * 660) {
		utils.value.page = 2;
		window.requestAnimationFrame(options);
	}

	//OPTIONS
	//exit
	else if ((utils.value.page === 2 || utils.value.page === 3) && mouse.value.x > 1138 && mouse.value.x < 1156 && mouse.value.y > 94 && mouse.value.y < 119) {
		utils.value.page = 0;
		window.requestAnimationFrame(menu);
	}
	else
		gameClick.clicked();
}, false);

//Key pressed
document.addEventListener("keydown", (e) => {
	if(controller.value[e.key]){
		controller.value[e.key].pressed = true
	}
	if ((utils.value.page === 2 || utils.value.page === 3) && e.key === "Escape") {
		utils.value.page = 0;
		window.requestAnimationFrame(menu);
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

window.requestAnimationFrame(menu);


</script>

<template>
	<div class="w-full h-full canvasDiv">
		<client-only placeholder="loading...">
			<canvas class="bg-white" ref="canvas" :width="screen.width" :height="screen.height" style="border:1px solid #ffffff;"></canvas>
		</client-only>
	</div>
</template>
