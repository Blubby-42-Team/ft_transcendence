<script setup lang="ts">

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
})

const isOpen = ref(props.show);
const modal = ref<HTMLInputElement>()

function open() { isOpen.value = true; }
function close(){ isOpen.value = false; }

defineExpose({
	open,
	close,
})

</script>

<template>
	<ClientOnly>
		<Teleport to='#modals'>
			<TransitionFade>
				<template v-if="isOpen">
					<div class="fixed top-0 left-0 grid w-full h-full grid-cols-[auto_max-content_auto] grid-rows-[auto_max-content_auto] overflow-auto h-25 m-25 bg-black bg-opacity-70"
						@click.self="close"
					>
						<div ref="modal" class="flex w-full h-full col-start-2 row-start-2 p-3 ml-auto mr-auto">
							<slot/>
						</div>
					</div>
				</template>
			</TransitionFade>
		</Teleport>
	</ClientOnly>
</template>
