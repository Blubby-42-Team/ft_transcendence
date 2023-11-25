<script lang="ts" setup>

import { format } from 'date-fns'

const { textarea, input } = useTextareaAutosize()

defineProps({
	id: {
		type: Number,
		required: true,
		default: 0,
	}
})

const { messages, getMessagePlayer } = useChannelStore()

const myId = "2"

</script>

<template>
	<div class="flex flex-col-reverse">
		<div class="w-full p-5 grid grid-cols-[auto,3em] gap-2">
			<div class="pt-2 pb-1 pl-2 pr-0 bg-background1 rounded-2xl">
				<textarea ref="textarea" v-model="input"
					class="self-center w-full overflow-x-hidden bg-transparent border-transparent border-none resize-none text-text max-h-60 focus-border-none form-pink-500area focus:ring-0 scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-pink-500 scrollbar-thumb-rounded-2xl scrollbar-track overscroll-y-contain" 
					placeholder="Send a Message"
				/>
			</div>
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1">
				<Icon name="material-symbols:send" class="w-10 h-10"/>
			</GenericButton>
		</div>
		<div class="flex flex-col-reverse h-full overflow-x-hidden scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-first scrollbar-thumb-rounded-2xl scrollbar-track-button-dis overscroll-y-contain">
			<template v-for="message in messages">
				<div class="inline-grid grid-rows-[auto,2em] p-5"
					:class="message.senderId == myId ? 'grid-cols-[auto,70%,4em]' : 'grid-cols-[4em,70%,auto]'"
				>
					<template v-if="message.senderId == myId">
						<br/>
						<div class="flex float-right h-full p-2 break-all bg-button-hover rounded-tl-2xl text-text-light rounded-tr-2xl rounded-bl-2xl">
							{{ message.message }}
						</div>
						<div class="flex flex-col row-span-2">
							<div class="mb-auto"></div>
							<GenericProfilePicture class="flex ml-2 w-14 h-14" imageSrc="/amogus.png"/>
						</div>
						<br/>
						<div class="flex float-left">
							<div class="mr-auto"></div>
							<div class="flex self-center text-xs">
								{{ format(message.time, "dd MMMM") }} at {{ format(message.time, "HH:mm:ss") }}
							</div>
							<div class="flex self-center ml-2 mr-2 text-lg">
								{{ getMessagePlayer(message.senderId)?.name }}
							</div>
						</div>
					</template>
					<template v-else>
						<div class="flex flex-col row-span-2">
							<div class="mb-auto"></div>
							<GenericProfilePicture class="flex w-14 h-14" imageSrc="/amogus.png"/>
						</div>
						<div class="flex float-right h-full p-2 break-all bg-background1 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl">
							{{ message.message }}
						</div>
						<br/>
						<div class="flex">
							<div class="flex self-center mr-2 text-lg">
								{{ getMessagePlayer(message.senderId)?.name }}
							</div>
							<div class="flex self-center text-xs">
								{{ format(message.time, "dd MMMM") }} at {{ format(message.time, "HH:mm:ss") }}
							</div>
						</div>
					</template>
				</div>
			</template>
		</div>
	</div>
</template>
