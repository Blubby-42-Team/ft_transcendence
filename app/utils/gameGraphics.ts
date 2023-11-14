function loadTexture(text: gameTexture){
	if (text.type === 'image'){
		text.image = new Image();
		text.image.src = text.imageSrc;
	}
}

function loadTheme(theme: gameTheme2){
	for (const textKey in theme){
		loadTexture((theme as any)[textKey]);
	}
}

function drawScore(
	ctx: CanvasRenderingContext2D,
	gameState: gameStateType,
	screen: screenData,
	fontColor: string,
){
	ctx.fillStyle = fontColor;
	ctx.font = `${4 * screen.delta.y}px Arial`;
	if (gameState.player_bottom.active){
		ctx.fillText(`${gameState.player_bottom.score}`, screen.width * 0.48, screen.height * 0.59);
	}
	if (gameState.player_top.active){
		ctx.fillText(`${gameState.player_top.score}`, screen.width * 0.48, screen.height * 0.459);
	}
	if (gameState.player_left.active){
		ctx.fillText(`${gameState.player_left.score}`, screen.width * 0.42, screen.height * 0.525);
	}
	if (gameState.player_right.active){
		ctx.fillText(`${gameState.player_right.score}`, screen.width * 0.54, screen.height * 0.525);
	}
}

function drawRectTexture(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	l: number,
	text: gameTexture,
){
	ctx.beginPath();
	if (text.type === 'color'){
		ctx.fillStyle = text.color;
		ctx.rect(x, y, w, l);
	}
	else if (text.type === 'image'){
		if (!text.image){
			return ;
		}
		ctx.drawImage(text.image, x, y, w, l);
	}
	ctx.fill();
}

function drawGameElement(
	ctx: CanvasRenderingContext2D,
	text: gameTexture,
	rec: Rectangle,
	screen: screenData,
){
	drawRectTexture(
		ctx,
		screen.width / 2 + (rec.center.x - rec.width_d_2) * screen.delta.x,
		screen.height / 2 + (rec.center.y - rec.height_d_2) * screen.delta.y,
		rec.width_d_2 * 2 * screen.delta.x,
		rec.height_d_2 * 2 * screen.delta.x,
		text,
	);
}

function drawGame(
	ctx: CanvasRenderingContext2D,
	gameState: gameStateType,
	screen: screenData,
	theme: gameTheme2,
){
	// Draw Background
	drawRectTexture(ctx, 0, 0, screen.width, screen.height, theme.background)

	// Draw Ball
	drawGameElement(ctx, theme.ball, gameState.ball, screen);

	drawScore(ctx, gameState, screen, theme.fontColor);
	
	// Draw Players
	if (gameState.player_left.active && !gameState.player_left.eleminated){
		drawGameElement(ctx, theme.player_left, gameState.player_left as Rectangle, screen);
	}
	if (gameState.player_right.active && !gameState.player_right.eleminated){
		drawGameElement(ctx, theme.player_right, gameState.player_right as Rectangle, screen);
	}
	if (gameState.player_top.active && !gameState.player_top.eleminated){
		drawGameElement(ctx, theme.player_top, gameState.player_top as Rectangle, screen);
	}
	if (gameState.player_bottom.active && !gameState.player_bottom.eleminated){
		drawGameElement(ctx, theme.player_bottom, gameState.player_bottom as Rectangle, screen);
	}

	// Draw Obstacles
	for (const obstacleKey in gameState.obstacles){
		if (!gameState.obstacles[obstacleKey].hidden){
			drawGameElement(ctx, (theme as any)?.[obstacleKey] ?? { type: 'color', color: 'purple' }, gameState.obstacles[obstacleKey], screen);
		}
	}
}

function updateSize(gameState: gameStateType, screen: screenData, canvasParentId: string) {
	const canvas = document.getElementById(canvasParentId);
	if (!canvas){
		return ;
	}
	if (canvas.offsetHeight >= gameState.gameArea.height_d_2 / gameState.gameArea.width_d_2 * canvas.offsetWidth) {
		screen.width = canvas.offsetWidth - 2;
		screen.height = canvas.offsetWidth * gameState.gameArea.height_d_2 / gameState.gameArea.width_d_2 - 2;
	}
	else {
		screen.width = canvas.offsetHeight * gameState.gameArea.width_d_2 / gameState.gameArea.height_d_2 - 2;
		screen.height = canvas.offsetHeight - 2;
	}
	screen.delta.x = screen.width / ((gameState.gameArea.width_d_2 - gameState.ball.width_d_2 * 2) * 2);
	screen.delta.y = screen.height / ((gameState.gameArea.height_d_2 - gameState.ball.height_d_2 * 2) * 2);
}

let continueLoop = true;

function start(canvasParentId: string, theme: gameTheme2, state: Ref<gameStateType>, onLoop: (ctx: CanvasRenderingContext2D, screen: screenData, gameState: gameStateType) => void){
	console.log('Graphic Engine Start')
	continueLoop = true;

	let screen: screenData = {
		delta: {
			x: 0,
			y: 0,
		},
		width: 0,
		height: 0,
	}

	loadTheme(theme);

	function loop(){
		let ctx = document.querySelector("canvas")?.getContext("2d");
		if (!ctx){
			window.requestAnimationFrame(loop);
			return ;
		}

		updateSize(state.value, screen, canvasParentId);
		onLoop(ctx, screen, state.value);

		if (continueLoop){
			window.requestAnimationFrame(loop);
		}
	}
	window.requestAnimationFrame(loop);
}

function stop(){
	continueLoop = false;
	console.log('Graphic Engine Stop')
}

export default {
	drawGame,
	start,
	stop,
}