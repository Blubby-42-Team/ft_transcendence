<script setup lang="ts">

enum EGameStatus {
	NOT_STARTED,
	IN_PROGRESS,
	COMPLETED,
}

type PlayerID = number;

export interface IPlayerGameStatus {
	score: number;
	winner: boolean,
}

export interface ITournamentMatchNotStarted {
	player1: (ITournamentMatch) | { id: PlayerID };
	player2: (ITournamentMatch) | { id: PlayerID };
	status: EGameStatus.NOT_STARTED;
}

export interface ITournamentMatchInProgress {
	player1: (ITournamentMatch & { score: number }) | ({ id: PlayerID, score: number });
	player2: (ITournamentMatch & { score: number }) | ({ id: PlayerID, score: number });
	status: EGameStatus.IN_PROGRESS;
}

export interface ITournamentMatchCompleted {
	player1: (ITournamentMatch & { score: number, winner?: boolean }) | ({ id: PlayerID, score: number, winner?: boolean });
	player2: (ITournamentMatch & { score: number, winner?: boolean }) | ({ id: PlayerID, score: number, winner?: boolean });
	status: EGameStatus.COMPLETED;
}

export type ITournamentMatch = ITournamentMatchInProgress | ITournamentMatchNotStarted | ITournamentMatchCompleted

const tournament: ITournamentMatch = {
	player1: {
		player1: {
			player1: { id: 1 },
			player2: {
				player1: { id: 10, score: 1 },
				player2: { id: 11, score: 2, winner: true },
				status: EGameStatus.COMPLETED,
			},
			status: EGameStatus.NOT_STARTED,
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
}

</script>

<template>
	<div class="grid h-auto overflow-auto">

		<TournamentPreviewMatch :match="tournament"/>
	</div>
</template>



