<script setup lang="ts">

const { optionsList, previewSize } = useGameStore()

onMounted(() => {
	function refreshSize () {
		if (document.getElementById('previewCanvasDiv')?.offsetHeight >= 720/1080 * document.getElementById('previewCanvasDiv')?.offsetWidth) {
			previewSize.value.width = document.getElementById('previewCanvasDiv')?.offsetWidth * 0.98;
			previewSize.value.height = previewSize.value.width * 720/1080;
		}
		else {
			previewSize.value.height = document.getElementById('previewCanvasDiv')?.offsetHeight * 0.98;
			previewSize.value.width = previewSize.value.height * 1080/720;
		}
	}

	function preview () {
		refreshSize();
		window.requestAnimationFrame(preview)
	}

	window.requestAnimationFrame(preview);
})

</script>

<template>
	<div id="previewCanvasDiv" class="w-full h-full overflow-hidden">
		<client-only placeholder="loading...">
			<canvas class="bg-white" ref="canvas" :width="previewSize.width" :height="previewSize.height" style="border:1px solid #ffffff;"></canvas>
		</client-only>
	</div>
</template>
