<script setup lang="ts">

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(4,auto)]">
		<div class="grid border-r-4 w-96 bg-color2 border-color3">
			<div class="w-full p-2 text-3xl text-center bg-color3">Settings</div>
			<GenericButton :buttonStyle="1" class="w-full h-12">Test</GenericButton>
		</div>
		<div class="p-5 bg-red-400">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-red-500">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-red-600">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-red-700">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
	</div>
</template>
