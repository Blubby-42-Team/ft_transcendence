export function fetchCreateCustomLobby(
	userId: number,
	maxPoint: number,
    ballSize: number,
    padSize: number,
	callback: (lobbyId: string) => void,
){
	return HTTP_EDIT('POST', `/lobby/custom/${userId}`, {
		userId: userId,
		max_point: maxPoint,
		ball_size: ballSize,
		pad_size: padSize,
	}, callback);
}
