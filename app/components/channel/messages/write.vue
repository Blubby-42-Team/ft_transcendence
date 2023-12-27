<script setup lang="ts">

const { textarea, input } = useTextareaAutosize()

</script>


<template>
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
</template>