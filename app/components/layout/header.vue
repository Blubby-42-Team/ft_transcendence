<script setup lang="ts">

const route = useRoute();

const { title } = usePageStore();
</script>

<template>
	<div class="flex w-full pl-5 pr-5 bg-background2">
		<div class="self-center m-1 text-4xl max-w-[70vw] overflow-hidden">{{ title }}</div>
		
		<div class="ml-auto"></div><!-- OFFSET -->
		
		<GenericNuxtLink to="/" class="self-center w-12 h-12 p-1 rounded-full" :buttonStyle="1">
			<Icon name="material-symbols:notifications" class="w-full h-full"/>
		</GenericNuxtLink>
		<GenericNuxtLink to="/profile" class="self-center w-12 h-12 rounded-full" :buttonStyle="1">
			<GenericProfilePicture class="w-12 h-12 hover:bg-accent-color" imageSrc="/amogus.png"/>
		</GenericNuxtLink>
	</div>
</template>