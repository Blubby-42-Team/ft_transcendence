<script setup lang="ts">

const isOpen = ref(false);
const menu = ref<HTMLInputElement>()
const position = ref({x: 0, y: 0})

function close(){ isOpen.value = false; }
function open(event: MouseEvent) {
	isOpen.value = true;

	console.log('yer', event.clientX, event.clientY)
		
	nextTick(() => {
		if (!menu.value)
			return;

		position.value.x = event.clientX;
		position.value.y = event.clientY;

		if (position.value.y - menu.value.clientHeight < 0
			&& position.value.y + menu.value.clientHeight > window.innerHeight
		) {
			console.log('middle')
			position.value.y = position.value.y - menu.value.clientHeight / 2;
		}
	
		if (position.value.x + menu.value.clientWidth > window.innerWidth) {
			console.log('right', position.value.x, window.innerWidth, menu.value.clientWidth)
			position.value.x = window.innerWidth - menu.value.clientWidth;
			console.log('right', position.value.x, window.innerWidth, menu.value.clientWidth)
		}
	
		if (position.value.y > window.innerHeight - menu.value.clientHeight){
			console.log('bottom')
			position.value.y = position.value.y - menu.value.clientHeight;
		}
	})
}

defineExpose({
	open,
	close,
})

onClickOutside(menu, () => {
	if (isOpen.value) {
		close()
	}
})

</script>

<template>
	<teleport to='body'>
		<TransitionFade>
			<template v-if="isOpen">
				<div ref="menu" class="absolute z-50 w-max h-max"
					:style="{
						left: `${position.x}px`,
						top:  `${position.y}px`,
					}"
				>
					<slot/>
				</div>
			</template>
		</TransitionFade>
	</teleport>
</template>
