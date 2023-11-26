<script lang="ts" setup>

const { textarea, input } = useTextareaAutosize()

defineProps({
	id: {
		type: Number,
		required: true,
		default: 0,
	}
})

const { messages } = useChannelStore()

const myId = "2"

</script>

<template>
	<div class="grid h-full grid-rows-[auto_max-content]">
		<div class="block overflow-x-hidden scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-red-600 overscroll-y-contain">
			<div class="flex flex-col-reverse flex-wrap">
				<template v-for="message in messages">
					<div class="inline-grid grid-rows-[auto,2em] p-5"
					:class="message.senderId == myId ? 'grid-cols-[auto,70%,4em]' : 'grid-cols-[4em,70%,auto]'"
					>
						<template v-if="message.senderId == myId">
							<MessageMe :message="message"/>
						</template>
						<template v-else>
							<MessageOther :message="message"/>
						</template>
					</div>
				</template>
			</div>
		</div>
		<div class="w-full p-5 grid grid-cols-[auto,3em] gap-2">
			<div class="pt-2 pb-1 pl-2 pr-0 bg-background1 rounded-2xl">
				<textarea ref="textarea" v-model="input"
					class="self-center w-full overflow-x-hidden bg-transparent border-transparent border-none resize-none text-text max-h-60 focus-border-none form-pink-500area focus:ring-0 scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-first overscroll-y-contain" 
					placeholder="Send a Message"
				/>
			</div>
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1">
				<Icon name="material-symbols:send" class="w-10 h-10"/>
			</GenericButton>
		</div>
	</div>
</template>
