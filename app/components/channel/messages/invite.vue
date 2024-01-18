<script lang="ts" setup>

import { IMessage } from '#imports';

const props = defineProps({
	message: {
		type: Object as PropType<IMessage>,
		required: true,
	},
})

</script>

<template>
	<div class="w-full p-5 h-max" :key="props.message.id">
		<div class="grid w-full h-full grid-cols-[auto,max-content] p-3 bg-background1 rounded-2xl">
			<div class="flex w-full h-full p-2 break-all whitespace-pre-line rounded-2xl">
				You were invited to join a game
			</div>
			<GenericNuxtLink class="block w-10 h-10 p-3 px-10 rounded-xl bg-color1 text-text-light hover:bg-color2" :buttonStyle="1"
				:to="`/lobby/custom/${props.message.message}`"
			>
				Join
			</GenericNuxtLink>
		</div>
	</div>
</template>