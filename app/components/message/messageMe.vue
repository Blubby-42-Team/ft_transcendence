<script lang="ts" setup>

import { format } from 'date-fns'

const props = defineProps({
	message: {
		type: Object as PropType<IMessage>,
		required: true,
	},
})

const { messages, getMessagePlayer } = useChannelStore()

</script>

<template>
	<br/>
	<div class="flex float-right h-full p-2 break-all bg-color2 rounded-tl-2xl text-text-light rounded-tr-2xl rounded-bl-2xl">
		{{ props.message.message }}
	</div>
	<div class="flex flex-col row-span-2">
		<div class="mb-auto"></div>
		<GenericProfilePicture class="flex ml-2 w-14 h-14" imageSrc="/amogus.png"/>
	</div>
	<br/>
	<div class="flex float-left">
		<div class="mr-auto"></div>
		<div class="flex self-center text-xs">
			<ClientOnly>
				{{ format(props.message.time, "dd MMMM") }} at {{ format(props.message.time, "HH:mm:ss") }}
			</ClientOnly>
		</div>
		<div class="flex self-center ml-2 mr-2 text-lg">
			{{ getMessagePlayer(props.message.senderId)?.name }}
		</div>
	</div>
</template>