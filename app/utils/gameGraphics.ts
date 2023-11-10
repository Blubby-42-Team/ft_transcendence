import { gameBall, gameOption, gamePlayers, gameScreen, gameTexture, gameTheme } from "~/stores/game";

function loadTexture(text: gameTexture){
	if (text.type === 'image'){
		text.image = new Image();
		text.image.src = text.imageSrc;
	}
}

function loadTheme(theme: gameTheme){
	loadTexture(theme.background);
	loadTexture(theme.player_left);
	loadTexture(theme.player_right);
	loadTexture(theme.player_top);
	loadTexture(theme.player_bottom);
	loadTexture(theme.ball);
}

//Fond noir ou blanc
function buildBackground(ctx: CanvasRenderingContext2D, screen: gameScreen, theme: gameTheme) {
	drawRectTexture(ctx, undefined, 0, 0, screen.width, screen.height, theme.background);
}

//Affichage des scores
function buildScores (ctx: CanvasRenderingContext2D) {
	const { optionsList, player, screen, theme } = useGameStore()
	ctx.fillStyle = theme.value.fontColor;
	ctx.font = (screen.value.width * 0.093).toString() + "px Arial";
	
	ctx.fillText(`${player.value.left.score} - ${player.value.right.score}`, screen.value.width * 0.407, screen.value.height * 0.542); 

	if (optionsList.value.numPlayer === 4) {
		ctx.fillText(`${player.value.top.score}`,		screen.value.width * 0.480, screen.value.height * 0.417);
		ctx.fillText(`${player.value.bottom.score}`,	screen.value.width * 0.480, screen.value.height * 0.667);
	}
}

//Affichage d'un joueur
function buildPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, dir: 'vertical' | 'horizontal', text: gameTexture) {
	const { theme, optionsList, screen } = useGameStore()
	if (dir === "vertical") {
		drawRectTexture(ctx, screen.value, x, y, 10, optionsList.value.padSize, text);
	}
	else {
		drawRectTexture(ctx, screen.value, x, y, optionsList.value.padSize, 10, text);
	}
}

//Affichage de la balle
function buildBall(ctx: CanvasRenderingContext2D, x: number, y: number) {
	const { theme, optionsList, screen } = useGameStore()
	drawRectTexture(ctx, screen.value, x, y, optionsList.value.ballSize, optionsList.value.ballSize, theme.value.ball);
}

function drawRectTexture(
	ctx: CanvasRenderingContext2D,
	screen: gameScreen | undefined,
	x: number,
	y: number,
	w: number,
	l: number,
	text: gameTexture,
){
	ctx.beginPath();
	if (text.type === 'color'){
		ctx.fillStyle = text.color;
		if (screen){
			ctx.rect(x * screen.deltaX, y * screen.deltaY, w * screen.deltaX, l * screen.deltaY);
		}
		else {
			ctx.rect(x, y, w, l);
		}
	}
	else if (text.type === 'image'){
		if (!text.image){
			return ;
		}
		if (screen){
			ctx.drawImage(text.image, x * screen.deltaX, y * screen.deltaY, w * screen.deltaX, l * screen.deltaY);
		}
		else {
			ctx.drawImage(text.image, x, y, w, l);
		}
	}
	ctx.fill();
}

function drawGame(
	ctx: CanvasRenderingContext2D,
	screen: gameScreen,
	theme: gameTheme,
	optionsList: gameOption,
	player: gamePlayers,
	ball: gameBall,
){
	buildBackground(ctx, screen, theme);
	buildScores(ctx)

	if (optionsList.numPlayer === 1 || optionsList.numPlayer === 2) {
		buildPlayer(ctx, 20, player.left.position,		"vertical", theme.player_left);
		buildPlayer(ctx, 1050, player.right.position,	"vertical", theme.player_right)
	}
	else if (optionsList.numPlayer === 4) {
		if (player.left.active)		buildPlayer(ctx, 20, player.left.position,		"vertical", theme.player_left);
		if (player.right.active)	buildPlayer(ctx, 1050, player.right.position,	"vertical", theme.player_right);
		if (player.top.active)		buildPlayer(ctx, player.top.position, 20,		"horizontal", theme.player_top);
		if (player.bottom.active)	buildPlayer(ctx, player.bottom.position, 690,	"horizontal", theme.player_bottom);
	}

	buildBall(ctx, ball.x, ball.y);
}


function drawGameOver(
	ctx: CanvasRenderingContext2D,
	screen: gameScreen,
	theme: gameTheme,
	player: gamePlayers
){
	buildBackground(ctx, screen, theme);

	ctx.fillStyle = theme.fontColor;
	ctx.font = `${screen.deltaX * 100}px Arial`;
	ctx.fillText("   GAME OVER", screen.deltaX * 100, screen.deltaX * 310);
	if (player.left.score > player.right.score && player.left.score > player.top.score && player.left.score > player.bottom.score)
		ctx.fillText("   PLAYER 1 WINS!", screen.deltaX * 100, screen.deltaX * 410);
	else if (player.right.score > player.left.score && player.right.score > player.top.score && player.right.score > player.bottom.score)
		ctx.fillText("   PLAYER 2 WINS!", screen.deltaX * 100, screen.deltaX * 410);
	else if (player.top.score > player.left.score && player.top.score > player.right.score && player.top.score > player.bottom.score)
		ctx.fillText("   PLAYER 3 WINS!", screen.deltaX * 100, screen.deltaX * 410);
	else
		ctx.fillText("   PLAYER 4 WINS!", screen.deltaX * 100, screen.deltaX * 410);
}

function updateSize(screen: ComputedRef<gameScreen>, canvasId: string) {
	const canvas = document.getElementById(canvasId);
	if (!canvas){
		return ;
	}
	if (canvas.offsetHeight >= 720/1080 * canvas.offsetWidth) {
		screen.value.width = canvas.offsetWidth * 0.95;
		screen.value.height = screen.value.width * 720/1080;
	}
	else {
		screen.value.height = canvas.offsetHeight * 0.95;
		screen.value.width = screen.value.height * 1080/720;
	}
	screen.value.deltaX = screen.value.width/1080;
	screen.value.deltaY = screen.value.height/720;
}

export default {
	loadTheme,
	updateSize,
	drawGame,
	drawGameOver,
}