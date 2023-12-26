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
	<div class="grid h-full grid-rows-[4em_100%] overflow-hidden"
		:class="css.has({
			'grid-cols-[16em,1fr,auto] || grid-cols-[16em,1fr]': isSideMenuOpen,
		})"
	>
		<div class="bg-color1" 
			:class="css.has({
				'col-span-2 || col-span-3': !isSideMenuOpen,
			})"
		>
			{{ channel?.name }}
		</div>

		<MessageSelectingChannelList/>

		<template v-if="channel !== null">
			<MessageChannel :channel="channel"/>
		</template>
		<template v-else>
			<div class="w-full p-5">Loading...</div>
		</template>

		<MessageGroupChannelMemberList :members="channel?.members ?? []"/>
	</div>
</template>