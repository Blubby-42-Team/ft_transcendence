<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number,
    	required: true
	},
})

const userStore = useUserStore();
const { getUser, getStat } = storeToRefs(userStore);
const user = getUser.value(props.userId);
const stats = getStat.value(props.userId);
await userStore.fetchUser(props.userId);
await userStore.fetchStat(props.userId);

</script>

<template>
	<div class="w-full h-full overflow-hidden border-4 bg-gradient-to-bl from-yellow-400 via-accent1 to-yellow-400 rounded-2xl border-accent1">
		<div class="h-full w-full p-2 bg-gradient-to-tl grid from-yellow-600 via-transparent to-yellow-600 grid-rows-[9rem_max-content_repeat(4,auto)] rounded-xl justify-items-center">
			<GenericProfilePicture :imageSrc="user.avatar" class="w-32 h-32" :userId="props.userId"/>
			<div class="flex justify-center w-full pt-2 overflow-hidden text-2xl font-bold truncate pb-7 text-text">{{ user.name }}</div>
			<ProfileStat class="w-full px-3 h-max" :stat="stats.classic"/>
		</div>
	</div>
</template>

