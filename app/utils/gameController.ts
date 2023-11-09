enum MoveDirection {
	VERTICAL,
	HORIZONTAL,
};

function move(player: gamePlayer, dir: MoveDirection, delta: number, padSize: number){
	console.log('here')
	if (!player.active || player.isBot){
		return ;
	}
	if (dir === MoveDirection.VERTICAL){
		if (0 + padSize < player.position + delta && player.position + delta < 720 - padSize)
			player.position += delta;
		else if (0 +padSize > player.position + delta){
			player.position = 0 + padSize;
		}
		else if (player.position + delta > 720 - padSize){
			player.position = 720 - padSize;
		}
	}
	else if (dir === MoveDirection.HORIZONTAL){
		if (0 + padSize < player.position + delta && player.position + delta < 1080 - padSize)
			player.position += delta;
		else if (0 +padSize > player.position + delta){
			player.position = 0 + padSize;
		}
		else if (player.position + delta > 1080 - padSize){
			player.position = 1080 - padSize;
		}
	}
}


function moveW() {
	const { player, optionsList } = useGameStore();
	move(player.value.left, MoveDirection.VERTICAL, -20, optionsList.value.padSize)
}

function moveS() {
	const { player, optionsList } = useGameStore();
	move(player.value.left, MoveDirection.VERTICAL, 20, optionsList.value.padSize)
}

function moveUp() {
	const { player, optionsList } = useGameStore();
	move(player.value.right, MoveDirection.VERTICAL, -20, optionsList.value.padSize)
}

function moveDown() {
	const { player, optionsList } = useGameStore();
	move(player.value.right, MoveDirection.VERTICAL, 20, optionsList.value.padSize)
}

function moveC() {
	const { player, optionsList } = useGameStore();
	move(player.value.bottom, MoveDirection.HORIZONTAL, -20, optionsList.value.padSize)
}

function moveV() {
	const { player, optionsList } = useGameStore();
	move(player.value.bottom, MoveDirection.HORIZONTAL, 20, optionsList.value.padSize)
}

function moveU() {
	const { player, optionsList } = useGameStore();
	move(player.value.top, MoveDirection.HORIZONTAL, -20, optionsList.value.padSize)
}

function moveI() {
	const { player, optionsList } = useGameStore();
	move(player.value.top, MoveDirection.HORIZONTAL, 20, optionsList.value.padSize)
}

function executeMoves() {
	const { controller } = useGameStore();
	Object.keys(controller.value).forEach((key) => {
		if (controller.value[key].pressed){
			controller.value[key].func()
		}
	})
}

function IASpeed(optionsList: gameOption) {
	if (optionsList.mode === "easy")
		return 2;
	else if (optionsList.mode === "hard")
		return 5;
	else
		return 10;
}

function moveIA() {
	const { optionsList, player, ball } = useGameStore();
	if (player.value.left.isBot){
		if (player.value.left.position > ball.value.y + optionsList.value.ballSize)
			player.value.left.position -= IASpeed(optionsList.value);
		else if (player.value.left.position + optionsList.value.padSize < ball.value.y)
			player.value.left.position += IASpeed(optionsList.value);
	}
	if (player.value.right.isBot){
		if (player.value.right.position > ball.value.y + optionsList.value.ballSize)
			player.value.right.position -= IASpeed(optionsList.value);
		else if (player.value.right.position + optionsList.value.padSize < ball.value.y)
			player.value.right.position += IASpeed(optionsList.value);
	}
	if (player.value.top.isBot){
		if (player.value.top.position > ball.value.x + optionsList.value.ballSize)
			player.value.top.position -= IASpeed(optionsList.value) * 3/2;
		else if (player.value.top.position + optionsList.value.padSize < ball.value.x)
			player.value.top.position += IASpeed(optionsList.value) * 3/2;
	}
	if (player.value.bottom.isBot){
		if (player.value.bottom.position > ball.value.x + optionsList.value.ballSize)
			player.value.bottom.position -= IASpeed(optionsList.value) * 3/2;
		else if (player.value.bottom.position + optionsList.value.padSize < ball.value.x)
			player.value.bottom.position += IASpeed(optionsList.value) * 3/2;
	}
}


export default {
	moveW,
	moveS,
	moveUp,
	moveDown,
	moveC,
	moveV,
	moveU,
	moveI,
	executeMoves,
	moveIA,
}