<script setup lang="ts">
const props = defineProps({
	imageSrc: {
		type: String,
		required: true,
	},
	showStatus: {
		type: Boolean,
		default: false,
	},
})

</script>

<template>
	<div class="grid grid-cols-[60%_30%_10%] grid-rows-[60%_30%_10%] overflow-hidden">
		<img class="w-full h-full rounded-full pointer-events-none row-[1_/_4] col-[1_/_4]" :src="props.imageSrc">
		<template v-if="props.showStatus">
			<div class="w-full h-full bg-background1 row-[2] col-[2] rounded-full p-[10%]">
				<div class="w-full h-full bg-green-500 rounded-full"></div>
			</div>
		</template>
	</div>
</template>