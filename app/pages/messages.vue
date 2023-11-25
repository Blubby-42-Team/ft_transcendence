<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.MESSAGES, "My Message"); })

const isMembersOpen		= useState('isMembersOpen',		() => true);
const isGroupSelected	= useState('isGroupSelected',	() => false);
const isGroupsOpen		= useState('isGroupsOpen',		() => true);
const isFriendsOpen		= useState('isFriendsOpen',		() => true);

</script>

<template>
	<div class="grid h-full grid-rows-1 overflow-hidden" :class="isGroupSelected ? 'grid-cols-[16em,1fr,3px,auto]' : 'grid-cols-[16em,1fr]'">
		<MessageSelectingChannelList/>

		<MessageChannel :id="0"/>

		<br>

		<template v-if="isGroupSelected">
			<MessageGroupChannelMemberList/>
		</template>
	</div>
</template>