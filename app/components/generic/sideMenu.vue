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

function close(){ isOpen.value = false; }
function open() {
	isOpen.value = true;
		
	nextTick(() => {
		if (!menu.value || !props.reference)
			return;

		position.value.x		= props.reference.clientLeft;
		position.value.y		= props.reference.clientTop;
		position.value.width	= props.reference.clientWidth;
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
	<TransitionFade>
		<template v-if="isOpen">
			<div ref="menu"
				class="absolute z-50 bg-red-700 h-max"
				:style="{
					width: `${props.reference?.clientWidth ?? 100}px`,
					left: `${position.x}px`,
					top:  `${position.y}px`,
				}"
			>
				<slot/>
			</div>
		</template>
	</TransitionFade>
</template>
