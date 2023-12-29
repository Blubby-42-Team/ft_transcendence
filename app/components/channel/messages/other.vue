<script lang="ts" setup>

import { format } from 'date-fns'

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
	<div class="contents">
		<div class="flex flex-col row-span-2">
			<div class="mb-auto"></div>
			<GenericProfilePicture class="flex w-14 h-14" :imageSrc="user.avatar"/>
		</div>
		<div class="flex float-right h-full p-2 break-all bg-background1 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl">
			{{ props.message.message }}
		</div>
		<br/>
		<div class="flex">
			<div class="flex self-center mr-2 text-lg">
				{{ user.name }}
			</div>
			<div class="flex self-center text-xs">
				<ClientOnly>
					{{ format(props.message.time, "dd MMMM") }} at {{ format(props.message.time, "HH:mm:ss") }}
				</ClientOnly>
			</div>
		</div>
	</div>
</template>