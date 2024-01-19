<script setup lang='ts'>
import { EChatType } from '#imports';

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	}
});

const { addNotif } = useNotifStore();
const { textarea, input } = useTextareaAutosize()

input.value = "";


const { primaryUser } = useUserStore();
const res = await fetchAllChatsUserCanJoin(primaryUser.value.id);
const channelSelected = ref<{
	id: number,
	name: string,
	type: EChatType,
	chat_picture: string,
}>({
	id: 0,
	name: "",
	type: EChatType.friends,
	chat_picture: "",
});

async function join() {
	if (channelSelected.value.type === EChatType.protected) {
		const password = input.value;
		input.value = "";
		if (password && password.length > 0) {
			// console.log("joining for user: " + password);
			fetchJoinProtectedChat(primaryUser.value.id, channelSelected.value.id, password, (res) => {
				if (res.error){
					addNotif(`Could not join chat`);
					return ;
				}
				navigateTo(`/messages/${channelSelected.value.id}`);
			});
		}
	}
	else if (channelSelected.value.type === EChatType.public) {
		fetchJoinChat(primaryUser.value.id, channelSelected.value.id, (res) => {
			if (res.error){
				addNotif(`Could not join chat`);
				return ;
			}
			navigateTo(`/messages/${channelSelected.value.id}`)
		});
		
	}
	props.closeFunc();
}

</script>

<template>
	<div class="w-[60vw] max-w-lg bg-background2 rounded-xl">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<div class="grid grid-cols-[4em_auto] col-span-2 grid-rows-[4em] text-text">
				<template v-for="channel in (res?.data?.value ?? [])" :key="channel?.id">
					<div class="contents group"
						@click="channelSelected = channel"
					>
						<GenericProfilePicture class="w-full h-full rounded-l-lg group-hover:bg-color2" :imageSrc="channel.chat_picture"
							:class="css.has({
								'bg-color1': channelSelected.id === channel.id,
							})"
						/>
						<div class="flex items-center h-full p-2 rounded-r-lg group-hover:bg-color2"
							:class="css.has({
								'bg-color1': channelSelected.id === channel.id,
							})"
						>
							{{ channel.name }}
						</div>
					</div>
				</template>
			</div>
			<template v-if="channelSelected.id !== 0 && channelSelected.type === EChatType.protected">
				<input type="password" v-model="input" class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Password" />
			</template>
			<template v-if="channelSelected.id !== 0">
				<div class="col-span-2 text-center">Are you sure you want to join {{ channelSelected.name }} ?</div>
				<GenericButton class="self-end w-10 h-10 mb-2 ml-auto" :buttonStyle="1" @click="join">Yes</GenericButton>
				<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1" @click="props.closeFunc">No</GenericButton>
			</template>
		</div>
	</div>
</template>