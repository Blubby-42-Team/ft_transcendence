<script setup lang="ts">

const { selectedChannelType, selectedChannel, isSideMenuOpen } = useChannelListStore()
const { selectedCategory, selectedLobby } = usePageStore()
const { players, sequence, timeRemaining } = useLobbyStore()

const theme = useState('theme');

</script>


<template>
	<div class="w-screen h-screen" :class="theme ? theme : 'theme-light'">
		<NuxtLayout>
			<!-- :transition="{
				name: 'bounce',
				mode: 'out-in'
			}" -->
			<NuxtPage
			/>
		</NuxtLayout>
		<div id="modals"/>
	</div>
</template>

<!-- <style>
.bounce-enter-active,
.bounce-leave-active {
	transition: all 0.1s;
}
.bounce-enter-from,
.bounce-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style> -->