<script lang="ts" setup>

const props = defineProps({
	userId: {
		type: Number,
		required: true,
	},
})

const { getShortUser } = useUserStore()
const user = getShortUser(computed(() => props.userId));

const selectedFriend = useState<number | null>('selectedFriend');

function openProfile() {
	selectedFriend.value = props.userId;
	// console.log(selectedFriend.value);
}

</script>

<template>
	<GenericButton class="w-full p-1" :buttonStyle="2"
		@click="openProfile"
	>
		<GenericProfilePicture class="w-10 h-10" :imageSrc="user.avatar" :userId="props.userId"/>
		<div class="self-center pl-2">
			{{ user.name }}
		</div>
		<div class="mr-auto"></div>
	</GenericButton>
</template>