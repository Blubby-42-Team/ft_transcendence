<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })

const { isSideMenuOpen } = useChannelListStore();

const { getChannel } = useChannelStore();
const channel = getChannel(0);
console.log(channel.value);

</script>

<template>
	<div class="grid h-full grid-rows-[100%]" :class="isSideMenuOpen ? 'grid-cols-[16em,1fr,auto]' : 'grid-cols-[16em,1fr]'">
		<MessageSelectingChannelList/>

		<template v-if="channel !== null">
			<MessageChannel :channel="channel"/>
		</template>
		<template v-else>
			<div class="w-full">WIP</div>
		</template>

		<MessageGroupChannelMemberList/>
	</div>
</template>