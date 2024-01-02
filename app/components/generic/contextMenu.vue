<script setup lang="ts">

const isOpen = ref(false);
const lastMouseEvent = ref();
const menu = ref<HTMLInputElement>()
const position = ref({x: 0, y: 0})

function close(){ isOpen.value = false; }
function open(event: MouseEvent) {
	isOpen.value = true;
	lastMouseEvent.value = event;
}

function updateMenu(){
	if (!menu.value || !lastMouseEvent.value)
			return;

	position.value.x = lastMouseEvent.value.clientX;
	position.value.y = lastMouseEvent.value.clientY;

	if (position.value.y - menu.value.clientHeight < 0
		&& position.value.y + menu.value.clientHeight > window.innerHeight
	) {
		position.value.y = position.value.y - menu.value.clientHeight / 2;
	}

	if (position.value.x + menu.value.clientWidth > window.innerWidth) {
		position.value.x = window.innerWidth - menu.value.clientWidth;
	}

	if (position.value.y > window.innerHeight - menu.value.clientHeight){
		position.value.y = position.value.y - menu.value.clientHeight;
	}
}

defineExpose({
	open,
	close,
})

onMounted(() => {
	watch([isOpen, lastMouseEvent], () => {
		nextTick(updateMenu);
	})
})

onClickOutside(menu, () => {
	if (isOpen.value) {
		close()
	}
})

</script>

<template>
	<ClientOnly>
		<Teleport to='#modals'>
			<TransitionFade>
				<template v-if="isOpen">
					<div ref="menu" class="absolute overflow-hidden w-max h-max"
						:style="{
							left: `${position.x}px`,
							top:  `${position.y}px`,
						}"
					>
						<slot/>
					</div>
				</template>
			</TransitionFade>
		</Teleport>
	</ClientOnly>
</template>
