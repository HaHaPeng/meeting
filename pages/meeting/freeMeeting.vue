<template>
	<view>
		<MeetingBase></MeetingBase>
	</view>
</template>

<script>
import MeetingBase from "./meetingBase.vue"
import { mapMutations } from "vuex"
export default {
	components: {
		MeetingBase
	},
	onLoad() {
		this.clearStore()
	},
	methods: {
		...mapMutations(["clearStore"])
	}
};
</script>