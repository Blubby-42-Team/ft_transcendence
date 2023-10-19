<script setup lang="ts">
import { getStyle } from './buttonStyle';

const props = defineProps({
	buttonStyle: {
		type: Number,
		default: 0
	},
})

</script>

<template>
	<button class="flex items-center mr-2 text-center place-content-center"
		:class="getStyle(props.buttonStyle)"
	>
		<slot />
	</button>
</template>