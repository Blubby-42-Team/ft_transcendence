<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
	direction: {
		type: String as PropType<'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal'>,
		default: 'bottom',
	},
	alignDirection: {
		type: String as PropType<'left' | 'right' | 'top' | 'bottom' | 'middle'>,
		default: 'middle',
	},
	accessRef: {
		type: Function as PropType<() => Ref<HTMLElement | InstanceType<any> | undefined>>,
		required: true,
	},
});

const isOpen	= ref(false);
const position	= ref({x: 0, y: 0});
const menuRef	= ref<HTMLElement>();
let buttonRef: Ref<HTMLElement | undefined> | undefined = undefined;

onMounted(() => {
	const accessed = props.accessRef();

	if (accessed.value instanceof HTMLElement){
		buttonRef = accessed;
	}
	else if (accessed.value !== undefined){
		buttonRef = ref(accessed.value.$el);
	}

	watch([buttonRef, menuRef], () => {
		updateMenu();
	})
})

function open() { isOpen.value = true; nextTick(updateMenu)  }
function close(){ isOpen.value = false; }

onClickOutside(menuRef, () => {
	if (isOpen.value) {
		close()
	}
})

defineExpose({
	open,
	close,
})

function updateMenu(){
	setTimeout(() => {
		if (!buttonRef || !buttonRef.value || !menuRef.value){
			return;
		}

		const button = buttonRef.value.getBoundingClientRect();
		const menu = menuRef.value.getBoundingClientRect();
		position.value = getPositionForSideMenu(button, menu, props.direction, props.alignDirection);
	}, 100); // TODO - find a better way to do this, this is horrible
	
}

</script>
	
<template>
	<template v-if="isOpen">
		<Teleport to='#modals'>
			<div class="absolute overflow-hidden h-max w-max" ref="menuRef"
				:style="{
					left: `${position.x}px`,
					top:  `${position.y}px`,
				}"
			>
				<slot/>
			</div>
		</Teleport>
	</template>
</template>
