<script setup lang='ts'>
const theme = useState('theme');

</script>
	
<template>
	<div class="h-screen bg-pink-500 text-pink-500 grid grid-cols-[4rem,auto]"
		:class="theme ? theme : 'theme-dark-blue'"
	>
		<LayoutSidebar/>
		<LayoutHeader/>
		<div class="grid grid-rows-[auto] h-screen overflow-hidden">
			<div class="block h-full overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-pink-500 scrollbar-thumb-rounded-full scrollbar-track">
				<slot />
			</div>
		</div>
	</div>
</template>
