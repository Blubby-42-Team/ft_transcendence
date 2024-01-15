<script lang="ts" setup>

const userStore = useUserStore();
const { primaryUser, getFriends } = storeToRefs(userStore);

const friends = getFriends.value(primaryUser.value.id);
await userStore.fetchFriends(primaryUser.value.id);

console.log(friends);

</script>

<template>
	<div class="h-full overflow-x-hidden scrollbar bg-background1 scrollbar-w-0 w-60">
		<template v-for="member in friends" :key="member.id">
			<FriendsListElem :userId="member"/>
		</template>
	</div>
</template>