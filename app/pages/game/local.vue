<script lang="ts" setup>

const { changeStatus } = useUserStore();

onMounted(() => {
	changeStatus(UserTelemetryStatus.InGame);
});

onUnmounted(() => {
	changeStatus(UserTelemetryStatus.Online);
});

</script>

<template>
	<div class="w-full h-full">
		<client-only placeholder="loading...">
			<GameInstance />
		</client-only>
	</div>
</template>



