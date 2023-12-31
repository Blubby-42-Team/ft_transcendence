export enum EGameStatus {
	NOT_STARTED,
	IN_PROGRESS,
	COMPLETED,
}

type PlayerID = number;

export type ITournamentMatch = {
	player1: (ITournamentMatch) | { id: PlayerID };
	player2: (ITournamentMatch) | { id: PlayerID };
	status: EGameStatus.NOT_STARTED;
} | {
	player1: (ITournamentMatch & { score: number }) | ({ id: PlayerID, score: number });
	player2: (ITournamentMatch & { score: number }) | ({ id: PlayerID, score: number });
	status: EGameStatus.IN_PROGRESS;
} | {
	player1: (ITournamentMatch & { score: number, winner?: boolean }) | ({ id: PlayerID, score: number, winner?: boolean });
	player2: (ITournamentMatch & { score: number, winner?: boolean }) | ({ id: PlayerID, score: number, winner?: boolean });
	status: EGameStatus.COMPLETED;
}

export interface ILazyTournamentMatch {
	player1: (ILazyTournamentMatch) & { id?: number, score?: number, winner?: boolean };
	player2: (ILazyTournamentMatch) & { id?: number, score?: number, winner?: boolean };
	status: EGameStatus;
}

export const useTournamentStore = defineStore('tournament', {
	state: (): {
		_tournament: ITournamentMatch;
	} => ({
		_tournament: {
			player1: {
				player1: {
					player1: { id: 1, score: 1 },
					player2: {
						score: 2,
						player1: { id: 10, score: 1 },
						player2: { id: 11, score: 2, winner: true },
						status: EGameStatus.COMPLETED,
					},
					status: EGameStatus.IN_PROGRESS,
				},
				player2: { id: 6 },
				status: EGameStatus.NOT_STARTED,
			},
			player2: {
				player1: {
					player1: { id: 6 },
					player2: { id: 5 },
					status: EGameStatus.NOT_STARTED,
				},
				player2: {
					player1: {
						player1: { id: 5 },
						player2: {
							player1: { id: 6 },
							player2: {
								player1: { id: 6 },
								player2: { id: 5 },
								status: EGameStatus.NOT_STARTED,
							},
							status: EGameStatus.NOT_STARTED,
						},
						status: EGameStatus.NOT_STARTED,
					},
					player2: {
						player1: { id: 6 },
						player2: {
							player1: { id: 6 },
							player2: {
								player1: {
									player1: {
										player1: { id: 5 },
										player2: { id: 6 },
										status: EGameStatus.NOT_STARTED,
									},
									player2: {
										player1: { id: 5 },
										player2: { id: 6 },
										status: EGameStatus.NOT_STARTED,
									},
									status: EGameStatus.NOT_STARTED,
								},
								player2: {
									player1: {
										player1: { id: 4 },
										player2: { id: 3 },
										status: EGameStatus.NOT_STARTED,
									},
									player2: { id: 2 },
									status: EGameStatus.NOT_STARTED,
								},
								status: EGameStatus.NOT_STARTED,
							},
							status: EGameStatus.NOT_STARTED,
						},
						status: EGameStatus.NOT_STARTED,
					},
					status: EGameStatus.NOT_STARTED,
				},
				status: EGameStatus.NOT_STARTED,
			},
			status: EGameStatus.NOT_STARTED,
		},
	}),
	getters: {
		tournament: (state) => computed(() => state._tournament),
	},
	actions: {
	},
})
