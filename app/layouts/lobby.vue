<script setup lang='ts'>

const { startLoopWaiting } = usePageStore();
const { setup } = useUserStore();
const { setup: setup2 } = useLobbyStore();

if (process.client) {
	setup();
	setup2();
	startLoopWaiting();
}
</script>
	
<template>
	<div class="h-screen bg-background2 text-text grid grid-cols-[4rem_auto]">
		<LayoutSidebar/>
		<LayoutNotificationPopup/>
		<LayoutHeader/>
		<div class="block h-full overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 scrollbar-thumb-rounded-full scrollbar-track">
			<GameLobby>
				<slot />
			</GameLobby>
		</div>
	</div>
</template>
