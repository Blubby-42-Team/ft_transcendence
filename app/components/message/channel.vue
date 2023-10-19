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
	<div class="flex flex-col-reverse h-full overflow-x-hidden scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-text scrollbar-thumb-rounded-none scrollbar-track overscroll-y-contain">
		<!-- <GenericTextarea class="flex m-5 bg-color2"></GenericTextarea> -->
		<div class="w-full p-5">
			<textarea
				ref="textarea"
				v-model="input"
				class="p-0 bg-transparent border-none appearance-none resize-none focus-border-none form-textarea focus:outline-transparent" 
				placeholder="Send a Message"
			/>
			<!-- <textarea
				ref="textarea"
				v-model="input"
				class="w-full overflow-x-hidden bg-opacity-75 resize-none border-1 border-color1 rounded-xl bg-color3 max-h-80 scrollbar scrollbar-y-auto scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-text scrollbar-thumb-rounded-3xl scrollbar-track overscroll-y-contain"
				placeholder="What's on your mind?"
			/> -->
		</div>

		<!-- <input type="text" name="" id="" class="m-5 rounded-xl bg-color2 focus:bg-color3"> -->
		
		<template v-for="message in messages">
			<div class="inline-grid grid-rows-[auto,2em] p-5"
				:class="message.senderId == myId ? 'grid-cols-[auto,70%,4em]' : 'grid-cols-[4em,70%,auto]'"
			>
				<template v-if="message.senderId == myId">
					<div></div><!-- DO NOT REMOVE -->
					<div class="flex float-right h-full p-2 break-all rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-color3">
						{{ message.message }}
					</div>
					<div class="flex flex-col row-span-2">
						<div class="mb-auto"></div>
						<GenericProfilePicture class="flex ml-2 w-14 h-14 bg-background3" imageSrc="/amogus.png"/>
					</div>
					<div></div><!-- DO NOT REMOVE -->
					<div class="flex float-left">
						<div class="mr-auto"></div>
						<div class="flex self-center text-xs text-text text-opacity-40">
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
						<GenericProfilePicture class="flex w-14 h-14 bg-background3" imageSrc="/amogus.png"/>
					</div>
					<div class="flex float-right h-full p-2 break-all rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-color2">
						{{ message.message }}
					</div>
					<div></div><!-- DO NOT REMOVE -->
					<div class="flex">
						<div class="flex self-center mr-2 text-lg">
							{{ getMessagePlayer(message.senderId)?.name }}
						</div>
						<div class="flex self-center text-xs text-text text-opacity-40">
							{{ format(message.time, "dd MMMM") }} at {{ format(message.time, "HH:mm:ss") }}
						</div>
					</div>
				</template>
			</div>
		</template>
	</div>
</template>
