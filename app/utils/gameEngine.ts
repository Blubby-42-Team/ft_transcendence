function resetPlay () {
	const { ball, players, optionsList, utils } = useGameStore();
	if (optionsList.value.randomizer) {
		optionsList.value.ballSize = 15;
		optionsList.value.padSize = 100;
	}
	ball.value.x = 540 - optionsList.value.ballSize/2;
	ball.value.y = 360 - optionsList.value.ballSize/2;
	players.value.first = 360 - optionsList.value.padSize/2;
	players.value.second = 360 - optionsList.value.padSize/2;
	players.value.third = 540 - optionsList.value.padSize/2;
	players.value.forth = 540 - optionsList.value.padSize/2;
	ball.value.speed = 0;
	utils.value.start = false;
}

function checkCollisionWall () {
	const { ball, optionsList, screen } = useGameStore();
	if (ball.value.y < 0) {
		ball.value.y = 0;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
	}
	if (ball.value.y > 720 - optionsList.value.ballSize) {
		ball.value.y = 720 - optionsList.value.ballSize;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
	}
}

function checkCollisionPad () {
	const { ball, players, optionsList, scores, screen } = useGameStore();
	if (ball.value.x < 30) {
		ball.value.x = 30;
		if (ball.value.y + optionsList.value.ballSize > players.value.first && ball.value.y < players.value.first + optionsList.value.padSize) {
			if (optionsList.value.sound && !screen.value.preview) {
				let bonk = new Audio('/bonk.mp3');
				bonk.play();
			}
			ball.value.speed++;
			if (optionsList.value.randomizer) {
				optionsList.value.ballSize = Math.floor(Math.random() * 45) + 5;
				if (ball.value.x + optionsList.value.ballSize > 1050)
					ball.value.x = 1050 - optionsList.value.ballSize - 1;
				optionsList.value.padSize = Math.floor(Math.random() * 250) + 50;
			}
			if (ball.value.y + optionsList.value.ballSize/2 < players.value.first + optionsList.value.padSize/2) {
				ball.value.dir = 0 - ((players.value.first + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
				if (ball.value.dir < - Math.PI/4)
					ball.value.dir = - Math.PI/4;
			}
			else {
				ball.value.dir = (ball.value.y - (players.value.first + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4
				if (ball.value.dir > Math.PI/4)
					ball.value.dir = Math.PI/4;
			}
		}
		else {
			if (optionsList.value.sound && !screen.value.preview) {
				let coin = new Audio('/coin.mp3');
				coin.play();
			}
			scores.value.player2++;
			ball.value.dir = Math.PI * 5 / 6;
			resetPlay();
		}
	}
	if (ball.value.x > (1080 - 30) - optionsList.value.ballSize) {
		ball.value.x = (1080 - 30) - optionsList.value.ballSize;
		if (ball.value.y + optionsList.value.ballSize > players.value.second && ball.value.y < players.value.second + optionsList.value.padSize) {
			if (optionsList.value.sound && !screen.value.preview) {
				let bonk = new Audio('/bonk.mp3');
				bonk.play();
			}
			ball.value.speed++;
			if (optionsList.value.randomizer) {
				optionsList.value.ballSize = Math.floor(Math.random() * 45) + 5;
				if (ball.value.x + optionsList.value.ballSize > 1050)
					ball.value.x = 1050 - optionsList.value.ballSize - 1;
				optionsList.value.padSize = Math.floor(Math.random() * 250) + 50;
			}
			if (ball.value.y + optionsList.value.ballSize/2 < players.value.second + optionsList.value.padSize/2) {
				ball.value.dir = Math.PI + ((players.value.second + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
				if (ball.value.dir > Math.PI * 5/4)
					ball.value.dir = Math.PI * 5/4;
			}
			else {
				ball.value.dir = Math.PI - ((ball.value.y - (players.value.second + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4)
				if (ball.value.dir < Math.PI * 3/4)
					ball.value.dir = Math.PI * 3/4;
			}
		}
		else {
			if (optionsList.value.sound && !screen.value.preview) {
				let coin = new Audio('/coin.mp3');
				coin.play();
			}
			scores.value.player1++;
			ball.value.dir = Math.PI / 6;
			resetPlay();
		}
	}
}

function CollisionPadLeft () {
	const { ball, players, optionsList, activePlayer, screen } = useGameStore();
	ball.value.x = 30;
	if (ball.value.y + optionsList.value.ballSize > players.value.first && ball.value.y < players.value.first + optionsList.value.padSize) {
		ball.value.speed++;
		if (optionsList.value.randomizer) {
			optionsList.value.ballSize = Math.floor(Math.random() * 45) + 5;
			if (ball.value.x + optionsList.value.ballSize > 1050)
				ball.value.x = 1050 - optionsList.value.ballSize - 1;
			optionsList.value.padSize = Math.floor(Math.random() * 250) + 50;
		}
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		if (ball.value.y + optionsList.value.ballSize/2 < players.value.first + optionsList.value.padSize/2) {
			ball.value.dir = 0 - ((players.value.first + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir < - Math.PI/4)
				ball.value.dir = - Math.PI/4;
		}
		else {
			ball.value.dir = (ball.value.y - (players.value.first + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4
			if (ball.value.dir > Math.PI/4)
				ball.value.dir = Math.PI/4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		activePlayer.value.left = false;
		ball.value.dir = Math.PI * 5 / 6;
		resetPlay();
	}
}

function CollisionPadRight () {
	const { ball, players, optionsList, activePlayer, screen } = useGameStore();
	ball.value.x = (1080 - 30) - optionsList.value.ballSize;
	if (ball.value.y + optionsList.value.ballSize > players.value.second && ball.value.y < players.value.second + optionsList.value.padSize) {
		ball.value.speed++;
		if (optionsList.value.randomizer) {
			optionsList.value.ballSize = Math.floor(Math.random() * 45) + 5;
			if (ball.value.x + optionsList.value.ballSize > 1050)
				ball.value.x = 1050 - optionsList.value.ballSize - 1;
			optionsList.value.padSize = Math.floor(Math.random() * 250) + 50;
		}
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		if (ball.value.y + optionsList.value.ballSize/2 < players.value.second + optionsList.value.padSize/2) {
			ball.value.dir = Math.PI + ((players.value.second + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir > Math.PI * 5/4)
				ball.value.dir = Math.PI * 5/4;
		}
		else {
			ball.value.dir = Math.PI - ((ball.value.y - (players.value.second + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir < Math.PI * 3/4)
				ball.value.dir = Math.PI * 3/4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		activePlayer.value.right = false;
		ball.value.dir = Math.PI / 6;
		resetPlay();
	}
}

function CollisionPadTop () {
	const { ball, players, optionsList, activePlayer, screen } = useGameStore();
	ball.value.y = 30;
	if (ball.value.x + optionsList.value.ballSize > players.value.third && ball.value.x < players.value.third + optionsList.value.padSize) {
		ball.value.speed++;
		if (optionsList.value.randomizer) {
			optionsList.value.ballSize = Math.floor(Math.random() * 45) + 5;
			if (ball.value.x + optionsList.value.ballSize > 1050)
				ball.value.x = 1050 - optionsList.value.ballSize - 1;
			optionsList.value.padSize = Math.floor(Math.random() * 250) + 50;
		}
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		if (ball.value.x + optionsList.value.ballSize/2 < players.value.third + optionsList.value.padSize/2) {
			ball.value.dir = Math.PI/2 + ((players.value.third + optionsList.value.padSize/2 - ball.value.x) / optionsList.value.padSize/2 * Math.PI * 3/4)
			if (ball.value.dir > Math.PI * 3/4)
				ball.value.dir = Math.PI * 3/4;
		}
		else {
			ball.value.dir = (ball.value.x - (players.value.third + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI * 3/4
			if (ball.value.dir < Math.PI / 4)
				ball.value.dir = Math.PI / 4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		activePlayer.value.top = false;
		ball.value.dir = Math.PI * 8 / 6;
		resetPlay();
	}
}

function CollisionPadBottom () {
	const { ball, players, optionsList, activePlayer, screen } = useGameStore();
	ball.value.y = (720 - 30) - optionsList.value.ballSize;
	if (ball.value.x + optionsList.value.ballSize > players.value.forth && ball.value.x < players.value.forth + optionsList.value.padSize) {
		ball.value.speed++;
		if (optionsList.value.randomizer) {
			optionsList.value.ballSize = Math.floor(Math.random() * 45) + 5;
			if (ball.value.x + optionsList.value.ballSize > 1050)
				ball.value.x = 1050 - optionsList.value.ballSize - 1;
			optionsList.value.padSize = Math.floor(Math.random() * 250) + 50;
		}
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		if (ball.value.x + optionsList.value.ballSize/2 < players.value.forth + optionsList.value.padSize/2) {
			ball.value.dir = Math.PI * 3/2 - ((players.value.forth + optionsList.value.padSize/2 - ball.value.x) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir < Math.PI * 5/4)
				ball.value.dir = Math.PI * 5/4;
		}
		else {
			ball.value.dir = Math.PI * 3/2 + ((ball.value.x - (players.value.forth + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI * 4)
			if (ball.value.dir > Math.PI * 7 / 4)
				ball.value.dir = Math.PI * 7 / 4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		activePlayer.value.bottom = false;
		ball.value.dir = Math.PI * 4 / 6;
		resetPlay();
	}
}

function checkCollisionPadActive () {
	const { ball, optionsList, activePlayer, screen } = useGameStore();
	//GAUCHE
	if (ball.value.x < 30 && activePlayer.value.left)
		CollisionPadLeft();
	else if (ball.value.x < 0 && !activePlayer.value.left) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.x = 0;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//DROITE
	if (ball.value.x > (1080 - 30) - optionsList.value.ballSize && activePlayer.value.right)
		CollisionPadRight();
	else if (ball.value.x > 1080 - optionsList.value.ballSize && !activePlayer.value.right) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.x = 1080 - optionsList.value.ballSize;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//HAUT
	if (ball.value.y < 30 && activePlayer.value.top)
		CollisionPadTop();
	else if (ball.value.y < 0 && !activePlayer.value.top) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.y = 0;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
	//BAS
	if (ball.value.y > (720 - 30) - optionsList.value.ballSize && activePlayer.value.bottom)
		CollisionPadBottom();
	else if (ball.value.y > 720 - optionsList.value.ballSize && !activePlayer.value.bottom) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.y = 720 - optionsList.value.ballSize;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
}

function checkEndPlay () {
	const { scores, activePlayer, optionsList, screen } = useGameStore();
	let numPlayerActive = 0;
	if (activePlayer.value.top)
		numPlayerActive++;
	if (activePlayer.value.bottom)
		numPlayerActive++;
	if (activePlayer.value.left)
		numPlayerActive++;
	if (activePlayer.value.right)
		numPlayerActive++;
	if (numPlayerActive < 2) {
		if (optionsList.value.sound && !screen.value.preview) {
			let coin = new Audio('/coin.mp3');
			coin.play();
		}
		if (activePlayer.value.top)
			scores.value.player3++;
		if (activePlayer.value.bottom)
			scores.value.player4++;
		if (activePlayer.value.left)
			scores.value.player1++;
		if (activePlayer.value.right)
			scores.value.player2++;
		activePlayer.value.top = true;
		activePlayer.value.bottom = true;
		activePlayer.value.left = true;
		activePlayer.value.right = true;
	}
}

function moveBall () {
	const { ball } = useGameStore();
	ball.value.x += ball.value.speed * Math.cos(ball.value.dir);
	ball.value.y += ball.value.speed * Math.sin(ball.value.dir);
}

function isGameOver(scores: {player1: number, player2: number, player3: number, player4: number}, optionsList: gameOption){
	return scores.player1 >= optionsList.maxPoint
	|| scores.player2 >= optionsList.maxPoint
	|| scores.player3 >= optionsList.maxPoint
	|| scores.player4 >= optionsList.maxPoint
}

function reset(
	scores: ComputedRef<{player1: number, player2: number, player3: number, player4: number}>,
	ball: ComputedRef<{x: number, y: number, dir: number, speed: number}>,
	players: ComputedRef<{first: number, second: number, third: number, forth: number}>,
	optionsList: gameOption,
){
	scores.value.player1 = 0;
	scores.value.player2 = 0;
	scores.value.player3 = 0;
	scores.value.player4 = 0;
	ball.value.speed = 0;

	players.value.first = 360 - optionsList.padSize/2;
	players.value.second = 360 - optionsList.padSize/2;
	players.value.third = 540 - optionsList.padSize/2;
	players.value.forth = 540 - optionsList.padSize/2;

	ball.value.x = 540 - optionsList.ballSize/2;
	ball.value.y = 360 - optionsList.ballSize/2;

}

function gameTick(optionsList: gameOption, screen: ComputedRef<gameScreen>){
	gameController.executeMoves()
	moveBall();
	screen.value.preview = false;
	if (optionsList.numPlayer === 1)
		gameController.moveIA();
	if (optionsList.numPlayer === 1 || optionsList.numPlayer === 2) {
		checkCollisionWall();
		checkCollisionPad();
	}
	else if (optionsList.numPlayer === 4) {
		checkCollisionPadActive();
		checkEndPlay();
	}
}

export default {
	reset,
	isGameOver,
	gameTick,
}