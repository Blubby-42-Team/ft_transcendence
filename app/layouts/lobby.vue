<script setup lang='ts'>
</script>
	
<template>
	<div class="h-screen bg-background2 text-text grid grid-cols-[4rem,auto]">
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
