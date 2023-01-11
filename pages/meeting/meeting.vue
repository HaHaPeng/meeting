<template>
	<view class="meeting">
		<view class="m-h">
			<view class="list-header">
				<view class="title-year"><u--text :size="20" type="primary" :text="nowYear"></u--text></view>
				<view class="title-search">
					<u--input @confirm="search" placeholder="请输入内容" suffixIcon="search" suffixIconStyle="font-size: 22px;color: #909399"></u--input>
				</view>
			</view>
			<view><u-tabs :list="timeList" @click="click"></u-tabs></view>
		</view>

		<view class="list">
			<u-list @scrolltolower="scrolltolower">
				<u-list-item v-for="card in cardList" :key="card.id">
					<view class="card" @click="toEdit(card)">
						<view class="card-top">
							<view class="card-date">
								<u--text type="primary" bold :size="18" :text="card.time"></u--text>
								<!-- <view class="card-day"><u--text type="primary" bold :size="22" text="主色"></u--text></view> -->
								<!-- <view class="card-time"><u--text type="primary" bold :size="22" text="主色"></u--text></view> -->
							</view>
							<view class="card-label">
								<u--text
									type="warning"
									prefixIcon="calendar-fill"
									:size="16"
									iconStyle="font-size: 22px; color: #f9ae3d;margin-right: 8px;"
									text="可预约"
								></u--text>
							</view>
						</view>
						<view class="card-bottom">
							<view class="card-content"><u--text :size="18" bold :lines="2" :text="card.meetingDesc"></u--text></view>
							<view class="card-img"><u-image width="120px" height="70px" shape="square" radius="5" :src="card.meetingCover" :lazy-load="true"></u-image></view>
						</view>
					</view>
				</u-list-item>
			</u-list>
		</view>
	</view>
</template>

<script>
import api from '@/config/api.js';
export default {
	data() {
		return {
			timeList: [],
			nowYear: '',
			cardList: [],
			params: {
				page: 1,
				size: 10,
				startTime: '',
				content: ''
			}
		};
	},
	onLoad() {
		this.init();
	},
	methods: {
		toEdit(row) {
			this.$emit("changeRow", row)
			uni.switchTab({
				// url: `/pages/my/my?row=${encodeURIComponent(JSON.stringify(row))}`
				url: `/pages/my/my`
			});
		},
		init() {
			// 月份
			const result = [];
			for (let i = 1; i < 13; i++) {
				result.push({
					name: i + '月'
				});
			}
			this.timeList = result;

			// 时间
			const now = new Date();
			const y = now.getFullYear(),
				m = now.getMonth() + 1;
			this.nowYear = y;
			const firstDayTime = new Date(y, m - 1, 1).getTime();
			this.params.startTime = firstDayTime;
			this.params.page = 1;
			this.getList();
		},
		search() {
			this.params.page = 1;
			this.getList();
		},
		scrolltolower() {
			this.params.page++;
			this.getList();
		},
		async getList() {
			await api.getMeeting(this.params).then(res => {
				this.cardList = res.records.map(item => {
					const startStr = this.$u.timeFormat(item.startTime, 'dd日 hh:MM');
					const endStr = this.$u.timeFormat(item.endTime, 'dd日 hh:MM');
					item.time = startStr + ' ~ ' + endStr;
					return item;
				});
				console.log(this.cardList);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.meeting {
	background-color: #ececec;
	margin: 0px;
	background: url(@/static/bg.jpg) no-repeat;
	background-size: 100% 100%;
	background-attachment: fixed;
	// opacity: 0.8;
}
.list-header {
	display: flex;
	align-items: center;
	padding: 0 10px;
	padding-top: 10px;
	.title-year {
		width: 40px;
		margin-right: 20px;
	}
	.title-search {
		flex: auto;
	}
}
.list {
	margin-top: 16px;
	padding: 0 10px;
	.card {
		padding: 20px;
		border-radius: 10px;
		background-color: #ffffff;
	}
	.card-top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;
	}
	.card-bottom {
		display: flex;
		justify-content: space-between;
	}
}
</style>
