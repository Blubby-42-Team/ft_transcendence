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
	buttonId: {
		type: String,
		required: true,
	},
});

const isOpen		= ref(false);
const position		= ref({x: 0, y: 0});
const containerRef	= ref<HTMLElement | null>();
onMounted(() => containerRef.value = document.getElementById(props.buttonId));

const menuRef	= ref<HTMLInputElement>();

function open() { isOpen.value = true; nextTick(startLoop)  }
function close(){ isOpen.value = false; }

async function startLoop() {
	while (isOpen.value && menuRef.value && containerRef.value) {
		const button = containerRef.value.getBoundingClientRect();
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
		await new Promise(resolve => setTimeout(resolve, 10));
	}
}

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
	<TransitionExpand>
		<template v-if="isOpen">
			<div class="absolute h-max w-max" ref="menuRef"
				:style="{
					left: `${position.x}px`,
					top:  `${position.y}px`,
				}"
			>
				<slot/>
			</div>
		</template>
	</TransitionExpand>
</template>
