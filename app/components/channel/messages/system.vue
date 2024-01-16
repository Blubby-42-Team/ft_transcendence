<script lang="ts" setup>

import { IMessage } from '#imports';

const props = defineProps({
	message: {
		type: Object as PropType<IMessage>,
		required: true,
	},
})

const { getShortUser } = useUserStore();
const user = getShortUser(computed(() => props.message.senderId));

</script>

<template>
	<div class="w-full p-5 h-max" :key="props.message.id">
		<div class="flex float-right w-full h-full p-3 break-all whitespace-pre-line bg-background1 rounded-2xl">
			{{ props.message.message }}
		</div>
	</div>
</template>