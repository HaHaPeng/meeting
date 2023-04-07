<template>
	<view class="pdf">
		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in indexList" :key="index">
				<u-cell>
					<view slot="title" class="pdf-title">
						<u--text :lines="2" :text="item.fileName"></u--text>
					</view>
					<view slot="value" class="pdf-btn">
						<u-icon size="20" name="eye" @tap="link(item.fileUrl)"></u-icon>
						<view class="empty-blank"></view>
						<u-icon size="20" name="download" @tap="onDownload(item.fileName, item.id, item.fileUrl)"></u-icon>
						<view class="empty-blank"></view>
						<u-icon size="20" name="trash" @tap="onTrash(item.id)"></u-icon>
					</view>
					<!-- <u-avatar slot="icon" shape="square" size="35" :src="item.url" customStyle="margin: -3px 5px -3px 0"></u-avatar> -->
				</u-cell>
			</u-list-item>
		</u-list>
		
		<u-modal @confirm="confirm" :showCancelButton="true" @cancel="show = false" :show="show" title="提示" content='确认删除？'></u-modal>
		
		<view class="pdf-add">
			<u-icon size="60" name="plus-circle-fill" @tap="upload"></u-icon>
		</view>
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
		this.initBygetList()
	},
	methods: {
		initBygetList() {
			this.params.page = 1
			this.totalPages = 1
			this.indexList = []
			this.loadmore();
		},
		creatA(url) {
			const a = document.createElement('a');
			a.href = url; // 下载链接
			a.style.display = 'none';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		},
		upload() {
			uni.chooseFile({
			  success: (res) => {
			    const tempFilePaths = res.tempFilePaths;
			    uni.uploadFile({
			      url: '/hospital/file/upload', // 上传接口的 URL
			      filePath: tempFilePaths[0], // 选择的文件路径
			      name: 'file', // 上传文件的字段名
			      success:  (res) => {
			        console.log('上传成功', res);
					uni.$u.toast('上传成功！');
					this.initBygetList()
					uni.$u.toast('上传失败！');
			        console.log('上传失败', err);
			        // 处理上传失败后的逻辑
			      }
			    });
			  }
			});
		},
		scrolltolower() {
			if(this.params.page >= this.totalPages) {
				uni.$u.toast('没有更多内容了！');
				return
			} else {
				this.params.page++;
				this.loadmore();
			}
		},
		link(url) {
			this.creatA(url)
		},
		onDownload(name = "default.pdf",id, url) {
			this.creatA((`/hospital/file/download?id=${id}`))
		},
		onTrash(id) {
			this.id = id
			this.show = true
		},
		confirm() {
			this.show = false
			api.deletePDF({id: this.id}).then(() => {
				uni.$u.toast('删除成功！');
				this.initBygetList()
			}).catch(() => uni.$u.toast('删除失败!'))
		},
		async loadmore() {
			await api.getPDF(this.params)
			.then(res => {
				this.totalPages = res.totalPages
				this.indexList = this.indexList.concat(res.records)
			}).catch(err => console.log(err))
		}
	}
};
</script>

<style>
	.pdf-add {
		position: fixed;
		left: 20px;
		bottom: 20px;
		width: 60px;
		height: 60px;
	}
	.pdf-title {
		max-width: 65%;
	}
	.pdf-btn {
		display: flex;
	}
	.empty-blank {
		width: 20px;
	}
</style>
