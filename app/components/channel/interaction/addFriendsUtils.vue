<script setup lang='ts'>

const props = defineProps({
	userId: {
		type: Number,
		required: true
	},
	isSelected: {
		type: Boolean,
		required: false,
	}
});

const userStore = useUserStore();
const { getUser } = storeToRefs(userStore);
const user = getUser.value(props.userId);
await userStore.fetchUser(props.userId);

</script>

<template>
	<div class="contents group">
		<GenericProfilePicture class="w-full h-full rounded-l-lg group-hover:bg-color2" :imageSrc="user.avatar"
			:class="css.has({
				'bg-color1': props.isSelected,
			})"
		/>
		<div class="flex items-center h-full p-2 rounded-r-lg group-hover:bg-color2"
			:class="css.has({
				'bg-color1': props.isSelected,
			})"
		>
			{{ user.name }}
		</div>
	</div>
</template>