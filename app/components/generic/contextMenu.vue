<script setup lang="ts">

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	}
})

const isOpen = ref(props.show);
const modal = ref<HTMLInputElement>()
const position = ref({x: 0, y: 0})

function close(){ isOpen.value = false; }
function open(event: MouseEvent) {
	isOpen.value = true;
		
	nextTick(() => {
		if (!modal.value)
			return;

		position.value.x = event.clientX;
		position.value.y = event.clientY;

		if (position.value.y - modal.value.clientHeight < 0
			&& position.value.y + modal.value.clientHeight > window.innerHeight
		) {
			position.value.y = position.value.y - modal.value.clientHeight / 2;
		}
	
		if (position.value.x + modal.value.clientWidth > window.innerWidth) {
			position.value.x = window.innerWidth - modal.value.clientWidth;
		}
	
		if (position.value.y > window.innerHeight - modal.value.clientHeight){
			position.value.y = position.value.y - modal.value.clientHeight;
		}
	})
}

defineExpose({
	open,
	close,
})

onClickOutside(modal, () => {
	if (isOpen.value) {
		close()
	}
})

</script>

<template>
	<TransitionFade>
		<template v-if="isOpen">
			<div ref="modal"
				class="absolute z-50 w-max h-max"
				:style="{
					left: `${position.x}px`,
					top:  `${position.y}px`,
				}"
			>
				<slot/>
			</div>
		</template>
	</TransitionFade>
</template>
