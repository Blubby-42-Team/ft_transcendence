function moveW () {
	const { players } = useGameStore();
	players.value.first -= 20;
	if (players.value.first < 0) {players.value.first = 0}
}

function moveS () {
	const { players, screen, optionsList } = useGameStore();
	players.value.first += 20;
	if (players.value.first > screen.value.height - optionsList.value.padSize) {players.value.first = screen.value.height - optionsList.value.padSize}
}

function moveUp () {
	const { players } = useGameStore();
	players.value.second -= 20;
	if (players.value.second < 0) {players.value.second = 0}
}

function moveDown () {
	const { players, screen, optionsList } = useGameStore();
	players.value.second += 20;
	if (players.value.second > screen.value.height - optionsList.value.padSize) {players.value.second = screen.value.height - optionsList.value.padSize}
}

function moveC () {
	const { players } = useGameStore();
	players.value.forth -= 30;
	if (players.value.forth < 0) {players.value.forth = 0}
}

function moveV () {
	const { players, screen, optionsList } = useGameStore();
	players.value.forth += 30;
	if (players.value.forth > screen.value.width - optionsList.value.padSize) {players.value.forth = screen.value.width - optionsList.value.padSize}
}

function moveU () {
	const { players } = useGameStore();
	players.value.third -= 30;
	if (players.value.third < 0) {players.value.third = 0}
}

function moveI () {
	const { players, screen, optionsList } = useGameStore();
	players.value.third += 30;
	if (players.value.third > screen.value.width - optionsList.value.padSize) {players.value.third = screen.value.width - optionsList.value.padSize}
}

function executeMoves () {
	const { controller } = useGameStore();
	Object.keys(controller.value).forEach(key=> {
		controller.value[key].pressed && controller.value[key].func()
	})
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
	executeMoves
}