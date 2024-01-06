<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
const qrcode = useQRCode("xdxwewewewewexdxwewewewewexdxwewewewewexdxwewewewewe")

</script>

<template>
	<div class="p-5 w-[48rem] h-96 bg-background2 rounded-xl text-text">
		<div class="grid w-full h-full grid-cols-2">
			<div class="p-5">
				<img :src="qrcode" alt="QR Code" class="w-full h-full"/>
			</div>
			<div class="p-5">
				<div class="grid h-full grid-rows-2">
					<div class="flex items-center justify-center h-full">Enter your validation code</div>
					<div class="h-full">
						<input class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Find a new channel" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>