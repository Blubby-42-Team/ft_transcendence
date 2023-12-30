<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number,
    	required: true
	},
})

const { getUser, getStat, fetchStat, fetchUser } = useUserStore();
const user = getUser(computed(() => props.userId));
const stats = getStat(computed(() => props.userId));

await fetchUser(props.userId);
await fetchStat(props.userId);

</script>

<template>
	<div class="w-full h-full overflow-hidden border-4 bg-gradient-to-bl from-yellow-400 via-accent1 to-yellow-400 rounded-2xl border-accent1">
		<div class="h-full w-full p-2 bg-gradient-to-tl grid from-yellow-600 via-transparent to-yellow-600 grid-rows-[9rem_max-content_repeat(4,auto)] rounded-xl justify-items-center">
			<GenericProfilePicture :imageSrc="user.fullName" class="w-32 h-32"/>
			<div class="flex justify-center w-full pt-2 overflow-hidden text-2xl font-bold truncate pb-7 text-text">{{ user.name }}</div>
			<ProfileStat class="w-full px-3 h-max" :stat="stats.classic"/>
		</div>
	</div>
</template>

