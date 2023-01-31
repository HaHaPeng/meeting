<template>
	<u-transition :show="animationShow" mode="fade-right">
		<u-overlay :show="loading" :duration="400" :z-index ="999">
			<view class="loading">
				<u-loading-icon vertical textColor="#3c9cff" text="提交中..." color="#3c9cff"></u-loading-icon>
			</view>
		</u-overlay>
		<view class="add-meeting">
			<u--form labelPosition="left" labelWidth="80" :model="model" :rules="rules" ref="form">
				<u-form-item
					label="开始时间"
					prop="endTime"
					borderBottom
					@click="startTimeShow = true"
				>
					<u--input :value="$u.timeFormat(model.startTime, 'yyyy-mm-dd hh:MM:ss')" disabled disabledColor="#ffffff" placeholder="请选择开始时间" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item
					label="结束时间"
					prop="endTime"
					borderBottom
					@click="endTimeShow = true"
				>
					<u--input :value="$u.timeFormat(model.endTime, 'yyyy-mm-dd hh:MM:ss')" disabled disabledColor="#ffffff" placeholder="请选择结束时间" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item
					@click="openSelect('statusShow')"
					label="状态"
					prop="meetingStatus"
					borderBottom
				>
					<u--input v-model="model.meetingStatus" disabled disabledColor="#ffffff" placeholder="请选择状态" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="名称" prop="meetingName" borderBottom><u--input v-model="model.meetingName" border="none" placeholder="请输入名称"></u--input></u-form-item>
				<u-form-item label="主讲人" prop="meetingSpeaker" borderBottom>
					<u--input v-model="model.meetingSpeaker" border="none" placeholder="请输入主讲人"></u--input>
				</u-form-item>
				<u-form-item label="所属部门" prop="dept" borderBottom><u--input v-model="model.dept" border="none" placeholder="请输入所属部门"></u--input></u-form-item>
				
				<u-form-item label="会议封面" prop="meetingCover" borderBottom>
					<u-upload :fileList="meetingCover" @afterRead="afterRead" @delete="deletePic" name="meetingCover" multiple :maxCount="1" :previewFullImage="true"></u-upload>
				</u-form-item>
				<u-form-item label="详情图" prop="detailImg" borderBottom>
					<u-upload :fileList="detailImg" @afterRead="afterRead" @delete="deletePic" name="detailImg" multiple :maxCount="1" :previewFullImage="true"></u-upload>
				</u-form-item>
				
				<u-form-item label="描述" prop="meetingDesc" borderBottom><u--textarea :maxlength="-1"  v-model="model.meetingDesc" placeholder="请输入描述"></u--textarea></u-form-item>
			</u--form>
			
			<u-datetime-picker
				ref="datetimePicker"
				:show="startTimeShow"
				v-model="model.startTime"
				mode="datetime"
				@cancel="startTimeShow = false"
				@confirm="startTimeShow = false"
			></u-datetime-picker>
			<u-datetime-picker
				ref="datetimePicker"
				:show="endTimeShow"
				v-model="model.endTime"
				mode="datetime"
				@cancel="endTimeShow = false"
				@confirm="endTimeShow = false"
			></u-datetime-picker>

			<view class="footer-btn">
				<u-button type="primary" @click="submit">提交</u-button>
				<view style="height: 20px;"></view>
				<u-button type="error" v-if="isEdit" @click="cancelShow = true">删除</u-button>
			</view>

			<!-- 删除确认 -->
			<u-modal @cancel="cancelShow = false" @confirm="cancel" :show="cancelShow" title="提示" content='确认删除？'></u-modal>
			<!-- 状态 -->
			<u-action-sheet :show="statusShow" :actions="statusOptions" title="请选择状态" @close="statusShow = false" @select="statusSelect"></u-action-sheet>
		</view>
	</u-transition>
</template>

