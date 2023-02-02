<template>
	<u-transition :show="true" mode="fade-right">
		<view class="meeting">
			<u-overlay :show="loading" :duration="400" :z-index="999">
				<view class="loading"><u-loading-icon vertical textColor="#3c9cff" text="加载中..." color="#3c9cff"></u-loading-icon></view>
			</u-overlay>
			<view class="m-h">
				<view class="list-header">
					<view class="title-year" @click="yearShow = true"><u--text :size="20" type="warning" :text="nowYear"></u--text></view>
					<view class="title-search">
						<u--input
							shape="circle"
							color="#ffffff"
							v-model="params.content"
							placeholder="请输入内容"
							suffixIcon="search"
							suffixIconStyle="font-size: 22px;color: #909399"
						>
							<template slot="suffix">
								<u-icon @click="search" name="search" color="#ffffff"></u-icon>
							</template>
						</u--input>
					</view>
				</view>
				<view><u-tabs :current="currenMonth" :lineWidth="currenMonth > -1 ? 20 : 0" :list="timeList" @click="chooseMonth" lineColor="#f9ae3d" :inactiveStyle="{ color: '#ffffff' }" :activeStyle="{ color: '#f9ae3d' }"></u-tabs></view>
			</view>

			<view class="list">
				<view class="list-empty" v-if="cardList.length == 0"><u-empty></u-empty></view>
				<u-list @scrolltolower="scrolltolower" height="100%">
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
										:type="statusType(card.meetingStatus)"
										prefixIcon="calendar-fill"
										:size="16"
										:iconStyle="`font-size: 22px; color: ${statusColor(card.meetingStatus)};margin-right: 8px;`"
										:text="statusText(card.meetingStatus)"
									></u--text>
								</view>
							</view>
							<view class="card-bottom">
								<view class="card-content"><u--text :size="18" bold :lines="2" :text="card.meetingName"></u--text></view>
								<view class="card-img"><u-image width="120px" height="70px" shape="square" radius="5" :src="card.meetingCover" :lazy-load="true"></u-image></view>
							</view>
						</view>
					</u-list-item>
				</u-list>
			</view>

			<!-- 年 -->
			<u-picker :show="yearShow" :defaultIndex="yearDefault" :columns="yearColumns" @confirm="yearConfirm" @cancel="yearShow = false"></u-picker>
			<!-- single月 -->
			<!-- <u-calendar :maxDate="maxDate" :minDate="minDate" :defaultDate="defaultDate" :show="monthShow" @confirm="monthConfirm" @close="monthShow = false"></u-calendar> -->
			<u-calendar monthNum="12" :maxDate="maxDate" :show="monthShow" @confirm="monthConfirm" @close="monthShow = false"></u-calendar>
			<!-- double月 -->
			<u-calendar monthNum="12" :maxDate="maxDate" :show="doubleShow" mode="range" @confirm="doubleConfirm" @close="doubleShow = false"></u-calendar>
			<!-- tab切换 -->
			<u-popup :round="10" :show="timeShow" mode="center"  @close="timeShow = false">
				<view class="pop-btn">
					<u-button @click="chooseTimeType('single')" type="primary" :plain="true" text="单个日期"></u-button>
					<view style="height: 24px;"></view>
					<u-button @click="chooseTimeType('double')" type="primary" :plain="true" text="日期范围"></u-button>
				</view>
			</u-popup>
		</view>
	</u-transition>
</template>

