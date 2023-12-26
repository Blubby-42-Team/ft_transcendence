<script lang="ts" setup>

const { textarea, input } = useTextareaAutosize()

defineProps({
	channel: {
		type: Object as PropType<IChannel>,
		required: true,
	},
	id: {
		type: Number,
		required: true,
		default: 0,
	}
})

const { primaryUser } = useUserStore()

</script>

<template>
	<div class="grid grid-rows-[max_contents,1px,max_contents]">
		<div class="h-16 p-2 text-lg bg-color1 text-text-light">
			<div class="flex items-center justify-center h-full ">
				{{ channel.name }}
			</div>
		</div>
		<div class="flex flex-col-reverse overflow-x-hidden scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color2 overscroll-y-contain">
			<template v-for="message in channel.messages">
				<div class="inline-grid grid-rows-[auto,2em] p-5"
					:class="message.senderId == primaryUser.id ? 'grid-cols-[auto,70%,4em]' : 'grid-cols-[4em,70%,auto]'"
				>
					<template v-if="message.senderId == primaryUser.id">
						<MessageMe :message="message"/>
					</template>
					<template v-else>
						<MessageOther :message="message"/>
					</template>
				</div>
			</template>
		</div>
		<div class="w-full p-5 grid grid-cols-[auto,3em] gap-2">
			<div class="pt-2 pb-1 pl-2 pr-0 bg-background1 rounded-2xl">
				<textarea ref="textarea" v-model="input"
					class="self-center w-full overflow-x-hidden bg-transparent border-transparent border-none resize-none text-text max-h-60 focus-border-none form-pink-500area focus:ring-0 scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 overscroll-y-contain" 
					placeholder="Send a Message"
				/>
			</div>
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1">
				<Icon name="material-symbols:send" class="w-10 h-10"/>
			</GenericButton>
		</div>
	</div>
</template>
