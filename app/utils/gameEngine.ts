let coin = new Audio('/coin.mp3');
let waa = new Audio('/waa.mp3');

function resetPlay () {
	const { ball, players, optionsList, utils } = useGameStore();
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
	const { ball, optionsList } = useGameStore();
	if (ball.value.y < 0) {
		ball.value.y = 0;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
			bonk.play();
		}
	}
	if (ball.value.y > 720 - optionsList.value.ballSize) {
		ball.value.y = 720 - optionsList.value.ballSize;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
			bonk.play();
		}
	}
}

function checkCollisionPad () {
	const { ball, players, optionsList, scores } = useGameStore();
	if (ball.value.x < 30) {
		ball.value.x = 30;
		if (ball.value.y + optionsList.value.ballSize > players.value.first && ball.value.y < players.value.first + optionsList.value.padSize) {
			if (optionsList.value.sound === "on") {
				let bonk = new Audio('bonk.mp3');
				bonk.play()
			}
			ball.value.speed++;
			if (optionsList.value.randomizer === "on") {
				optionsList.value.ballSize = Math.floor(Math.random() * 50 + 1);
				optionsList.value.padSize = Math.floor(Math.random() * 300 + 10);
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
			if (optionsList.value.sound === "on")
				coin.play();
			scores.value.player2++;
			ball.value.dir = Math.PI * 5 / 6;
			resetPlay();
		}
	}
	if (ball.value.x > (1080 - 30) - optionsList.value.ballSize) {
		ball.value.x = (1080 - 30) - optionsList.value.ballSize;
		if (ball.value.y + optionsList.value.ballSize > players.value.second && ball.value.y < players.value.second + optionsList.value.padSize) {
			if (optionsList.value.sound === "on") {
				let bonk = new Audio('bonk.mp3');
				bonk.play()
			}
			ball.value.speed++;
			if (optionsList.value.randomizer === "on") {
				optionsList.value.ballSize = Math.floor(Math.random() * 50 + 1);
				optionsList.value.padSize = Math.floor(Math.random() * 300 + 10);
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
			if (optionsList.value.sound === "on")
				coin.play();
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
		if (optionsList.value.randomizer === "on") {
			optionsList.value.ballSize = Math.floor(Math.random() * 50 + 1);
			optionsList.value.padSize = Math.floor(Math.random() * 300 + 10);
		}
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
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
		if (optionsList.value.sound === "on")
			waa.play();
		activePlayer.value.left = false;
		ball.value.dir = Math.PI * 5 / 6;
		resetPlay();
	}
}

function CollisionPadRight () {
	const { ball, players, optionsList, activePlayer } = useGameStore();
	ball.value.x = (1080 - 30) - optionsList.value.ballSize;
	if (ball.value.y + optionsList.value.ballSize > players.value.second && ball.value.y < players.value.second + optionsList.value.padSize) {
		ball.value.speed++;
		if (optionsList.value.randomizer === "on") {
			optionsList.value.ballSize = Math.floor(Math.random() * 50 + 1);
			optionsList.value.padSize = Math.floor(Math.random() * 300 + 10);
		}
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
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
		if (optionsList.value.sound === "on")
			waa.play();
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
		if (optionsList.value.randomizer === "on") {
			optionsList.value.ballSize = Math.floor(Math.random() * 50 + 1);
			optionsList.value.padSize = Math.floor(Math.random() * 300 + 10);
		}
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
			bonk.play();
		}
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
		if (optionsList.value.sound === "on")
			waa.play();
		activePlayer.value.top = false;
		ball.value.dir = Math.PI * 8 / 6;
		resetPlay();
	}
}

function CollisionPadBottom () {
	const { ball, players, optionsList, activePlayer } = useGameStore();
	ball.value.y = (720 - 30) - optionsList.value.ballSize;
	if (ball.value.x + optionsList.value.ballSize > players.value.forth && ball.value.x < players.value.forth + optionsList.value.padSize) {
		ball.value.speed++;
		if (optionsList.value.randomizer === "on") {
			optionsList.value.ballSize = Math.floor(Math.random() * 50 + 1);
			optionsList.value.padSize = Math.floor(Math.random() * 300 + 10);
		}
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
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
		if (optionsList.value.sound === "on")
			waa.play();
		activePlayer.value.bottom = false;
		ball.value.dir = Math.PI * 4 / 6;
		resetPlay();
	}
}

function checkCollisionPadActive () {
	const { ball, optionsList, activePlayer } = useGameStore();
	//GAUCHE
	if (ball.value.x < 30 && activePlayer.value.left)
		CollisionPadLeft();
	else if (ball.value.x < 0 && !activePlayer.value.left) {
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
			bonk.play();
		}
		ball.value.x = 0;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//DROITE
	if (ball.value.x > (1080 - 30) - optionsList.value.ballSize && activePlayer.value.right)
		CollisionPadRight();
	else if (ball.value.x > 1080 - optionsList.value.ballSize && !activePlayer.value.right) {
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
			bonk.play();
		}
		ball.value.x = 1080 - optionsList.value.ballSize;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//HAUT
	if (ball.value.y < 30 && activePlayer.value.top)
		CollisionPadTop();
	else if (ball.value.y < 0 && !activePlayer.value.top) {
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
			bonk.play();
		}
		ball.value.y = 0;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
	//BAS
	if (ball.value.y > (720 - 30) - optionsList.value.ballSize && activePlayer.value.bottom)
		CollisionPadBottom();
	else if (ball.value.y > 720 - optionsList.value.ballSize && !activePlayer.value.bottom) {
		if (optionsList.value.sound === "on") {
			let bonk = new Audio('bonk.mp3');
			bonk.play();
		}
		ball.value.y = 720 - optionsList.value.ballSize;
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
		coin.play();
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