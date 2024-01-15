<script lang="ts" setup>

import { IMessage } from '#imports';
import { format } from 'date-fns'

const props = defineProps({
	message: {
		type: Object as PropType<IMessage>,
		required: true,
	},
})

const userStore = useUserStore();
const { getShortUser } = storeToRefs(userStore);
const user = getShortUser.value(props.message.senderId);

</script>

<template>
	<div class="inline-grid grid-rows-[auto,2em] p-5 grid-cols-[auto,70%,4em]">
		<br/>
		<div class="flex float-right h-full p-2 break-all whitespace-pre-line bg-color2 rounded-tl-2xl text-text-light rounded-tr-2xl rounded-bl-2xl">
			{{ props.message.message }}
		</div>
		<div class="flex flex-col row-span-2">
			<div class="mb-auto"></div>
			<GenericProfilePicture class="flex ml-2 w-14 h-14" :imageSrc="user.avatar" :userId="props.message.senderId"/>
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
				{{ user.name }}
			</div>
		</div>
	</div>
</template>