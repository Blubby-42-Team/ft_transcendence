<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number,
		required: true
	},
});

const { getUser, getStat, getHistory, fetchStat, fetchUser, fetchHistory } = useUserStore();
const userId = computed(() => props.userId);
const user = getUser(userId);
const stats = ref(getStat(userId));
const history = ref(getHistory(userId));

await fetchUser(props.userId);
await fetchStat(props.userId);
await fetchHistory(props.userId);

watch(() => props.userId, async () => {
	await fetchUser(props.userId);
	await fetchStat(props.userId);
	await fetchHistory(props.userId);
});

</script>

<template>
	<div class="grid h-full grid-cols-2 grid-rows-[max-content,max-content,1fr]">
		<div class="flex justify-center p-5 overflow-hidden h-max w-max">
			<GenericProfilePicture :imageSrc="user.avatar" class="w-64 h-64" showStatus/>
		</div>
		<div class="grid grid-cols-[3rem,auto] grid-rows-5">
			<div class="col-span-2"></div>
			<div class="self-center col-span-2 p-2 text-4xl ">{{ user.name }}</div>
			<div class="text-text-custom"><Icon name="material-symbols:person" class="w-full h-full"/></div>
			<div class="self-center p-2">{{ user.fullName }}</div>
			<div class="p-2 text-text-custom"><Icon name="42" class="w-full h-full"/></div>
			<div class="self-center p-2 ">{{ user.login42 }}</div>
		</div>
		<div class="col-span-2 pb-5">
			<div class="grid w-full grid-cols-[1fr,2rem,1fr] h-max">
				<ProfileStat name="Classic" :stat="stats.classic"/>
				<br>
				<ProfileStat name="Random" :stat="stats.random"/>
			</div>
		</div>
		<div class="h-full col-span-2 overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 scrollbar-thumb-rounded-full scrollbar-track">
			<HistoryList :matchList="history"/>
		</div>
	</div>
</template>