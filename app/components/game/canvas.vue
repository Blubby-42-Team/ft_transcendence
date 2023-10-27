<script lang="ts" setup>
import { GenericButton } from '#build/components';


let canvas: Ref<any> = ref(null)
let ctx: Ref<any> = ref(null)

let curX = ref(0)
let curY = ref(0)
let pressed = ref(false)
let isDrawing = ref(false)
let x = ref(0)
let y = ref(0)

const startDrawing = (e: any): any => {
	x.value = e.offsetX
	y.value = e.offsetY
	isDrawing.value = true
}

const draw = (e: any): any => {
	if (isDrawing.value) {
		ctx.value.beginPath()
		ctx.value.moveTo(x.value, y.value)
		ctx.value.lineTo(e.offsetX, e.offsetY)
		ctx.value.stroke()
		x.value = e.offsetX
		y.value = e.offsetY
	}
}

const stopDrawing = () => {
	x.value = 0
	y.value = 0
	isDrawing.value = false
}

onMounted(() => {
	ctx.value = canvas.value.getContext('2d')
	canvas.value.addEventListener('mousedown', startDrawing)
	canvas.value.addEventListener('mousemove', draw)
	canvas.value.addEventListener('mouseup', stopDrawing)
	canvas.value.addEventListener('mouseleave', stopDrawing)
})
</script>

<template>
	<div class="p-5">
		<canvas class="bg-white" ref="canvas" width="500" height="300" style="border:1px solid #ffffff;"></canvas>
	</div>
</template>
