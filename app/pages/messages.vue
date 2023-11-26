<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.MESSAGES, "My Message"); })

const { isSideMenuOpen } = useChannelListStore();

</script>

<template>
	<div class="grid h-full grid-rows-[100%]" :class="isSideMenuOpen ? 'grid-cols-[16em,1fr,auto]' : 'grid-cols-[16em,1fr]'">
		<MessageSelectingChannelList/>

		<MessageChannel :id="0"/>

		<MessageGroupChannelMemberList/>
	</div>
</template>