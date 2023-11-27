<script setup lang="ts">

const viewProfileRef = ref();
const viewnotificationRef = ref();
</script>

<template>
	<div class="absolute right-0 z-20 flex h-16 p-3 bg-color1 rounded-bl-xl">
		<GenericButton class="self-center w-12 h-12 mr-2 rounded-full" :buttonStyle="1" :disabled="false" :selected="false"
			@click="viewnotificationRef?.open"
		>
			<Icon name="material-symbols:notifications" class="w-full h-full"/>
		</GenericButton>
		<GenericContextMenu ref="viewnotificationRef">
			<div class="w-40 p-5 border-4 border-background2 rounded-2xl bg-background1">Hell WOrld</div>
		</GenericContextMenu>
		<GenericButton class="self-center w-12 h-12 border-none rounded-full hover:border-none" :buttonStyle="1"
			@click="viewProfileRef?.open"
		>
			<GenericProfilePicture class="w-full h-full hover:border-none" imageSrc="/amogus.png"/>
		</GenericButton>
		
		<GenericModal ref="viewProfileRef">
			<!-- <div class="p-5 bg-pink-500 border-4 border-pink-500 rounded-2xl">Hell WOrld</div>
			<div class="p-5 bg-pink-500 border-4 border-pink-500 rounded-2xl">Hell WOrld</div>
			<div class="p-5 bg-pink-500 border-4 border-pink-500 rounded-2xl">Hell WOrld</div> -->
			<div class="p-5 bg-pink-500 border-4 border-pink-500 rounded-2xl">Hell WOrld</div>
		</GenericModal>
	</div>
</template>