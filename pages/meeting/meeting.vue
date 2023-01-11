<template>
	<view class="meeting">
		<view class="m-h">
			<view class="list-header">
				<view class="title-year" @click="yearShow = true"><u--text :size="20" type="warning" :text="nowYear"></u--text></view>
				<view class="title-search">
					<u--input shape="circle" color="#ffffff" v-model="params.content" placeholder="请输入内容" suffixIcon="search" suffixIconStyle="font-size: 22px;color: #909399">
						<template slot="suffix">
							<u-icon @click="search" name="search" color="#ffffff"></u-icon>
						</template>
					</u--input>
				</view>
			</view>
			<view>
				<u-tabs 
					:list="timeList" 
					@click="chooseMonth"
					lineColor="#f9ae3d"
					:inactiveStyle="{ color: '#ffffff' }"
					:activeStyle="{ color: '#f9ae3d' }"
				></u-tabs>
			</view>
		</view>

		<view class="list">
			<view class="list-empty" v-if="cardList.length == 0">
				<u-empty></u-empty>
			</view>
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
		
		<!-- 年 -->
		<u-picker :show="yearShow" :defaultIndex="yearDefault" :columns="yearColumns" @confirm="yearConfirm" @cancel="yearShow = false"></u-picker>
		<!-- 月 -->
		<u-calendar 
			:maxDate="maxDate"
			:minDate="minDate"
			:defaultDate="defaultDate"
			:show="monthShow" 
			@confirm="monthConfirm"
			@close="monthShow = false"
		>
		</u-calendar>
	</view>
</template>

<script>
import api from '@/config/api.js';
export default {
	data() {
		return {
			defaultDate: "",
			monthShow: false,
			maxDate: "",
			minDate: "",
			yearDefault: [],
			yearColumns: [],
			yearShow: false,
			timeList: [],
			nowYear: '',
			nowMonth: "",
			currenMonth: "",
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
		monthConfirm(val) {
			this.params.startTime = new Date(val[0]).getTime()
			this.defaultDate = val[0]
			this.getList()
			this.monthShow = false
		},
		chooseMonth(val) {
			this.currenMonth = val.index
			this.nowMonth = val.value
			this.monthShow = true
			this.minDate = `${this.nowYear}-${this.nowMonth}-01`
			this.maxDate = this.$u.timeFormat(new Date(this.nowYear, this.nowMonth, 0), "yyyy-mm-dd")
			this.defaultDate = `${this.nowYear}-${this.nowMonth}-01`
		},
		yearConfirm(val) {
			const year = (val.value)[0]
			this.nowYear = year
			this.yearDefault = val.indexs
			this.yearShow = false
			const arr = this.$u.timeFormat(this.params.startTime, "yyyy-mm-dd").split("-")
			this.params.startTime = new Date(`${year}-${arr[1]}-${arr[2]}`).getTime()
			this.getList()
		},
		toEdit(row) {
			uni.reLaunch({
				// url: `/pages/my/my?row=${encodeURIComponent(JSON.stringify(row))}`
				url: `/pages/info/info?row=${encodeURIComponent(JSON.stringify(row))}`
			});
		},
		init() {
			const now = new Date();
			const y = now.getFullYear(),
				m = now.getMonth() + 1;
			// 月份
			const result = [];
			const year = []
			for (let i = 1; i < 13; i++) {
				if(i == m) {
					this.currenMonth = i - 1
				}
				result.push({
					name: i + '月',
					value: i
				});
			}
			for (let i = 2010; i < 2050; i++) {
				if(i == y) {
					this.yearDefault.push(year.length)
				}
				year.push(i)
			}
			console.log(this.yearDefault)
			this.timeList = result;
			this.yearColumns.push(year)

			// 时间
			
			this.nowYear = y;
			const firstDayTime = new Date(y, m - 1, 1).getTime();
			this.params.startTime = firstDayTime;
			this.params.page = 1;
			this.getList();
		},
		search() {
			this.params.page = 1;
			this.$u.throttle(this.getList, 5000)
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
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.meeting {
	position: relative;
	&::after {
		z-index: -1;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: " ";
		opacity: 0.9;
		background-color: #ececec;
		margin: 0px;
		background: url(@/static/bg.jpg) no-repeat;
		background-size: 100% 100%;
		background-attachment: fixed;
	}
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
	.list-empty {
		margin-top: 60px;
	}
	.card {
		background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
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
		.card-content {
			margin-right: 10px;
		}
	}
}
</style>
