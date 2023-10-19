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

</script>

<template>
	<NuxtLink :to="props.to"
		class="flex items-center mr-2 text-center place-content-center"
		:class="getStyle(props.buttonStyle)"
	>
		<slot />
	</NuxtLink>
</template>