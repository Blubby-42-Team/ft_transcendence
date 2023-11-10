function resetPlay () {
	const { optionsList } = useGameStore();
	if (optionsList.value.randomizer) {
		optionsList.value.ballSize = 15;
		optionsList.value.padSize = 100;
	}
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
	const { ball, player, optionsList, screen } = useGameStore();
	if (ball.value.x < 30) {
		ball.value.x = 30;
		if (ball.value.y + optionsList.value.ballSize > player.value.left.position && ball.value.y < player.value.left.position + optionsList.value.padSize) {
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
			if (ball.value.y + optionsList.value.ballSize/2 < player.value.left.position + optionsList.value.padSize/2) {
				ball.value.dir = 0 - ((player.value.left.position + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
				if (ball.value.dir < - Math.PI/4)
					ball.value.dir = - Math.PI/4;
			}
			else {
				ball.value.dir = (ball.value.y - (player.value.left.position + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4
				if (ball.value.dir > Math.PI/4)
					ball.value.dir = Math.PI/4;
			}
		}
		else {
			if (optionsList.value.sound && !screen.value.preview) {
				let coin = new Audio('/coin.mp3');
				coin.play();
			}
			player.value.right.score++;
			ball.value.dir = Math.PI * 5 / 6;
			resetPlay();
		}
	}
	if (ball.value.x > (1080 - 30) - optionsList.value.ballSize) {
		ball.value.x = (1080 - 30) - optionsList.value.ballSize;
		if (ball.value.y + optionsList.value.ballSize > player.value.right.position && ball.value.y < player.value.right.position + optionsList.value.padSize) {
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
			if (ball.value.y + optionsList.value.ballSize/2 < player.value.right.position + optionsList.value.padSize/2) {
				ball.value.dir = Math.PI + ((player.value.right.position + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
				if (ball.value.dir > Math.PI * 5/4)
					ball.value.dir = Math.PI * 5/4;
			}
			else {
				ball.value.dir = Math.PI - ((ball.value.y - (player.value.right.position + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4)
				if (ball.value.dir < Math.PI * 3/4)
					ball.value.dir = Math.PI * 3/4;
			}
		}
		else {
			if (optionsList.value.sound && !screen.value.preview) {
				let coin = new Audio('/coin.mp3');
				coin.play();
			}
			player.value.left.score++;
			ball.value.dir = Math.PI / 6;
			resetPlay();
		}
	}
}

function CollisionPadLeft () {
	const { ball, player, optionsList, screen } = useGameStore();
	ball.value.x = 30;
	if (ball.value.y + optionsList.value.ballSize > player.value.left.position && ball.value.y < player.value.left.position + optionsList.value.padSize) {
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
		if (ball.value.y + optionsList.value.ballSize/2 < player.value.left.position + optionsList.value.padSize/2) {
			ball.value.dir = 0 - ((player.value.left.position + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir < - Math.PI/4)
				ball.value.dir = - Math.PI/4;
		}
		else {
			ball.value.dir = (ball.value.y - (player.value.left.position + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4
			if (ball.value.dir > Math.PI/4)
				ball.value.dir = Math.PI/4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		player.value.left.active = false;
		ball.value.dir = Math.PI * 5 / 6;
		resetPlay();
	}
}

function CollisionPadRight () {
	const { ball, player, optionsList, screen } = useGameStore();
	ball.value.x = (1080 - 30) - optionsList.value.ballSize;
	if (ball.value.y + optionsList.value.ballSize > player.value.right.position && ball.value.y < player.value.right.position + optionsList.value.padSize) {
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
		if (ball.value.y + optionsList.value.ballSize/2 < player.value.right.position + optionsList.value.padSize/2) {
			ball.value.dir = Math.PI + ((player.value.right.position + optionsList.value.padSize/2 - ball.value.y) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir > Math.PI * 5/4)
				ball.value.dir = Math.PI * 5/4;
		}
		else {
			ball.value.dir = Math.PI - ((ball.value.y - (player.value.right.position + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir < Math.PI * 3/4)
				ball.value.dir = Math.PI * 3/4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		player.value.right.active = false;
		ball.value.dir = Math.PI / 6;
		resetPlay();
	}
}

function CollisionPadTop () {
	const { ball, player, optionsList, screen } = useGameStore();
	ball.value.y = 30;
	if (ball.value.x + optionsList.value.ballSize > player.value.top.position && ball.value.x < player.value.top.position + optionsList.value.padSize) {
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
		if (ball.value.x + optionsList.value.ballSize/2 < player.value.top.position + optionsList.value.padSize/2) {
			ball.value.dir = Math.PI/2 + ((player.value.top.position + optionsList.value.padSize/2 - ball.value.x) / optionsList.value.padSize/2 * Math.PI * 3/4)
			if (ball.value.dir > Math.PI * 3/4)
				ball.value.dir = Math.PI * 3/4;
		}
		else {
			ball.value.dir = (ball.value.x - (player.value.top.position + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI * 3/4
			if (ball.value.dir < Math.PI / 4)
				ball.value.dir = Math.PI / 4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		player.value.top.active = false;
		ball.value.dir = Math.PI * 8 / 6;
		resetPlay();
	}
}

function CollisionPadBottom () {
	const { ball, player, optionsList, screen } = useGameStore();
	ball.value.y = (720 - 30) - optionsList.value.ballSize;
	if (ball.value.x + optionsList.value.ballSize > player.value.bottom.position && ball.value.x < player.value.bottom.position + optionsList.value.padSize) {
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
		if (ball.value.x + optionsList.value.ballSize/2 < player.value.bottom.position + optionsList.value.padSize/2) {
			ball.value.dir = Math.PI * 3/2 - ((player.value.bottom.position + optionsList.value.padSize/2 - ball.value.x) / optionsList.value.padSize/2 * Math.PI/4)
			if (ball.value.dir < Math.PI * 5/4)
				ball.value.dir = Math.PI * 5/4;
		}
		else {
			ball.value.dir = Math.PI * 3/2 + ((ball.value.x - (player.value.bottom.position + optionsList.value.padSize/2)) / optionsList.value.padSize/2 * Math.PI * 4)
			if (ball.value.dir > Math.PI * 7 / 4)
				ball.value.dir = Math.PI * 7 / 4;
		}
	}
	else {
		if (optionsList.value.sound && !screen.value.preview) {
			let waa = new Audio('/waa.mp3');
			waa.play();
		}
		player.value.bottom.active = false;
		ball.value.dir = Math.PI * 4 / 6;
		resetPlay();
	}
}

function checkCollisionPadActive () {
	const { ball, optionsList, player, screen } = useGameStore();
	//GAUCHE
	if (ball.value.x < 30 && player.value.left.active)
		CollisionPadLeft();
	else if (ball.value.x < 0 && !player.value.left.active) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.x = 0;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//DROITE
	if (ball.value.x > (1080 - 30) - optionsList.value.ballSize && player.value.right.active)
		CollisionPadRight();
	else if (ball.value.x > 1080 - optionsList.value.ballSize && !player.value.right.active) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.x = 1080 - optionsList.value.ballSize;
		ball.value.dir = Math.PI - ball.value.dir;
	}
	//HAUT
	if (ball.value.y < 30 && player.value.top.active)
		CollisionPadTop();
	else if (ball.value.y < 0 && !player.value.top.active) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.y = 0;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
	//BAS
	if (ball.value.y > (720 - 30) - optionsList.value.ballSize && player.value.bottom.active)
		CollisionPadBottom();
	else if (ball.value.y > 720 - optionsList.value.ballSize && !player.value.bottom.active) {
		if (optionsList.value.sound && !screen.value.preview) {
			let bonk = new Audio('/bonk.mp3');
			bonk.play();
		}
		ball.value.y = 720 - optionsList.value.ballSize;
		ball.value.dir = 2 * Math.PI - ball.value.dir;
	}
}

function checkEndPlay () {
	const { player, optionsList, screen } = useGameStore();
	let numPlayerActive = 0;
	if (player.value.top.active)
		numPlayerActive++;
	if (player.value.bottom.active)
		numPlayerActive++;
	if (player.value.left.active)
		numPlayerActive++;
	if (player.value.right.active)
		numPlayerActive++;
	if (numPlayerActive < 2) {
		if (optionsList.value.sound && !screen.value.preview) {
			let coin = new Audio('/coin.mp3');
			coin.play();
		}
		if (player.value.top.active)
			player.value.top.score++;
		if (player.value.bottom.active)
			player.value.bottom.score++;
		if (player.value.left.active)
			player.value.left.score++;
		if (player.value.right.active)
			player.value.right.score++;
		player.value.top.active = true;
		player.value.bottom.active = true;
		player.value.left.active = true;
		player.value.right.active = true;
	}
}

function moveBall () {
	const { ball } = useGameStore();
	ball.value.x += ball.value.speed * Math.cos(ball.value.dir);
	ball.value.y += ball.value.speed * Math.sin(ball.value.dir);
}

function isGameOver(player: gamePlayers, optionsList: gameOption){
	return player.top.score >= optionsList.maxPoint
	|| player.bottom.score >= optionsList.maxPoint
	|| player.left.score >= optionsList.maxPoint
	|| player.right.score >= optionsList.maxPoint
}

function moveIA(
	player: ComputedRef<gamePlayers>,
	ball: ComputedRef<gameBall>,
	IASpeed: number,
	ballSize: number,
	padSize: number
){
	if (player.value.left.isBot){
		if (player.value.left.position > ball.value.y + ballSize)
			player.value.left.position -= IASpeed;
		else if (player.value.left.position + padSize < ball.value.y)
			player.value.left.position += IASpeed;
	}
	if (player.value.right.isBot){
		if (player.value.right.position > ball.value.y + ballSize)
			player.value.right.position -= IASpeed;
		else if (player.value.right.position + padSize < ball.value.y)
			player.value.right.position += IASpeed;
	}
	if (player.value.top.isBot){
		if (player.value.top.position > ball.value.x + ballSize)
			player.value.top.position -= IASpeed * 3/2;
		else if (player.value.top.position + padSize < ball.value.x)
			player.value.top.position += IASpeed * 3/2;
	}
	if (player.value.bottom.isBot){
		if (player.value.bottom.position > ball.value.x + ballSize)
			player.value.bottom.position -= IASpeed * 3/2;
		else if (player.value.bottom.position + padSize < ball.value.x)
			player.value.bottom.position += IASpeed * 3/2;
	}
}

function gameTick(optionsList: gameOption, utils: ComputedRef<gameUtils>, screen: ComputedRef<gameScreen>, ball: ComputedRef<gameBall>, player: ComputedRef<gamePlayers>){
	moveBall();
	screen.value.preview = false;
	if (optionsList.numPlayer === 1)
		moveIA(player, ball, utils.value.iaSpeed, optionsList.ballSize, optionsList.padSize);
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
	isGameOver,
	gameTick,
}