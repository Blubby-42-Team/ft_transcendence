function keyEvent(controller: gameControllerType, keyName: string, status: boolean){
	if(controller.hasOwnProperty(keyName))
		controller[keyName].pressed = status;
}

function executeKey(controller: gameControllerType) {
	Object.keys(controller).forEach((key) => {
		if (controller[key].pressed){
			controller[key].func()
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
	keyEvent,
	executeKey,
	moveIA,
}