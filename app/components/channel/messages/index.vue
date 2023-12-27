<script lang="ts" setup>

defineProps({
	channel: {
		type: Object as PropType<IChannel>,
		required: true,
	},
})

const { primaryUser } = useUserStore()

</script>

<template>
	<div  class="w-full h-full contents">
		<div class="flex flex-col-reverse w-full h-full overflow-x-hidden scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color2 overscroll-y-contain">
			<template v-for="message in channel.messages">
				<div class="inline-grid grid-rows-[auto,2em] p-5"
					:class="message.senderId == primaryUser.id ? 'grid-cols-[auto,70%,4em]' : 'grid-cols-[4em,70%,auto]'"
				>
					<template v-if="message.senderId == primaryUser.id">
						<ChannelMessagesMe :message="message"/>
					</template>
					<template v-else>
						<ChannelMessagesOther :message="message"/>
					</template>
				</div>
			</template>
		</div>
	</div>
</template>
