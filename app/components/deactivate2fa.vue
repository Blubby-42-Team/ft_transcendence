<script setup lang="ts">

const props = defineProps({
	close: {
		type: Function as PropType<() => void>,
		required: true
	},
});

import { useQRCode } from '@vueuse/integrations/useQRCode'
const qrcode = useQRCode("xdxwewewewewexdxwewewewewexdxwewewewewexdxwewewewewe")

const { addNotif } = useNotifStore();
const code = ref('');

async function submit(){
	const res = await fetchChange2fa(false, code.value)
	if (res.error){
		addNotif(res.data?.value?.message ?? '');
		return;
	}
	addNotif('2fa disabled');
	props.close();
}

</script>

<template>
	<div class="p-5 w-96 h-96 bg-background2 rounded-xl text-text">
		<div class="w-full h-full">
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
</template>