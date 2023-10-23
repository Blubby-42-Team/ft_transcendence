<script setup lang='ts'>

import { ITournamentMatch } from './preview.vue'

const { match } = defineProps({
	match: {
		type: Object as () => ITournamentMatch,
		required: true,
	},
})

const players = computed(() => [match.player1, match.player2])

</script>

<template>
	<GenericButton class="w-full h-full border-text" :buttonStyle="1">
		<div class="grid w-full h-20 grid-cols-[max-content,auto] rounded bg-color2">
			<template v-for="player in players">
				<template v-if="typeof player === 'number'">
					<div class="h-full p-1 bg-color3">
						<GenericProfilePicture class="w-8 h-8" imageSrc="/amogus.png"/>
					</div>
					<div class="bg-color3">
						<!-- <Icon name="material-symbols:account-ci" class="w-full h-full"/> -->
						test
					</div>
				</template>
				<template v-else>
					<div class="h-full p-1">
						<Icon name="material-symbols:account-circle" class="w-8 h-8"/>
					</div>
					<div class="">
						...
					</div>
				</template>
			</template>
		</div>
	</GenericButton>
</template>

<style>

.rtl-grid {
	direction: rtl;
}

.ltr-grid {
	direction: ltr;
}

</style>