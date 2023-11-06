function clicked () {
	//nombre de points up
	const { utils, mouse, optionsList, activePlayer } = useGameStore();
	if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 190 && mouse.value.y < 215) {
		optionsList.value.maxPoint++;
		if (optionsList.value.maxPoint > 10)
			optionsList.value.maxPoint = 10;
	}
	//nombre de points down
	else if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 221 && mouse.value.y < 244) {
		optionsList.value.maxPoint--;
		if (optionsList.value.maxPoint < 1)
			optionsList.value.maxPoint = 1;
	}
	//joueurs up
	else if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 293 && mouse.value.y < 311) {
		if (optionsList.value.numPlayer === 2) {
			activePlayer.value.bottom = true;
			activePlayer.value.top = true;
			activePlayer.value.left = true;
			activePlayer.value.right = true;
			optionsList.value.numPlayer = 4;
		}
		else
			optionsList.value.numPlayer = 2;
	}
	//joueurs down
	else if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 321 && mouse.value.y < 343) {
		if (optionsList.value.numPlayer === 2) {
			activePlayer.value.bottom = true;
			activePlayer.value.top = true;
			activePlayer.value.left = true;
			activePlayer.value.right = true;
			optionsList.value.numPlayer = 4;
		}
		else
			optionsList.value.numPlayer = 2;
	}
	//ball up
	else if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 391 && mouse.value.y < 414) {
		optionsList.value.ballSize += 5;
		if (optionsList.value.ballSize > 50)
			optionsList.value.ballSize = 50;
	}
	//ball down
	else if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 422 && mouse.value.y < 446) {
		optionsList.value.ballSize -= 5;
		if (optionsList.value.ballSize < 10)
			optionsList.value.ballSize = 10;
	}
	//pad up
	else if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 491 && mouse.value.y < 514) {
		optionsList.value.padSize += 50;
		if (optionsList.value.padSize > 300)
			optionsList.value.padSize = 300;
	}
	//pad down
	else if (utils.value.page === 2 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 522 && mouse.value.y < 546) {
		optionsList.value.padSize -= 50;
		if (optionsList.value.padSize < 50)
			optionsList.value.padSize = 50;
	}
	//utils.value.page suivante
	else if (utils.value.page === 2 && mouse.value.x > 595 && mouse.value.x < 661 && mouse.value.y > 640 && mouse.value.y < 700)
		utils.value.page = 3;
	//utils.value.page precedente
	else if (utils.value.page === 3 && mouse.value.x > 595 && mouse.value.x < 661 && mouse.value.y > 640 && mouse.value.y < 700)
		utils.value.page = 2;
	//theme up
	else if (utils.value.page === 3 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 190 && mouse.value.y < 215) {
		if (optionsList.value.theme === "dark mode") {
			optionsList.value.theme = "white mode";
			optionsList.value.backgroundColor = "white";
			optionsList.value.assetsColor = "black";
		}
		else {
			optionsList.value.theme = "dark mode";
			optionsList.value.backgroundColor = "black";
			optionsList.value.assetsColor = "gray";
		}
	}
	//theme down
	else if (utils.value.page === 3 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 221 && mouse.value.y < 244) {
		if (optionsList.value.theme === "dark mode") {
			optionsList.value.theme = "white mode";
			optionsList.value.backgroundColor = "white";
			optionsList.value.assetsColor = "black";
		}
		else {
			optionsList.value.theme = "dark mode";
			optionsList.value.backgroundColor = "black";
			optionsList.value.assetsColor = "gray";
		}
	}
	//sound up
	else if (utils.value.page === 3 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 290 && mouse.value.y < 315) {
		if (optionsList.value.sound === "on")
			optionsList.value.sound = "off";
		else
			optionsList.value.sound = "on";
	}
	//sound down
	else if (utils.value.page === 3 && mouse.value.x > 234 && mouse.value.x < 280 && mouse.value.y > 321 && mouse.value.y < 344) {
		if (optionsList.value.sound === "on")
			optionsList.value.sound = "off";
		else
			optionsList.value.sound = "on";
	}
}

export default {
	clicked
}