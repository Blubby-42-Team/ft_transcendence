//Fond noir ou blanc
function buildBackground (ctx) {
	const { optionsList, screen } = useGameStore()
	ctx.beginPath();
	ctx.fillStyle = optionsList.value.backgroundColor;
	ctx.moveTo(0, 0);
	ctx.lineTo(screen.value.width, 0);
	ctx.lineTo(0, screen.value.height);
	ctx.moveTo(screen.value.width, screen.value.height);
	ctx.lineTo(0, screen.value.height);
	ctx.lineTo(screen.value.width, 0);
	ctx.fill();
}

//Affichage des scores
function buildScores (ctx) {
	const { optionsList, scores, screen } = useGameStore()
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.font = (screen.value.width * 0.093).toString() + "px Arial";
	ctx.fillText(scores.value.player1.toString() + " - " + scores.value.player2.toString(), screen.value.width * 0.407, screen.value.height * 0.542); 

	if (optionsList.value.numPlayer === 4) {
		ctx.fillText(scores.value.player3.toString(), screen.value.width * 0.480, screen.value.height * 0.417);
		ctx.fillText(scores.value.player4.toString(), screen.value.width * 0.480, screen.value.height * 0.667);
	}
}

//Affichage d'un joueur
function buildPlayer (ctx, x, y, dir) {
	const { optionsList, screen } = useGameStore()
	if (dir === "vertical") {
		ctx.beginPath();
		ctx.fillStyle = optionsList.value.assetsColor;
		ctx.moveTo(x * screen.value.width/1080, y * screen.value.height/720);
		ctx.lineTo((x + 10) * screen.value.width/1080, y * screen.value.height/720);
		ctx.lineTo(x * screen.value.width/1080, (y + optionsList.value.padSize) * screen.value.height/720);

		ctx.moveTo((x + 10) * screen.value.width/1080, (y + optionsList.value.padSize) * screen.value.height/720);
		ctx.lineTo(x * screen.value.width/1080, (y + optionsList.value.padSize) * screen.value.height/720);
		ctx.lineTo((x + 10) * screen.value.width/1080, y * screen.value.height/720);
		ctx.fill();
	}
	else {
		ctx.beginPath();
		ctx.fillStyle = optionsList.value.assetsColor;
		ctx.moveTo(x * screen.value.width/1080, y * screen.value.height/720);
		ctx.lineTo(x * screen.value.width/1080, (y + 10) * screen.value.height/720);
		ctx.lineTo((x + optionsList.value.padSize) * screen.value.width/1080, y * screen.value.height/720);

		ctx.moveTo((x + optionsList.value.padSize) * screen.value.width/1080, (y + 10) * screen.value.height/720);
		ctx.lineTo((x + optionsList.value.padSize) * screen.value.width/1080, y * screen.value.height/720);
		ctx.lineTo(x * screen.value.width/1080, (y + 10) * screen.value.height/720);
		ctx.fill();
	}
}

//Affichage de la balle
function buildBall (ctx, x, y) {
	const { optionsList, screen } = useGameStore()
	ctx.beginPath();
	ctx.fillStyle = optionsList.value.assetsColor;
	ctx.moveTo(x * screen.value.width/1080, y * screen.value.height/720);
	ctx.lineTo((x + optionsList.value.ballSize) * screen.value.width/1080, y * screen.value.height/720);
	ctx.lineTo(x * screen.value.width/1080, (y + optionsList.value.ballSize) * screen.value.height/720);

	ctx.moveTo((x + optionsList.value.ballSize) * screen.value.width/1080, (y + optionsList.value.ballSize) * screen.value.height/720);
	ctx.lineTo(x * screen.value.width/1080, (y + optionsList.value.ballSize) * screen.value.height/720);
	ctx.lineTo((x + optionsList.value.ballSize) * screen.value.width/1080, y * screen.value.height/720);
	ctx.fill();
}
export default {
	buildBackground,
	buildBall,
	buildPlayer,
	buildScores
}