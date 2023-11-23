<script setup lang="ts">

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	}
})

let isOpen = ref(props.show);

function open() { isOpen.value = true; }
function close(){ isOpen.value = false; }

defineExpose({
	open,
	close,
})

const modal = ref(null)

onClickOutside(modal, close)

</script>

<template>
	<TransitionFade>
		<template v-if="isOpen">
			<div class="fixed">
				<slot/>
			</div>
		</template>
	</TransitionFade>
</template>
