<script setup lang='ts'>
const theme = useState('theme');
const themeIndex = useState('themeIndex');

</script>
	
<template>
	<div class="h-screen bg-background1 text-text grid grid-cols-[4rem,auto]"
		:class="theme ? theme : 'theme-dark-blue'"
	>
		<LayoutSidebar/>
		<div class="grid grid-rows-[4em,auto,min-content] h-screen overflow-hidden">
			<LayoutHeader/>
			<div id="canvasDiv" class="block h-full overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color2 scrollbar-thumb-rounded-full scrollbar-track">
				<slot />
			</div>
			<LayoutFooter/>
		</div>
	</div>
</template>
