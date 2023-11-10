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

export default {
	keyEvent,
	executeKey,
}