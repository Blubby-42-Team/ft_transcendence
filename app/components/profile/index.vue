<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number,
		required: true
	},
});

</script>

<template>
	<div class="flex justify-center h-full p-5">
		<div class="px-5 pb-5 rounded-3xl bg-background1 w-[40rem] h-full">
			<ProfileContent :userId="props.userId"/>
		</div>
	</div>
</template>