<script setup lang="ts">

const props = defineProps({
	direction: {
		type: String as PropType<'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal'>,
		required: true,
	},
})

const isOpen = ref(false);
const menuRef	= ref<HTMLInputElement>()
const buttonRef	= ref<HTMLInputElement>()
const position = ref({
	x: 0,
	y: 0,
	width: 0,
})

function updateSize(){
	console.log('updateSize')
	if (!menuRef.value || !buttonRef.value)
		return;
	
	const { top, left, width, height } = buttonRef.value.getBoundingClientRect();

	position.value.x		= left;
	position.value.y		= top + height;
	position.value.width	= width;
}
function close(){ isOpen.value = false; }
function open() {
	isOpen.value = true;
		
	nextTick(updateSize);
}

// This watch doesnt work. It doesnt update the size of the menu when the button is clicked.
watchEffect(() => {
  if (buttonRef.value) {
    updateSize();
  }
});

defineExpose({
	open,
	close,
})

onClickOutside(menuRef, () => {
	if (isOpen.value) {
		close()
	}
})

</script>

<template>
	<div ref="buttonRef">
		<slot name="buttontest" />
		<TransitionExpand>
			<template v-if="isOpen">
				<div class="absolute z-50 bg-red-700 w-max h-max" ref="menuRef">
					<div class="h-max"
						:style="{
							width: `${position.width}px`,
							left: `${position.x}px`,
							top:  `${position.y}px`,
						}"
					>
						<slot name="contenttest"/>
					</div>
				</div>
			</template>
		</TransitionExpand>

	</div>
</template>
