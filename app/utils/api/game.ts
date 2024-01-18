export function fetchCreateCustomLobby(
	userId: number,
	maxPoint: number,
    ballSize: number,
    padSize: number,
	callback: (lobbyId: string) => void,
){
	return HTTP_EDIT('POST', `/game`, {
		userId: userId,
		max_round: maxPoint,
		ball_size: ballSize,
		pad_size: padSize,
	}, callback);
}
