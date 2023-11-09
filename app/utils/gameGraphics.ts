import { gameOption, gameScreen, gameTexture, gameTheme } from "~/stores/game";

function loadTexture(text: gameTexture){
	if (text.type === 'image'){
		text.image = new Image();
		text.image.src = text.imageSrc;
	}
}

function loadTheme(theme: gameTheme){
	loadTexture(theme.background);
	loadTexture(theme.player1);
	loadTexture(theme.player2);
	loadTexture(theme.player3);
	loadTexture(theme.player4);
	loadTexture(theme.ball);
}

function buildImageBackground(ctx: CanvasRenderingContext2D, theme: string)
{
	const { screen } = useGameStore()
	let base_image = new Image();
	base_image.src = "themes/" + theme + "/background.jpg";
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0, screen.value.width, screen.value.height);
	}
}

function buildImagePlayerVertical(ctx: CanvasRenderingContext2D, theme: string)
{
	const { screen } = useGameStore()
	let base_image = new Image();
	base_image.src = "themes/" + theme + '/playerV.jpg';
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0, screen.value.width, screen.value.height);
	}
}

function buildImagePlayerHorizontal(ctx: CanvasRenderingContext2D, theme: string)
{
	const { screen } = useGameStore()
	let base_image = new Image();
	base_image.src = "themes/" + theme + '/playerH.jpg';
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0, screen.value.width, screen.value.height);
	}
}

function buildImageBall(ctx: CanvasRenderingContext2D, theme: string)
{
	const { screen } = useGameStore()
	let base_image = new Image();
	base_image.src = "themes/" + theme + '/ball.jpg';
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0, screen.value.width, screen.value.height);
	}
}

//Fond noir ou blanc
function buildBackground(ctx: CanvasRenderingContext2D, screen: gameScreen, theme: gameTheme) {
	drawRectTexture(ctx, undefined, 0, 0, screen.width, screen.height, theme.background);
}

//Affichage des scores
function buildScores (ctx: CanvasRenderingContext2D) {
	const { optionsList, scores, screen, theme } = useGameStore()
	ctx.fillStyle = theme.value.fontColor;
	ctx.font = (screen.value.width * 0.093).toString() + "px Arial";
	ctx.fillText(scores.value.player1.toString() + " - " + scores.value.player2.toString(), screen.value.width * 0.407, screen.value.height * 0.542); 

	if (optionsList.value.numPlayer === 4) {
		ctx.fillText(scores.value.player3.toString(), screen.value.width * 0.480, screen.value.height * 0.417);
		ctx.fillText(scores.value.player4.toString(), screen.value.width * 0.480, screen.value.height * 0.667);
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

function drawRect(ctx: CanvasRenderingContext2D, screen: gameScreen | undefined, x: number, y: number, w: number, l: number, color: string){
	ctx.beginPath();
	ctx.fillStyle = color;
	if (screen){
		ctx.rect(x * screen.deltaX, y * screen.deltaY, w * screen.deltaX, l * screen.deltaY);
	}
	else {
		ctx.rect(x, y, w, l);
	}
	ctx.fill();
}

function drawRectTexture(ctx: CanvasRenderingContext2D, screen: gameScreen | undefined, x: number, y: number, w: number, l: number, text: gameTexture){
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
		let base_image = new Image();
		base_image.src = text.imageSrc;
		base_image.onload = () => {
			// ctx.save();
			// ctx.translate(x + w / 2, y + l / 2);
			// ctx.rotate(text.imageRotation * Math.PI / 2);
			ctx.drawImage(base_image, 10, 10, 100, 100);
			// ctx.restore();
		};
	}
	ctx.fill();
}

function drawGame(ctx: CanvasRenderingContext2D,
	screen: gameScreen,
	theme: gameTheme,
	optionsList: gameOption,
	players: { first: number, second: number, third: number, forth: number },
	activePlayer: { top: boolean, bottom: boolean, left: boolean, right: boolean },
	ball: { x: number, y: number, dir: number, speed: number },
){
	buildBackground(ctx, screen, theme);
	buildScores(ctx)

	if (optionsList.numPlayer === 1 || optionsList.numPlayer === 2) {
		buildPlayer(ctx, 20, players.first, "vertical", theme.player1);
		buildPlayer(ctx, 1050, players.second, "vertical", theme.player2);
	}
	else if (optionsList.numPlayer === 4) {
		if (activePlayer.left)
			buildPlayer(ctx, 20, players.first, "vertical", theme.player1);
		if (activePlayer.right)
			buildPlayer(ctx, 1050, players.second, "vertical", theme.player2);
		if (activePlayer.top)
			buildPlayer(ctx, players.third, 20, "horizontal", theme.player3);
		if (activePlayer.bottom)
			buildPlayer(ctx, players.forth, 690, "horizontal", theme.player4);
	}

	buildBall(ctx, ball.x, ball.y);
}


function drawGameOver(ctx: CanvasRenderingContext2D,
	screen: gameScreen,
	theme: gameTheme,
	scores: {player1: number, player2: number, player3: number, player4: number}
){
	buildBackground(ctx, screen, theme);

	ctx.fillStyle = theme.fontColor;
	ctx.font = (screen.deltaX * 100).toString + "px Arial";
	ctx.fillText("   GAME OVER", screen.deltaX * 100, screen.deltaX * 310);
	if (scores.player1 > scores.player2 && scores.player1 > scores.player3 && scores.player1 > scores.player4)
		ctx.fillText("   PLAYER 1 WINS!", screen.deltaX * 100, screen.deltaX * 410);
	else if (scores.player2 > scores.player1 && scores.player2 > scores.player3 && scores.player2 > scores.player4)
		ctx.fillText("   PLAYER 2 WINS!", screen.deltaX * 100, screen.deltaX * 410);
	else if (scores.player3 > scores.player1 && scores.player3 > scores.player2 && scores.player3 > scores.player4)
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