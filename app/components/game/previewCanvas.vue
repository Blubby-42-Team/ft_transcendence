<script lang="ts" setup>

</script>

<template>
	<div id="canvasDiv" class="w-full h-full">
		<client-only placeholder="loading...">
			<canvas class="bg-white border border-text" ref="canvas" :width="screen.width" :height="screen.height"></canvas>
		</client-only>
	</div>
</template>
