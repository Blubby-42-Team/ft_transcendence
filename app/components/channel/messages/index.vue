<script lang="ts" setup>

defineProps({
	channel: {
		type: Object as PropType<IChannel>,
		required: true,
	},
})

const { primaryUser } = useUserStore()

const lastScrollTop = ref(0);
const isScrollingUp = ref(false);

const handleScroll = () => {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;

	console.log(scrollTop);

	// Check if scrolling up
	isScrollingUp.value = scrollTop < lastScrollTop.value;
	lastScrollTop.value = scrollTop;
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
	<div class="w-full h-full contents">
		<div class="flex flex-col w-full h-full overflow-x-hidden scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color2 overscroll-y-contain"
			:style="{ bottom: isScrollingUp ? '0' : '' }"
		>
			<template v-for="message in channel.messages">
				<template v-if="message.senderId == primaryUser.id">
					<ChannelMessagesMe :message="message"/>
				</template>
				<template v-else>
					<ChannelMessagesOther :message="message"/>
				</template>
			</template>
		</div>
	</div>
</template>
