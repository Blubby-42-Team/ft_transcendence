<script lang="ts" setup>

import { IChannel, IMessage } from '#imports';

defineProps({
	channel: {
		type: Object as PropType<IChannel>,
		required: true,
	},
})

const { primaryUser } = useUserStore()

</script>

<template>
	<div class="flex flex-col-reverse w-full h-full overflow-x-hidden scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color2 overscroll-y-contain">
		<TransitionFade :group="true" noMove mode="out-in" class="contents" :duration="{
			enter: 500,
			leave: 500,
		}">
			<template v-for="message in channel.messages" :key="message.id">
				<template v-if="message.id !== undefined">
					<template v-if="message.senderId == primaryUser.id">
						<ChannelMessagesMe :message="message"/>
					</template>
					<template v-else>
						<ChannelMessagesOther :message="message"/>
					</template>
				</template>
			</template>
		</TransitionFade>
	</div>
</template>
