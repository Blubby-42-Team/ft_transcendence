function resetPlay () {
	const { ball, players, screen, optionsList, utils } = useGameStore();
	ball.value.x = screen.value.width/2 - optionsList.value.ballSize/2;
	ball.value.y = screen.value.height/2 - optionsList.value.ballSize/2;
	players.value.first = screen.value.height/2 - optionsList.value.padSize/2;
	players.value.second = screen.value.height/2 - optionsList.value.padSize/2;
	players.value.third = screen.value.width/2 - optionsList.value.padSize/2;
	players.value.forth = screen.value.width/2 - optionsList.value.padSize/2;
	ball.value.speed = 0;
	utils.value.start = false;
}

function checkCollisionWall () {
	const { ball, screen, optionsList } = useGameStore();
	if (ball.value.y < 0) {
		ball.value.y = 0;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
	if (ball.value.y > screen.value.height - optionsList.value.ballSize) {
		ball.value.y = screen.value.height - optionsList.value.ballSize;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
}

function checkCollisionPad () {
	const { ball, players, screen, optionsList, scores } = useGameStore();
	if (ball.value.x < 30) {
		ball.value.x = 30;
		if (ball.value.y + optionsList.value.ballSize > players.value.first && ball.value.y < players.value.first + optionsList.value.padSize) {
			ball.value.speed++;
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
			scores.value.player2++;
			ball.value.dir = Math.PI * 5 / 6;
			resetPlay();
		}
	}
	if (ball.value.x > (screen.value.width - 30) - optionsList.value.ballSize) {
		ball.value.x = (screen.value.width - 30) - optionsList.value.ballSize;
		if (ball.value.y + optionsList.value.ballSize > players.value.second && ball.value.y < players.value.second + optionsList.value.padSize) {
			ball.value.speed++;
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
			scores.value.player1++;
			ball.value.dir = Math.PI / 6;
			resetPlay();
		}
	}
}

function CollisionPadLeft () {
	const { ball, players, optionsList, activePlayer } = useGameStore();
	ball.value.x = 30;
	if (ball.value.y + optionsList.value.ballSize > players.value.first && ball.value.y < players.value.first + optionsList.value.padSize) {
		ball.value.speed++;
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
		activePlayer.value.left = false;
		ball.value.dir = Math.PI * 5 / 6;
		resetPlay();
	}
}

function CollisionPadRight () {
	const { ball, players, optionsList, activePlayer, screen } = useGameStore();
	ball.value.x = (screen.value.width - 30) - optionsList.value.ballSize;
	if (ball.value.y + optionsList.value.ballSize > players.value.second && ball.value.y < players.value.second + optionsList.value.padSize) {
		ball.value.speed++;
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
		activePlayer.value.right = false;
		ball.value.dir = Math.PI / 6;
		resetPlay();
	}
}

function CollisionPadTop () {
	const { ball, players, optionsList, activePlayer } = useGameStore();
	ball.value.y = 30;
	if (ball.value.x + optionsList.value.ballSize > players.value.third && ball.value.x < players.value.third + optionsList.value.padSize) {
		ball.value.speed++;
		if (ball.value.x + optionsList.value.ballSize/2 < players.value.third + optionsList.value.padSize/2) {
			ball.value.dir = 0 - ((players.value.third + optionsList.value.padSize/2 - ball.value.x) / optionsList.value.padSize/2 * Math.PI * 3/4)
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
		activePlayer.value.top = false;
		ball.value.dir = Math.PI * 8 / 6;
		resetPlay();
	}
}

function CollisionPadBottom () {
	const { ball, players, optionsList, activePlayer, screen } = useGameStore();
	ball.value.y = (screen.value.height - 30) - optionsList.value.ballSize;
	if (ball.value.x + optionsList.value.ballSize > players.value.forth && ball.value.x < players.value.forth + optionsList.value.padSize) {
		ball.value.speed++;
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
		activePlayer.value.bottom = false;
		ball.value.dir = Math.PI * 4 / 6;
		resetPlay();
	}
}

function checkCollisionPadActive () {
	const { ball, screen, optionsList, activePlayer } = useGameStore();
	//GAUCHE
	if (ball.value.x < 30 && activePlayer.value.left)
		CollisionPadLeft();
	else if (ball.value.x < 0 && !activePlayer.value.left) {
		ball.value.x = 0;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//DROITE
	if (ball.value.x > (screen.value.width - 30) - optionsList.value.ballSize && activePlayer.value.right)
		CollisionPadRight();
	else if (ball.value.x > screen.value.width - optionsList.value.ballSize && !activePlayer.value.right) {
		ball.value.x = screen.value.width - optionsList.value.ballSize;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//HAUT
	if (ball.value.y < 30 && activePlayer.value.top)
		CollisionPadTop();
	else if (ball.value.y < 0 && !activePlayer.value.top) {
		ball.value.y = 0;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
	//BAS
	if (ball.value.y > (screen.value.height - 30) - optionsList.value.ballSize && activePlayer.value.bottom)
		CollisionPadBottom();
	else if (ball.value.y > screen.value.height - optionsList.value.ballSize && !activePlayer.value.bottom) {
		ball.value.y = screen.value.height - optionsList.value.ballSize;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
}

function checkEndPlay () {
	const { scores, activePlayer } = useGameStore();
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

export default {
	checkCollisionWall,
	checkCollisionPad,
	checkCollisionPadActive,
	checkEndPlay,
	moveBall
}