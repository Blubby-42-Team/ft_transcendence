<script setup lang="ts">

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	}
})

const isOpen = ref(props.show);
const modal = ref<HTMLInputElement>()

let position = ref({
	x: 0,
	y: 0,
})

function open(event: MouseEvent) {
	console.log('open');
	console.log(event)
	isOpen.value = true;
	
	if (!modal.value)
		return;

	// Calculate initial position based on mouse click
	position.value.x = event.clientX;
	position.value.y = event.clientY;

	console.log(modal.value.clientWidth, modal.value.clientHeight)

	// Adjust if the modal overflows the right side of the screen
	if (position.value.x + modal.value.clientWidth > window.innerWidth) {
		position.value.x = window.innerWidth - modal.value.clientWidth;
		console
	}

	// Adjust if the modal overflows the bottom of the screen
	if (position.value.y + modal.value.clientHeight > window.innerHeight) {
		position.value.y = window.innerHeight - modal.value.clientHeight;
	}
}

function close(){
	isOpen.value = false;
	console.log("close")
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
			<div class="bg-slate-600">
				<div ref="modal"
					class="absolute p-5 bg-red-400 w-max"
					:style="{
						left: `${position.x}px`,
						top:  `${position.y}px`,
					}"
				>
					<slot/>
				</div>
			</div>
		</template>
	</TransitionFade>
</template>
