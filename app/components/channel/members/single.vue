<script lang="ts" setup>

const props = defineProps({
	member: {
		type: Number,
		required: true,
	},
});

const userStore = useUserStore();
const { getShortUser } = storeToRefs(userStore);
const user = getShortUser.value(props.member);

const viewProfile = ref();
const testButton = ref();

const test = () => testButton;

</script>

<template>
	<GenericButton class="w-full p-1" :buttonStyle="2" @click="viewProfile?.open" ref="testButton">
		<GenericProfilePicture class="w-10 h-10" imageSrc="/pp.png" :userId="props.member"/>
		<div class="self-center pl-2">
			{{ user.name }}
		</div>
		<div class="mr-auto"></div>
		<GenericSideMenu ref="viewProfile" direction="left" alignDirection="bottom" :accessRef="test">
			<ChannelMembersPreview :userId="member"/>
		</GenericSideMenu>
	</GenericButton>
</template>