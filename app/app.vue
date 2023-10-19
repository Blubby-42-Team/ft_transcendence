<template>
	<NuxtLayout>
		<NuxtPage :transition="{
			name: 'bounce',
			mode: 'out-in'
		}"/>
	</NuxtLayout>
</template>

<style>
.bounce-enter-active,
.bounce-leave-active {
	transition: all 0.1s;
}
.bounce-enter-from,
.bounce-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>