<script setup lang="ts">
import { getStyle } from './buttonStyle';

const props = defineProps({
	to: {
		type: String,
		required: true,
	},
	buttonStyle: {
		type: Number,
		default: 0
	},
})

const style = getStyle(props.buttonStyle);

</script>

<template>
	<NuxtLink :to="props.to"
		class="flex items-center text-center place-content-center"
		:class="style.normal + ' ' + style.unselected"
	>
		<slot />
	</NuxtLink>
</template>