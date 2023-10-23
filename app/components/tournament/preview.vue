<script setup lang="ts">

const nbPlayer = useState<number>('nbPlayer');

// const tournament: ComputedRef<globalThis.ITournament> = computed(() => { return {
// 	id: 'test',
// 	name: 'hello',
// 	attendance: 8,
// 	maxAttendance: 4,
// }})

export interface ITournamentMatch {
	player1: ITournamentMatch | number,
	player2: ITournamentMatch | number,
}

const tournament: ITournamentMatch = {
	player1: {
		player1: {
			player1: 6,
			player2: {
				player1: 6,
				player2: 5,
			},
		},
		player2: 4
	},
	player2: {
		player1: {
			player1: 6,
			player2: 5,
		},
		player2: {
			player1: {
				player1: 6,
				player2: {
					player1: 6,
					player2: {
						player1: 6,
						player2: 5,
					},
				},
			},
			player2: {
				player1: 6,
				player2: {
					player1: 6,
					player2: {
						player1: {
							player1: {
								player1: 6,
								player2: 5,
							},
							player2: {
								player1: 6,
								player2: 5,
							},
						},
						player2: {
							player1: {
								player1: 6,
								player2: 5,
							},
							player2: 8
						},
					},
				},
			},
		},
	}
}

const nbRounds = computed(() => getNbRounds(tournament));

function getNbRounds(tournament: ITournamentMatch, depth: number = 1): number {
	const depth1 = (typeof tournament.player1 === 'number' ? depth : getNbRounds(tournament.player1, depth + 1))
	const depth2 = (typeof tournament.player2 === 'number' ? depth : getNbRounds(tournament.player2, depth + 1))
	return (depth1 > depth2 ? depth1 : depth2);
}

</script>

<template>
	<div class="grid h-auto overflow-auto">

		<TournamentPreviewMatch :match="tournament"/>
	</div>
</template>



