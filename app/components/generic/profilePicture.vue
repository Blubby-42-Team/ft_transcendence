<script setup lang="ts">
const props = defineProps({
	imageSrc: {
		type: String,
	},
	userId: {
		type: Number,
		default: 0,
	},
})

const { getUser } = useUserStore();
const user = getUser(computed(() => props.userId));

</script>

<template>
	<div class="grid grid-cols-[60%_30%_10%] grid-rows-[60%_30%_10%] overflow-hidden">
		<img class="w-full h-full rounded-full pointer-events-none row-[1_/_4] col-[1_/_4]" :src="props?.imageSrc ?? '/pp.png'">
		<template v-if="props.userId !== 0">
			<ClientOnly>
				<div class="w-full h-full bg-background1 row-[2] col-[2] rounded-full p-[10%]">
					<template v-if="user.status === UserTelemetryStatus.Online">
						<div class="w-full h-full bg-green-500 rounded-full"></div>
					</template>
					<template v-else-if="user.status === UserTelemetryStatus.InGame">
						<div class="w-full h-full rounded-full bg-cyan-500"></div>
					</template>
					<template v-else-if="user.status === UserTelemetryStatus.Offline">
						<div class="w-full h-full bg-red-500 rounded-full"></div>
					</template>
				</div>
			</ClientOnly>
		</template>
	</div>
</template>