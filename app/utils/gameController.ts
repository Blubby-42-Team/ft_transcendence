function moveW () {
	const { players, optionsList } = useGameStore();
	if (optionsList.value.numPlayer !== 1)
		players.value.first -= 20;
	if (players.value.first < 0) {players.value.first = 0}
}

function moveS () {
	const { players, screen, optionsList } = useGameStore();
	if (optionsList.value.numPlayer !== 1)
		players.value.first += 20;
	if (players.value.first > 720 - optionsList.value.padSize) {players.value.first = 720 - optionsList.value.padSize}
}

function moveUp () {
	const { players } = useGameStore();
	players.value.second -= 20;
	if (players.value.second < 0) {players.value.second = 0}
}

function moveDown () {
	const { players, screen, optionsList } = useGameStore();
	players.value.second += 20;
	if (players.value.second > 720 - optionsList.value.padSize) {players.value.second = 720 - optionsList.value.padSize}
}

function moveC () {
	const { players } = useGameStore();
	players.value.forth -= 30;
	if (players.value.forth < 0) {players.value.forth = 0}
}

function moveV () {
	const { players, screen, optionsList } = useGameStore();
	players.value.forth += 30;
	if (players.value.forth > 1080 - optionsList.value.padSize) {players.value.forth = 1080 - optionsList.value.padSize}
}

function moveU () {
	const { players } = useGameStore();
	players.value.third -= 30;
	if (players.value.third < 0) {players.value.third = 0}
}

function moveI () {
	const { players, screen, optionsList } = useGameStore();
	players.value.third += 30;
	if (players.value.third > 1080 - optionsList.value.padSize) {players.value.third = 1080 - optionsList.value.padSize}
}

function executeMoves () {
	const { controller } = useGameStore();
	Object.keys(controller.value).forEach(key=> {
		controller.value[key].pressed && controller.value[key].func()
	})
}

function IASpeed () {
	const { optionsList } = useGameStore();
	if (optionsList.value.mode === "easy")
		return 2;
	else if (optionsList.value.mode === "hard")
		return 5;
	else
		return 10;
}

function moveIA () {
	const { optionsList, players, ball } = useGameStore();
	if (players.value.first > ball.value.y + optionsList.value.ballSize)
		players.value.first -= IASpeed();
	else if (players.value.first + optionsList.value.padSize < ball.value.y)
		players.value.first += IASpeed();
}

function moveIASec () {
	const { optionsList, players, ball } = useGameStore();
	if (players.value.second > ball.value.y + optionsList.value.ballSize)
		players.value.second -= IASpeed();
	else if (players.value.second + optionsList.value.padSize < ball.value.y)
		players.value.second += IASpeed();
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
	moveIASec
}