<script>
import api from "@/config/api.js"
export default {
	data() {
		return {
			loading: false,
			endTimeShow: false,
			startTimeShow: false,
			defaultModel: {
				startTime: new Date().getTime(), // 会议开始时间
				endTime: new Date().getTime(), // 会议结束时间
				meetingName: '', // 会议名称
				meetingDesc: '', // 会议描述
				meetingSpeaker: '', // 会议主讲人
				meetingStatus: null, // 会议状态，1-未开始，2-进行中，3-已结束
				meetingCover: '', // 会议封面
				dept: '', // 所属部门
				detailImg: '' // 会议详情图
			},
			model: {},
			rules: {
				meetingName: {
					type: 'string',
					required: true,
					message: '请填会议名称',
					// trigger: ['blur', 'change']
					trigger: ['blur']
				}
			},
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
			],
			statusShow: false,
			cancelShow: false,
			meetingCover: [],
			detailImg: [],
			isEdit: false,
			animationShow: false
		};
	},
	onLoad(options) {
		this.animationShow = true
		if(options.row) {
			const model = JSON.parse(options.row)
			// model.meetingStatus = this.statusOptions.find(item => item.value == model.meetingStatus).name
			if(model.meetingCover) {
				this.meetingCover.push({
					url: model.meetingCover
				})
			}
			if(model.detailImg) {
				this.detailImg.push({
					url: model.detailImg
				})
			}
			this.model = model
			this.isEdit = true
		} else {
			this.isEdit = false
			this.init()
		}
	},
	onTabItemTap() {
		this.init()
	},
	methods: {
		init() {
			this.model = JSON.parse(JSON.stringify(this.defaultModel))
			this.meetingCover = []
			this.detailImg = []
		},
		goToMeeting() {
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/meeting/meeting'
				});
				this.init()
			}, 1000)
		},
		cancel() {
			this.loading = true
			api.deleteMeeting({ id: this.model.id }).then(() => {
				uni.$u.toast('删除成功');
				this.cancelShow = false
				this.goToMeeting()
				this.loading = false
			}).catch(() => this.loading = false)
		},
		openSelect(name) {
			this[name] = true
			uni.hideKeyboard()
		},
		deletePic(event) {
			this[event.name].splice(event.index, 1);
		},
		async afterRead(event) {
			// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
			let lists = [].concat(event.file);
			let fileListLen = this[event.name].length;
			lists.map(item => {
				this[event.name].push({
					...item,
					status: 'uploading',
					message: '上传中'
				});
			});
			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i].url);
				console.log(result)
				if(result) {
					this.model[event.name] = result.url
					let item = this[event.name][fileListLen];
					this[event.name].splice(
						fileListLen,
						1,
						Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url
						})
					);
				} else {
					let item = this[event.name][fileListLen];
					this[event.name].splice(
						fileListLen,
						1
					);
				}
				fileListLen++;
			}
		},
		uploadFilePromise(url) {
			return new Promise((resolve, reject) => {
				let a = uni.uploadFile({
					url: '/hospital/file/upload', // 仅为示例，非真实的接口地址
					filePath: url,
					name: 'file',
					formData: {
						user: 'test'
					},
					success: res => {
						if(res.statusCode == 200) {
							const result = JSON.parse(res.data).data
							resolve(result)
						} else {
							uni.$u.toast('上传失败');
							resolve(false)
						}
					},
					fail: res => {
						uni.$u.toast('上传失败');
						resolve(false)
					}
				});
			});
		},
		submit() {
			this.loading = true
			const data = JSON.parse(JSON.stringify(this.model))
			data.meetingStatus = this.statusOptions.find(item => item.name == data.meetingStatus).value
			this.$refs.form
				.validate()
				.then(res => {
					if(this.isEdit) {
						api.updateMeeting(data).then(() => {
							uni.$u.toast('更新成功');
							this.goToMeeting()
							this.loading = false
						}).catch(() => this.loading = false)
					} else {
						api.addMeeting(data).then(() => {
							uni.$u.toast('添加成功');
							this.goToMeeting()
							this.loading = false
						}).catch(() => this.loading = false)
					}
				})
				.catch(errors => {
					uni.$u.toast('请填写内容');
				});
		},
		statusSelect(e) {
			this.model.meetingStatus = e.name;
			this.$refs.form.validateField('meetingStatus');
		}
	}
};
</script>

<style lang="scss" scoped>
.add-meeting {
	padding: 0 6px;
}
.footer-btn {
	padding: 0 20px;
	margin-top: 20px;
}
</style>
