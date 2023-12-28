<script lang="ts" setup>

const { fetchFriends, fetchPrimaryUser, getFriends, primaryUser } = useUserStore();
const friends = getFriends(computed(() => primaryUser.value.id));
await fetchFriends(primaryUser.value.id);

console.log(friends.value);

</script>

<template>
	<div class="h-full overflow-x-hidden scrollbar bg-background1 scrollbar-w-0 w-60">
		<template v-for="member in friends">
			<FriendsListElem :userId="member"/>
		</template>
	</div>
</template>