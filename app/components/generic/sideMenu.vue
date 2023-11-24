<script setup lang="ts">

const props = defineProps({
	direction: {
		type: String as PropType<'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal'>,
		required: true,
	},
	reference: {
		type: Object as PropType<HTMLElement | undefined>,
		required: true,
	}
})

const isOpen = ref(false);
const menu = ref<HTMLInputElement>()
const position = ref({
	x: 0,
	y: 0,
	width: 0,
})

function updateSize(){
	if (!menu.value || !props.reference)
		return;
	
	const { top, left, width, height } = props.reference.getBoundingClientRect();

	position.value.x		= left;
	position.value.y		= top + height;
	position.value.width	= width;
}
function close(){ isOpen.value = false; }
function open() {
	isOpen.value = true;
		
	nextTick(updateSize);
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
	<TransitionExpand
		
	>
		<template v-if="isOpen">
			<div class="absolute z-50 bg-red-700 w-max h-max" ref="menu">
				<div class="h-max"
					:style="{
						width: `${position.width}px`,
						left: `${position.x}px`,
						top:  `${position.y}px`,
					}"
				>
					<slot/>
				</div>
			</div>
		</template>
	</TransitionExpand>
</template>
