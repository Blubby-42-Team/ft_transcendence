<script setup lang="ts">
const { title } = usePageStore();
</script>

<template>
	<div class="flex w-full pl-5 pr-5 bg-background2">
		<div class="self-center m-1 text-4xl max-w-[70vw] overflow-hidden">{{ title }}</div>
		
		<div class="ml-auto"></div><!-- OFFSET -->
		
		<GenericNuxtLink to="/" class="self-center w-12 h-12 p-1 mr-2 rounded-full" :buttonStyle="1">
			<Icon name="material-symbols:notifications" class="w-full h-full"/>
		</GenericNuxtLink>
		<GenericNuxtLink to="/profile" class="self-center w-12 h-12 border-none rounded-full hover:border-none" :buttonStyle="1">
			<GenericProfilePicture class="w-full h-full hover:border-none" imageSrc="/amogus.png"/>
		</GenericNuxtLink>
	</div>
</template>