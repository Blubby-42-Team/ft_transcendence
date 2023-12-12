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
})


const isOpen		= ref(false);
const contentRef	= ref<HTMLInputElement>()
const buttonRef		= ref<HTMLInputElement>()
const position		= ref({
	x: 0,
	y: 0,
})

function open() { isOpen.value = true; startUpdateLoop()  }
function close(){ isOpen.value = false; }

function startUpdateLoop(){
	nextTick(async () => {
		while (isOpen.value && contentRef.value && buttonRef.value) {
			const button = buttonRef.value.getBoundingClientRect();
			const content = contentRef.value.getBoundingClientRect();

			switch (props.direction) {
				case 'vertical':
				case 'bottom':
				case 'top':
					switch (props.alignDirection) {
						case 'right':	position.value.x	= button.left; break;
						case 'left':	position.value.x	= button.left + button.width - content.width; break;
						case 'middle':	position.value.x	= button.left + button.width / 2 - content.width / 2; break;
						default: break;
					}
					break;
				case 'horizontal':
				case 'right':
				case 'left':
					switch (props.alignDirection) {
						case 'bottom':	position.value.y	= button.top; break;
						case 'top':		position.value.y	= button.top + button.height - content.height; break;
						case 'middle':	position.value.y	= button.top + button.height / 2 - content.height / 2; break;
						default: break;
					}
				default:
					break;
			}

			switch (props.direction) {
				case 'vertical':	position.value.y = (2 * button.top + button.height < window.innerHeight ? button.top + button.height : button.top - content.height); break;
				case 'bottom':		position.value.y = button.top + button.height; break;
				case 'top':			position.value.y = button.top - content.height; break;
				case 'horizontal':	position.value.x = (2 * button.left + button.width < window.innerWidth ? button.left + button.width : button.left - content.width); break;
				case 'right':		position.value.x = button.left + button.width; break;
				case 'left':		position.value.x = button.left - content.width; break;
				default: break;
			}

			await new Promise(resolve => setTimeout(resolve, 10));
		}
	})
}

onClickOutside(contentRef, () => {
	if (isOpen.value) {
		close()
	}
})

</script>
	
<template>
	<div ref="buttonRef" @click="open" class="flex w-min h-min">
		<slot name="reference"/>
	</div>
	<!-- <TransitionExpand> -->
		<template v-if="isOpen">
			<div class="absolute h-max w-max" ref="contentRef"
				:style="{
					left: `${position.x}px`,
					top:  `${position.y}px`,
				}"
			>
				<slot name="thisContent"/>
			</div>
		</template>
	<!-- </TransitionExpand> -->
</template>
