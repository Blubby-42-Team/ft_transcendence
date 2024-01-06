<script setup lang="ts">

const props = defineProps({
	close: {
		type: Function as PropType<() => void>,
		required: true
	},
});

import { useQRCode } from '@vueuse/integrations/useQRCode'

const { addNotif } = useNotifStore();

const { data } = await fetchGetQRCode()
const url = data.value?.otpauthUrl ?? '';
const qrcode = useQRCode(url)

const code = ref('');

async function submit(){
	const res = await fetchChange2fa(true, code.value)
	if (res.error){
		addNotif(res.data?.value?.message ?? '');
		return;
	}
	addNotif('2fa activated');
		// .then((res) => {
		// 	console.log(res)
		// 	addNotif('2fa activated');
		// })
		// .catch((err) => {
		// 	addNotif(err.message);
		// 	console.warn(err);
		// })
	props.close();
}

</script>

<template>
	<div class="p-5 w-[48rem] h-96 bg-background2 rounded-xl text-text">
		<div class="grid w-full h-full grid-cols-2">
			<div class="grid h-full grid-rows-[4rem,auto]">
				<a :href="url" class="w-full h-full">
					<GenericButton :buttonStyle="1" class="w-full h-full bg-color1 rounded-xl" :href="url">
						Active 2fa
					</GenericButton>
				</a>
				<img :src="qrcode" alt="QR Code" class="self-center justify-center w-64 h-64 justify-self-center"/>
			</div>
			<div class="p-5">
				<div class="grid h-full grid-rows-2">
					<div class="flex items-center justify-center h-full">Enter your validation code</div>
					<div class="grid grid-cols-[auto,3rem]">
						<input v-model="code" class="w-full h-16 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Find a new channel" />
						<GenericButton class="w-10 h-10 m-2" :buttonStyle="1"
							@click="submit"
						>
							<Icon name="material-symbols:send" class="w-10 h-10"/>
						</GenericButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>