<template>
	<u-transition :show="true" mode="fade-right">
		<view class="info">
			<view class="info-title"><u--text :text="row.meetingName" type="primary" align="center" size="20" bold color="#767a82"></u--text></view>
			<u-line color="#2979ff" dashed margin="0 0 20px 0"></u-line>
			<view class="info-cell">
				<view class="info-label"><u--text text="会议开始时间:" type="primary" align="right" bold size="16" color="#f9ae3d"></u--text></view>
				<view class="info-value"><u--text :lines="1" :text="$u.timeFormat(row.startTime, 'yyyy-mm-dd hh:MM:ss')" size="14" color="#767a82"></u--text></view>
			</view>
			<view class="info-cell">
				<view class="info-label"><u--text text="会议结束时间:" type="primary" align="right" bold size="16" color="#f9ae3d"></u--text></view>
				<view class="info-value"><u--text :lines="1" :text="$u.timeFormat(row.endTime, 'yyyy-mm-dd hh:MM:ss')" size="14" color="#767a82"></u--text></view>
			</view>
			<view class="info-cell">
				<view class="info-label"><u--text text="会议主讲人:" type="primary" align="right" bold size="16" color="#f9ae3d"></u--text></view>
				<view class="info-value"><u--text :lines="1" :text="row.meetingSpeaker" size="14" color="#767a82"></u--text></view>
			</view>
			<view class="info-cell">
				<view class="info-label"><u--text text="会议状态:" type="primary" align="right" bold size="16" color="#f9ae3d"></u--text></view>
				<view class="info-value"><u--text :lines="1" :text="row.meetingStatus" size="14" color="#767a82"></u--text></view>
			</view>
			<view class="info-cell">
				<view class="info-label"><u--text text="所属部门:" type="primary" align="right" bold size="16" color="#f9ae3d"></u--text></view>
				<view class="info-value"><u--text :lines="1" :text="row.dept" size="14" color="#767a82"></u--text></view>
			</view>
			<u-line color="#2979ff" dashed margin="0 0 20px 0"></u-line>
			<view style="margin-bottom: 10px;"><u--text type="primary" bold text="会议内容:" size="16" color="#767a82"></u--text></view>
			<u-read-more toggle showHeight="200" :shadowStyle="shadowStyle"><rich-text :nodes="row.meetingDesc"></rich-text></u-read-more>
			<u-line color="#2979ff" dashed margin="10px 0"></u-line>
			<view class="info-image"><image :src="row.detailImg" mode="widthFix" width="100%"></image></view>
			<view v-if ="isLogin" style="height: 10px;"></view>
			<u-button v-if="isLogin" color="#f29100" @click="link">编辑</u-button>
			<view v-if ="isLogin" style="height: 20px;"></view>
		</view>
	</u-transition>
</template>

<script>
import { mapGetters } from "vuex"
export default {
	data() {
		return {
			shadowStyle: {
				backgroundImage: 'none',
				paddingTop: '0',
				marginTop: '20rpx'
			},
			row: {},
			statusOptions: [
				{
					name: '未开始',
					value: 1
				},
				{
					name: '进行中',
					value: 2
				},
				{
					name: '已结束',
					value: 3
				}
			]
		};
	},
	computed: {
		...mapGetters(['isLogin'])
	},
	onLoad(options) {
		if (options.row) {
			const row = JSON.parse(options.row);
			row.meetingStatus = this.statusOptions.find(item => item.value == row.meetingStatus).name;
			this.row = row;
		} else {
			this.row = {};
		}
	},
	methods: {
		link() {
			uni.reLaunch({
				url: `/pages/my/my?row=${encodeURIComponent(JSON.stringify(this.row))}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.info {
	padding: 0 10px;
	min-height: 100vh;
	position: relative;

	&::after {
		z-index: -1;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: ' ';
		opacity: 0.3;
		background-color: #ececec;
		margin: 0px;
		background: url(@/static/bg.jpg) no-repeat;
		background-size: 100% 100%;
		background-attachment: fixed;
	}
}
.info-title {
	padding: 10px 0;
}
.info-cell {
	display: flex;
	margin-bottom: 12px;

	.info-label {
		flex: 1;
	}

	.info-value {
		padding-left: 10px;
		flex: 2;
		display: flex;
		align-items: center;
	}
}
.info-image {
	text-align: center;
	image {
		width: 100%;
	}
}
</style>
