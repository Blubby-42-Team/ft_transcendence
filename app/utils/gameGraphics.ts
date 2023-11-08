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

function ratio () {
	const { screen } = useGameStore()
	return screen.value.width/1060;
}

function buildPongName (ctx) {
	const { optionsList, screen } = useGameStore()
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.font = (ratio() * 200).toString() + "px Arial";
	ctx.fillText("PONG", ratio() * 250, ratio() * 250);
}

function buildMenuOptions (ctx) {
	const { optionsList, mouse } = useGameStore()
	ctx.font = (ratio() * 50).toString() + "px Arial";

	if (mouse.value.x > ratio() * 538 && mouse.value.x < ratio() * 698 && mouse.value.y > ratio() * 501 && mouse.value.y < ratio() * 538)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("START", ratio() * 450, ratio() * 450);

	if (mouse.value.x > ratio() * 510 && mouse.value.x < ratio() * 733 && mouse.value.y > ratio() * 599 && mouse.value.y < ratio() * 639)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("OPTIONS", ratio() * 420, ratio() * 550);
}

function buildOptionsTemplate (ctx) {
	const { optionsList, mouse } = useGameStore()
	ctx.font = "30px Arial";

	//EXIT
	if (mouse.value.x > 1138 && mouse.value.x < 1156 && mouse.value.y > 94 && mouse.value.y < 119)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("X", 1050, 30);
	
	ctx.font = "50px Arial";
	//Nombre de points
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("NOMBRE DE POINTS : " + optionsList.value.maxPoint, 250, 150);
	if (mouse.value.x > ratio() * 234 && mouse.value.x < ratio() * 280 && mouse.value.y > ratio() * 190 && mouse.value.y < ratio() * 215)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(ratio() * 150, ratio() * 125);
	ctx.lineTo(ratio() * 170, ratio() * 105);
	ctx.lineTo(ratio() * 190, ratio() * 125);
	ctx.moveTo(ratio() * 190, ratio() * 125);
	ctx.lineTo(ratio() * 170, ratio() * 105);
	ctx.fill();
	if (mouse.value.x > ratio() * 234 && mouse.value.x < ratio() * 280 && mouse.value.y > ratio() * 221 && mouse.value.y < ratio() * 244)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(ratio() * 150, ratio() * 135);
	ctx.lineTo(ratio() * 170, ratio() * 155);
	ctx.lineTo(ratio() * 190, ratio() * 135);
	ctx.moveTo(ratio() * 190, ratio() * 135);
	ctx.lineTo(ratio() * 170, ratio() * 155);
	ctx.fill();

	//Nombre de joueurs
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("NOMBRE DE JOUEURS : " + optionsList.value.numPlayer, 250, 250);
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 293 && mouse.value.y < 311)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 225);
	ctx.lineTo(170, 205);
	ctx.lineTo(190, 225);
	ctx.moveTo(190, 225);
	ctx.lineTo(170, 205);
	ctx.fill();
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 321 && mouse.value.y < 343)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 235);
	ctx.lineTo(170, 255);
	ctx.lineTo(190, 235);
	ctx.moveTo(190, 235);
	ctx.lineTo(170, 255);
	ctx.fill();

	//Ball size
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("TAILLE DE LA BALLE : " + optionsList.value.ballSize/10 + 'x', 250, 350);
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 391 && mouse.value.y < 414)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 325);
	ctx.lineTo(170, 305);
	ctx.lineTo(190, 325);
	ctx.moveTo(190, 325);
	ctx.lineTo(170, 305);
	ctx.fill();
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 422 && mouse.value.y < 446)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 335);
	ctx.lineTo(170, 355);
	ctx.lineTo(190, 335);
	ctx.moveTo(190, 335);
	ctx.lineTo(170, 355);
	ctx.fill();

	//Pad size
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("TAILLE DES PAD : " + optionsList.value.padSize/100 + 'x', 250, 450);
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 491 && mouse.value.y < 514)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 425);
	ctx.lineTo(170, 405);
	ctx.lineTo(190, 425);
	ctx.moveTo(190, 425);
	ctx.lineTo(170, 405);
	ctx.fill();
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 522 && mouse.value.y < 546)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 435);
	ctx.lineTo(170, 455);
	ctx.lineTo(190, 435);
	ctx.moveTo(190, 435);
	ctx.lineTo(170, 455);
	ctx.fill();

	//Suivant
	if (mouse.value.x > 595 && mouse.value.x < 661 && mouse.value.y > 640 && mouse.value.y < 700)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(510, 550);
	ctx.lineTo(510, 600);
	ctx.lineTo(570, 575);
	ctx.moveTo(570, 575);
	ctx.lineTo(510, 600);
	ctx.fill();
}

