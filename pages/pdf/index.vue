<template>
	<view class="pdf">
		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in indexList" :key="index">
				<u-cell>
					<view slot="title" class="pdf-title">
						<u--text :lines="2" :text="item.fileName"></u--text>
					</view>
					<view slot="value" class="pdf-btn">
						<u-icon size="20" name="download" @tap="onDownload(item.fileUrl)"></u-icon>
						<view class="empty-blank"></view>
						<u-icon size="20" name="trash" @tap="onTrash(item.id)"></u-icon>
					</view>
					<!-- <u-avatar slot="icon" shape="square" size="35" :src="item.url" customStyle="margin: -3px 5px -3px 0"></u-avatar> -->
				</u-cell>
			</u-list-item>
		</u-list>
		
		<u-modal @confirm="confirm" @cancel="show = false" :show="show" title="提示" content='确认删除？'></u-modal>
	</view>
</template>

<script>
import api from '@/config/api.js';
export default {
	data() {
		return {
			show: false,
			indexList: [],
			params: {
				page: 1,
				size: 15
			},
			totalPages: 1,
			id: ""
		};
	},
	onLoad() {
		this.params.page = 1
		this.totalPages = 1
		this.loadmore();
	},
	methods: {
		scrolltolower() {
			if(this.params.page >= this.totalPages) {
				uni.$u.toast('没有更多内容了！');
				return
			} else {
				this.params.page++;
				this.loadmore();
			}
		},
		onDownload(url) {
			uni.downloadFile({
				url,
				success: (res) => {
					if (res.statusCode === 200) {
						console.log('下载成功');
					}
				}
			});
		},
		onTrash(id) {
			this.id = id
			this.show = true
		},
		confirm() {
			this.show = false
			api.deletePDF({id: this.id}).then(() => {
				uni.$u.toast('删除成功！');
				this.params.page = 1
				this.totalPages = 1
				this.loadmore()
			}).catch(() => uni.$u.toast('删除失败!'))
		},
		async loadmore() {
			await api.getPDF(this.params)
			.then(res => {
				this.totalPages = res.totalPages
				this.indexList = res.records
			}).catch(err => console.log(err))
		}
	}
};
</script>

<style>
	.pdf-title {
		max-width: 70%;
	}
	.pdf-btn {
		display: flex;
	}
	.empty-blank {
		width: 20px;
	}
</style>
