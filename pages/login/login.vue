<template>
	<view class="page">
		<view class="login-type-2">
			<!--顶部返回按钮-->
			<!-- <text class="back-btn iconfont iconzuo" @tap="navBack"></text> -->
			<view class="login-top bg-rf">
<!-- 				<view class="desc">
					<view class="title">Hi~</view>
					<text>{{ appName }}欢迎您</text>
				</view> -->
				<image class="login-pic" :src="loginPic"></image>
			</view>
			<view class="login-type-content">
				<!-- <image class="login-bg" :src="loginBg" :style="{height: tabCurrentIndex === 1 ? '150vw' : '94vw'}"></image> -->
				<view class="main">
					<block v-if="tabCurrentIndex === 0">
						<view class="login-type-form">
							<view class="input-item">
								<text class="iconfont iconzhanghuffffffpx text-rf"></text>
								<input
									class="login-type-input"
									v-model="loginParams.username"
									placeholder="请输入账号"
								/>
							</view>
							<view class="input-item">
								<text class="iconfont iconmimaffffffpx text-rf"></text>
								<input
									class="login-type-input"
									type="password"
									v-model="loginParams.password"
									placeholder="请输入密码"
									maxlength="20"
								/>
							</view>
						</view>
<!-- 						<view class="login-type-tips">
							<view @tap="showLoginBySmsCode" class="forget-section">
								密码登录
							</view>
							<text @tap="navTo('/pages/public/password')">忘记密码？</text>
						</view> -->
						<button
							class="confirm-btn bg-rf"
							:disabled="btnLoading"
							:loading="btnLoading"
							@tap="toLogin"
						>
							登 录
						</button>
					</block>
				</view>
			</view>
<!-- 			<view class="login-type-bottom text-rf">
				{{ appName }} 版权所有
			</view> -->
		</view>
	</view>
</template>

<script>
import api from '@/config/api.js';
import { mapMutations } from "vuex"
export default {
	data() {
		return {
			appName: "111",
			loginPic: "/static/hy.jpg",
			loginBg: "",
			tabCurrentIndex: 0,
			typeList: [
				{
					text: '登录'
				},
				{
					text: '注册'
				}
			],
			btnLoading: false,
			loginParams: {
				username: '',
				password: ''
			},
		};
	},
	methods: {
		...mapMutations(["login"]),
		// 返回上一页
		navBack() {
			// this.$mRouter.back();
		},
		toLogin() {
			this.btnLoading = true
			api.login(this.loginParams).then(res => {
				this.login(res.token)
				this.btnLoading = false
				uni.reLaunch({ url: "/pages/meeting/meeting" })
			}).catch(() => this.btnLoading = false)
		}
	}
}
</script>

<style lang="scss">
@import './theme.scss';
@import './uni.scss';
.page {
	// background: #fff;
	// background-image: linear-gradient(to top, #e0c3fc 0%, #8ec5fc 99%, #8ec5fc 100%);
}
.container {
	padding-top: 115px;
	position: relative;
	width: 100vw;
	overflow: hidden;
	background: #fff;
	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: #303133;
	}
	.left-top-sign {
		font-size: 120upx;
		color: #f8f8f8;
		position: relative;
		left: -16upx;
	}
	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: '';
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
	}
	.input-content {
		padding: 0 60upx;
	}
	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: #f8f6fc;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: 26upx;
			color: #606266;
		}

		input {
			height: 60upx;
			font-size: 30upx;
			color: #303133;
			width: 100%;
		}
	}
	.input-item-sms-code {
		position: relative;
		width: 100%;
		.sms-code-btn {
			position: absolute;
			color: #111;
			right: 20upx;
			bottom: 20upx;
			font-size: 28upx;
		}

		.sms-code-resend {
			color: #999;
		}

		.sms-code-btn:after {
			border: none;
			background-color: transparent;
		}
	}
	.forget-section {
		font-size: 26upx;
		color: #4399fc;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section {
		margin: 30upx 0 50upx 0;
		width: 100%;
		font-size: 26upx;
		color: #606266;
		text-align: center;

		text {
			color: #4399fc;
			margin-left: 10upx;
		}

		text:first-child {
			margin-right: 10upx;
		}
	}
	.btn-group {
		display: flex;
		margin-bottom: 20upx;
	}
}
.login-type-2 {
	width: 100%;
	position: relative;
	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 48upx;
		color: #fff;
	}
	.login-top {
		height: 460upx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		.login-pic {
			width: 220upx;
			height: 220upx;
		}
		// .desc {
		// 	position: absolute;
		// 	top: 200upx;
		// 	left: 40upx;
		// 	font-size: 48upx;
		// 	.title {
		// 		font-size: 48upx;
		// 	}
		// }
		// .login-pic {
		// 	position: absolute;
		// 	width: 220upx;
		// 	height: 270upx;
		// 	right: 30upx;
		// 	top: 100upx;
		// }
	}
	.login-type-content {
		position: relative;
		top: -72upx;
		.login-bg {
			width: 94vw;
			height: 94vw;
			margin: 0 3vw;
		}
		.main {
			width: 94vw;
			position: absolute;
			top: 0;
			left: 3vw;
			.nav-bar {
				display: flex;
				height: 100upx;
				justify-content: center;
				align-items: center;
				position: relative;
				z-index: 10;
				.nav-bar-item {
					flex: 1;
					display: flex;
					height: 100%;
					line-height: 96upx;
					font-size: 32upx;
					display: flex;
					margin: 0 120upx;
					justify-content: center;
				}
				.nav-bar-item-active {
					border-bottom: 5upx solid;
				}
			}
			.login-type-form {
				width: 80%;
				margin: 50upx auto;
				.input-item {
					position: relative;
					height: 90upx;
					line-height: 90upx;
					margin-bottom: 30upx;
					.iconfont {
						font-size: 50upx;
						position: absolute;
						left: 0;
					}
					.login-type-input {
						height: 90upx;
						padding-left: 40upx;
						border-bottom: 1upx solid rgba(0, 0, 0, .2);
					}
					.sms-code-btn, sms-code-resend {
						width: 240upx;
						font-size: 26upx;
					}
				}
			}
			.login-type-tips {
				padding: 0 50upx;
				display: flex;
				justify-content: space-between;
			}
			.confirm-btn {
				color: #666;
				// background-color: #2979ff;
				background-image: linear-gradient(to top, #ebedee 0%, #fdfbfb 99%, #fdfbfb 100%);
				// background-color: #fff;
				border: 1px solid #eee;
				height: 80upx;
				line-height: 80upx;
			}
		}
	}
	.login-type-bottom {
		width: 100%;
		padding-bottom: 30upx;
		text-align: center;
		font-size: 32upx;
	}
}
</style>
