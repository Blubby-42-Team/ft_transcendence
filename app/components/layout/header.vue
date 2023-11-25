<script setup lang="ts">

const viewProfileRef = ref();
const viewnotificationRef = ref();
</script>

<template>
	<div class="absolute right-0 flex p-3 bg-white rounded-bl-2xl">
		<GenericButton class="self-center w-12 h-12 p-1 mr-2 rounded-full" :buttonStyle="1"
			@click="viewnotificationRef?.open"
		>
			<Icon name="material-symbols:notifications" class="w-full h-full"/>
		</GenericButton>
		<GenericContextMenu ref="viewnotificationRef">
			<div class="w-40 p-5 bg-red-500 border-4 rounded-2xl border-background3">Hell WOrld</div>
		</GenericContextMenu>
		<GenericButton class="self-center w-12 h-12 border-none rounded-full hover:border-none" :buttonStyle="1"
			@click="viewProfileRef?.open"
		>
			<GenericProfilePicture class="w-full h-full hover:border-none" imageSrc="/amogus.png"/>
		</GenericButton>
		
		<GenericModal ref="viewProfileRef">
			<!-- <div class="p-5 border-4 bg-color2 rounded-2xl border-color3">Hell WOrld</div>
			<div class="p-5 border-4 bg-color3 rounded-2xl border-color2">Hell WOrld</div>
			<div class="p-5 border-4 bg-background2 rounded-2xl border-background1">Hell WOrld</div> -->
			<div class="p-5 border-4 bg-color2 rounded-2xl border-background3">Hell WOrld</div>
		</GenericModal>
	</div>
</template>