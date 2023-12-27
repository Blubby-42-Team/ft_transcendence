<script lang="ts" setup>

const members = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]

const { fetchFriends, fetchPrimaryUser, getFriends, primaryUser } = useUserStore();
const friends = getFriends(primaryUser.value.id);
await fetchFriends(primaryUser.value.id);

console.log(friends.value);

</script>

<template>
	<div class="h-full overflow-x-hidden scrollbar bg-background1 scrollbar-w-0 w-60">
		<template v-for="member in members">
			<FriendsListElem :userId="member"/>
		</template>
	</div>
</template>