function buildOptionsTemplate2 (ctx) {
	const { optionsList, mouse } = useGameStore()
	ctx.font = "30px Arial";

	//EXIT
	if (mouse.value.x > 1138 && mouse.value.x < 1156 && mouse.value.y > 94 && mouse.value.y < 119)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("X", 1050, 30);
	
	ctx.font = "50px Arial";

	//Theme
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("THEME : " + optionsList.value.theme, 250, 150);
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 190 && mouse.value.y < 215)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 125);
	ctx.lineTo(170, 105);
	ctx.lineTo(190, 125);
	ctx.moveTo(190, 125);
	ctx.lineTo(170, 105);
	ctx.fill();
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 221 && mouse.value.y < 244)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 135);
	ctx.lineTo(170, 155);
	ctx.lineTo(190, 135);
	ctx.moveTo(190, 135);
	ctx.lineTo(170, 155);
	ctx.fill();

	//Nombre de joueurs
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("SON : " + (optionsList.value.sound ? 'on' : 'off'), 250, 250);
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 293 && mouse.value.y < 311)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 225);
	ctx.lineTo(170, 205);
	ctx.lineTo(190, 225);
	ctx.moveTo(190, 225);
	ctx.lineTo(170, 205);
	ctx.fill();
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 321 && mouse.value.y < 343)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 235);
	ctx.lineTo(170, 255);
	ctx.lineTo(190, 235);
	ctx.moveTo(190, 235);
	ctx.lineTo(170, 255);
	ctx.fill();

	//Ball size
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("MODE : " + optionsList.value.mode, 250, 350);
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 391 && mouse.value.y < 414)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 325);
	ctx.lineTo(170, 305);
	ctx.lineTo(190, 325);
	ctx.moveTo(190, 325);
	ctx.lineTo(170, 305);
	ctx.fill();
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 422 && mouse.value.y < 446)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 335);
	ctx.lineTo(170, 355);
	ctx.lineTo(190, 335);
	ctx.moveTo(190, 335);
	ctx.lineTo(170, 355);
	ctx.fill();

	//Pad size
	ctx.fillStyle = optionsList.value.fontColor;
	ctx.fillText("RANDOMIZER : " + (optionsList.value.randomizer ? 'on' : 'off'), 250, 450);
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 491 && mouse.value.y < 514)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 425);
	ctx.lineTo(170, 405);
	ctx.lineTo(190, 425);
	ctx.moveTo(190, 425);
	ctx.lineTo(170, 405);
	ctx.fill();
	if (mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 522 && mouse.value.y < 546)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(150, 435);
	ctx.lineTo(170, 455);
	ctx.lineTo(190, 435);
	ctx.moveTo(190, 435);
	ctx.lineTo(170, 455);
	ctx.fill();

	//Précédent
	if (mouse.value.x > 595 && mouse.value.x < 661 && mouse.value.y > 640 && mouse.value.y < 700)
		ctx.fillStyle = "red";
	else
		ctx.fillStyle = optionsList.value.fontColor;
	ctx.beginPath();
	ctx.moveTo(570, 550);
	ctx.lineTo(570, 600);
	ctx.lineTo(510, 575);
	ctx.moveTo(510, 575);
	ctx.lineTo(570, 600);
	ctx.fill();
}

function reloadMenu () {
	let ctx = document.querySelector("canvas").getContext("2d");
	//background``
	buildBackground(ctx);
	//PONG
	buildPongName(ctx);
	//text + over
	buildMenuOptions(ctx);
}

export default {
	buildBackground,
	buildBall,
	buildPlayer,
	buildScores,
	buildPongName,
	buildMenuOptions,
	buildOptionsTemplate,
	buildOptionsTemplate2,
	reloadMenu
}