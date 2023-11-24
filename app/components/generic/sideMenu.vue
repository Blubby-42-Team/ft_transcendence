<script setup lang="ts">

const props = defineProps({
	options: {
		type: Object as PropType<{
			direction: 'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal',
			reference: Ref<HTMLElement | undefined>,
		}>,
		required: true,
	},
})

const isOpen		= ref(false);
const isVertical	= ref(true);
const menuRef		= ref<HTMLInputElement>()
const position		= ref({
	x: 0,
	y: 0,
})

function open() { isOpen.value = true; updateSize()  }
function close(){ isOpen.value = false; }

function updateSize(){
	if (!menuRef.value || !props.options.reference.value)
		return;
	
	const { top, left, width, height } = props.options.reference.value.getBoundingClientRect();
	const { width: menuWidth, height: menuHeight } = props.options.reference.value.getBoundingClientRect();

	console.log(props.options.direction)

	switch (props.options.direction) {
		case 'bottom':
			console.log('bottom')
			position.value.x		= left;
			position.value.y		= top + height;
			break;
		case 'top':
			console.log('top')
			position.value.x		= left;
			position.value.y		= top + height + menuHeight;
			break;	
		default:
			break;
	}
}

onClickOutside(menuRef, () => {
	if (isOpen.value) {
		close()
	}
})

onMounted(() => {
	const resizeObserver = new ResizeObserver(updateSize);
	if (!props.options.reference.value){
		return;
	}
	resizeObserver.observe(props.options.reference.value);
});

defineExpose({
	open,
	close,
})

</script>

<template>
	<TransitionExpand>
		<template v-if="isOpen">
			<div class="absolute z-50 bg-red-700 w-max h-max" ref="menuRef">
				<div class="h-max w-max"
					:style="{
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
