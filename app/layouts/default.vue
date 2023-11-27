<script setup lang='ts'>
const theme = useState('theme');

</script>
	
<template>
	<div class="h-screen bg-background2 text-text grid grid-cols-[4rem,auto]"
		:class="theme ? theme : 'theme-light'"
	>
		<LayoutSidebar/>
		<LayoutHeader/>
		<div class="block h-full overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-first scrollbar-thumb-rounded-full scrollbar-track">
			<slot />
		</div>
	</div>
</template>
