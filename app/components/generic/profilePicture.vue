<script setup lang="ts">
const props = defineProps({
	imageSrc: {
		type: String,
		required: true,
	},
})

</script>

<template>
	<div class="overflow-hidden rounded-full">
		<img class="w-full h-full rounded-full" :src="props.imageSrc">
	</div>
</template>