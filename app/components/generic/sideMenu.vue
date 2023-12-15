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
		updateMenu()
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
	if (!buttonRef || !buttonRef.value || !menuRef.value){
		return;
	}
	const button = buttonRef.value.getBoundingClientRect();
	const menu = menuRef.value.getBoundingClientRect();
	
	switch (props.direction) {
		case 'vertical':
		case 'bottom':
		case 'top':
			switch (props.alignDirection) {
				case 'right':	position.value.x = (button.left < window.innerWidth - menu.width ? button.left : window.innerWidth - menu.width); break;
				case 'left':	position.value.x = (button.left + button.width - menu.width > 0 ? position.value.x = button.left + button.width - menu.width : 0); break;
				case 'middle':	position.value.x = button.left + button.width / 2 - menu.width / 2; break;
				default: break;
			}
			break;
		case 'horizontal':
		case 'right':
		case 'left':
			switch (props.alignDirection) {
				case 'bottom':	position.value.y = (button.top < window.innerHeight - menu.height ? button.top : window.innerHeight - menu.height); break;
				case 'top':		position.value.y = (button.top + button.height - menu.height > 0 ? position.value.x = button.top + button.height - menu.height : 0); break;
				case 'middle':	position.value.y = button.top + button.height / 2 - menu.height / 2; break;
				default: break;
			}
		default:
			break;
	}

	switch (props.direction) {
		case 'vertical':	position.value.y = (2 * button.top + button.height < window.innerHeight ? button.top + button.height : button.top - menu.height); break;
		case 'bottom':		position.value.y = button.top + button.height; break;
		case 'top':			position.value.y = button.top - menu.height; break;
		case 'horizontal':	position.value.x = (2 * button.left + button.width < window.innerWidth ? button.left + button.width : button.left - menu.width); break;
		case 'right':		position.value.x = button.left + button.width; break;
		case 'left':		position.value.x = button.left - menu.width; break;
		default: break;
	}
}

</script>
	
<template>
	<template v-if="isOpen">
		<teleport to='#modals'>
			<div class="absolute overflow-hidden h-max w-max" ref="menuRef"
				:style="{
					left: `${position.x}px`,
					top:  `${position.y}px`,
				}"
			>
				<slot/>
			</div>
		</teleport>
	</template>
</template>
