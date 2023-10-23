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
		<div class="grid w-full h-20 grid-cols-[max-content,auto] grid-rows-2 rounded bg-color2 overflow-hidden">
			<template v-for="(player, i) in players">
				<template v-if="typeof player === 'number'">
					<div class="h-full p-1 bg-color3"
						:class="i == 0 ? 'border-b' : 'border-t'"
					>
						<GenericProfilePicture class="w-8 h-8" imageSrc="/amogus.png"/>
					</div>
					<div class="bg-color3"
						:class="i == 0 ? 'border-b' : 'border-t'"
					>
						test
					</div>
				</template>
				<template v-else>
					<div class="h-full p-1"
						:class="i == 0 ? 'border-b' : 'border-t'"
					>
						<Icon name="material-symbols:account-circle" class="w-8 h-8"/>
					</div>
					<div :class="i == 0 ? 'border-b' : 'border-t'">
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