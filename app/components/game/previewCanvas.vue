<script setup lang="ts">

</script>

<template>
	<div class="w-full h-full previewCanvasDiv">
		<client-only placeholder="loading...">
			<canvas class="bg-white" ref="canvas" :width="200" :height="300" style="border:1px solid #ffffff;"></canvas>
		</client-only>
	</div>
</template>
