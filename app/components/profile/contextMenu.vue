<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number,
		required: true
	},
});

</script>

<template>
	<div class="px-5 pb-5 rounded-3xl bg-background1 w-[40rem] max-h-[80vh]">
		<ProfileContent :userId="props.userId"/>
	</div>
</template>