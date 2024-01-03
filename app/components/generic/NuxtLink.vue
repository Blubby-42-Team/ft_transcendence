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
	disabled: {
		type: Boolean,
		default: false,
	},
	selected: {
		type: Boolean,
		default: false,
	},
})

const style = getStyle(props.buttonStyle);

</script>

<template>
	<NuxtLink :to="props.to"
		class="flex items-center text-center place-content-center"
		:class="style.normal + ' ' + (selected ? style.selected : style.unselected)"
	>
		<slot />
	</NuxtLink>
</template>