<script>
import api from '@/config/api.js';
export default {
	data() {
		return {
			totalPage: 1,
			loading: false,
			defaultDate: '',
			monthShow: false,
			maxDate: '',
			minDate: '',
			yearDefault: [],
			yearColumns: [],
			yearShow: false,
			timeList: [],
			nowYear: '',
			nowMonth: '',
			currenMonth: '',
			cardList: [],
			params: {
				page: 1,
				size: 10,
				startTime: '',
				endTime: '',
				content: ''
			},
			doubleShow: false,
			timeShow: false,
			statusMap: {
				1: {
					text: "未开始",
					color: "#5ac725",
					type: "success"
				},
				2: {
					text: "进行中",
					color: "#f9ae3d",
					type: "warning"
				},
				3: {
					text: "已结束",
					color: "#909399",
					type: "info"
				}
			}
		};
	},
	created() {
		this.init();
	},
	methods: {
		statusType(val) {
			return this.statusMap[val].type
		},
		statusText(val) {
			return this.statusMap[val].text
		},
		statusColor(val) {
			return this.statusMap[val].color
		},
		chooseTimeType(type) {
			this.timeShow = false
			if(type === "single") {
				this.monthShow = true
			}
			if(type === "double") {
				this.doubleShow = true
			}
		},
		monthConfirm(val) {
			console.log(val)
			const time = val[0]
			this.params.startTime = new Date(time + " 00:00:00").getTime();
			this.params.endTime = new Date(time + " 23:59:59").getTime();
			// this.defaultDate = val[0];
			this.getList();
			this.monthShow = false;
		},
		doubleConfirm(val) {
			console.log(val)
			this.params.startTime = new Date(val[0] + " 00:00:00").getTime();
			this.params.endTime = new Date(val[1] + " 23:59:59").getTime();
			this.getList();
			this.doubleShow = false;
		},
		chooseMonth(val) {
			this.currenMonth = val.index;
			this.nowMonth = val.value;
			const nowMonth = val.value
			// this.monthShow = true;
			// this.timeShow = true;
			// const day = this.$u.timeFormat(new Date(), 'yyyy-mm-dd')
			// this.minDate = day;
			// this.maxDate = this.$u.timeFormat(new Date(this.nowYear, this.nowMonth, 0), 'yyyy-mm-dd');
			// this.defaultDate = this.defaultDate ? this.defaultDate : `${this.nowYear}-${this.nowMonth}-01`;
			
			const fd = this.$u.timeFormat(new Date(this.nowYear, nowMonth - 1, 1, 0, 0, 0), 'yyyy-mm-dd hh:MM:ss')
			const ld = this.$u.timeFormat(new Date(this.nowYear, nowMonth, 0, 23, 59, 59), 'yyyy-mm-dd hh:MM:ss')
			console.log(fd, ld)
			const firstDay = new Date(fd).getTime();
			const lastDay = new Date(ld).getTime();
			this.params.page = 1
			this.params.startTime = firstDay
			this.params.endTime = lastDay
			this.getList();
		},
		yearConfirm(val) {
			const year = val.value[0];
			this.nowYear = year;
			this.yearDefault = val.indexs;
			this.yearShow = false;
			const arr = this.$u.timeFormat(this.params.startTime, 'yyyy-mm-dd').split('-');
			if(this.params.content) {
				this.currenMonth = -1
				this.forMateYear()
			} else {
				this.params.startTime = new Date(`${year}-${arr[1]}-${arr[2]}`).getTime();
			}
			this.getList();
		},
		toEdit(row) {
			uni.navigateTo({
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
			const year = [];
			for (let i = 1; i < 13; i++) {
				if (i == m) {
					this.currenMonth = i - 1;
				}
				result.push({
					name: i + '月',
					value: i,
					badge: {
						isDot: false
					}
				});
			}
			for (let i = 2010; i < 2050; i++) {
				if (i == y) {
					this.yearDefault.push(year.length);
				}
				year.push(i);
			}
			console.log(this.yearDefault);
			this.timeList = result;
			this.yearColumns.push(year);

			// 时间

			this.nowYear = y;
			// const firstDayTime = this.$u.timeFormat(new Date(y, m - 1, 1), 'yyyy-mm-dd');
			const fd = this.$u.timeFormat(new Date(this.nowYear, m - 1, 1, 0, 0, 0), 'yyyy-mm-dd hh:MM:ss')
			const ld = this.$u.timeFormat(new Date(this.nowYear, m, 0, 23, 59, 59), 'yyyy-mm-dd hh:MM:ss')
			console.log(fd, ld)
			this.params.startTime = new Date(fd).getTime();
			this.params.endTime = new Date(ld).getTime();
			this.params.page = 1;
			this.getList();
		},
		forMateYear() {
			const firstDay = new Date(this.nowYear, 0, 1, 0, 0, 0);
			const lastDay = new Date(this.nowYear, 12, 0, 23, 59, 59);
			console.log(this.$u.timeFormat(firstDay, "yyyy-mm-dd hh:MM:ss"))
			console.log(this.$u.timeFormat(lastDay, "yyyy-mm-dd hh:MM:ss"))
			this.params.startTime = firstDay.getTime()
			this.params.endTime = lastDay.getTime()
		},
		search() {
			this.params.page = 1;
			if(this.params.content) {
				this.currenMonth = -1
				this.forMateYear()
			} else {
				const m = new Date().getMonth()
				this.chooseMonth({
					index: m,
					value: m + 1
				})
			}
			this.$u.throttle(this.getList, 5000);
		},
		scrolltolower() {
			if(this.totalPage > this.params.page) {
				this.params.page++;
				this.getList(true);
			}
		},
		async getList(isAdd) {
			this.loading = true;
			await api
				.getMeeting(this.params)
				.then(res => {
					const list = res.records.map(item => {
						const startStr = this.$u.timeFormat(item.startTime, 'dd日 hh:MM');
						const endStr = this.$u.timeFormat(item.endTime, 'dd日 hh:MM');
						item.time = startStr + ' ~ ' + endStr;
						return item;
					});
					this.totalPage = res.totalPages
					if(isAdd) {
						this.cardList = this.cardList.concat(list)
					} else {
						this.cardList = list
					}
					if(this.params.content && res.hasMonth) {
						const existMonth = res.hasMonth[this.nowYear] ? res.hasMonth[this.nowYear] : []
						this.timeList.forEach(item => {
							if(existMonth.includes(item.value)) {
								item.badge.isDot = true
							} else {
								item.badge.isDot = false
							}
						})
					} else {
						this.timeList.forEach(item => item.badge.isDot = false)
					}
					this.loading = false;
				})
				.catch(() => (this.loading = false));
		}
	}
};
</script>

<style lang="scss" scoped>
.pop-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 60vw;
	padding: 40px 20px;
}
.meeting {
	position: relative;
	&::after {
		z-index: -1;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: ' ';
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
	height: calc(100vh - 117px);
	margin-top: 16px;
	padding: 0 10px;
	padding-bottom: 10px;
	.list-empty {
		margin-top: 60px;
	}
	.card {
		margin-bottom: 10px;
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
