<template>
	<view class="arthorize">
		<cherishTop title="授权登录" />
		<view class="top-box">
			<view class="backrund-img" :style="{height: backgroundHeight +'px'}">
				<image class="backrund-logo" src="../../static/home/logo_2.png" mode="" ></image>
			</view>
			
			<view class="logo-text" :style="{top: bottom +'px'}">
				<view class="login-img">
					<image src="../../static/home/logo.png" mode="" ></image>
				</view>
				<view class="longin-name bold">
					懂衣云档口
				</view>
				<view class="longin-one bold">
					Cloud shop
				</view>
				<view class="register">
					<view class="uni-input">
						<span class="iconfont">&#xe65f;</span>
						<input type="number" class="input-box" v-model="fromData.username" placeholder="请输入登录账号" placeholder-class />
					</view>
					 <view class="uni-input password" style="margin-bottom: 0;">
						 <view class="icon-password">
							 <span class="iconfont">&#xe661;</span>
							 <input type="password" class="input-box" v-if="isShow" v-model="fromData.password" placeholder="请输入登录密码" placeholder-class />
							 <input type="text" class="input-box" v-else v-model="fromData.password" placeholder="请输入登录密码" placeholder-class />
						 </view>
						<span class="iconfont eye" v-if="isShow" @click="showPassword">&#xe65e;</span>
						<span class="iconfont eye" v-else  @click="hidePassword">&#xe660;</span>
					 </view>
				</view>
				<view class="btn-refifter bold" @click="passworeLoin">
					进入云档口
				</view>
				<view class="wx-register">
					<view class="wx-regis-box" open-type="getPhoneNumber" @getphonenumber="postUserPhone">
						<span class="iconfont">&#xe662;</span>
						<button class="button-title" hover-class='none' open-type="getPhoneNumber" @getphonenumber="postUserPhone">
							点击微信登录
						</button>
					</view>
				</view>
			</view>
		</view>
		<view></view>
		<view class="footer">
			<view>
				懂衣更懂你
			</view>
			<view>
				Understand you better
			</view>
		</view>
	<!-- 	<view class="login-button">
			<button class="button-title" open-type="getPhoneNumber" @getphonenumber="postUserPhone">
				微信登录
			</button>
			<view class="service" @click="callPhone">
				联系客服
			</view>
		</view> -->
		
	</view>
</template>
<script>
	import { login } from '@/utils/network/api.js'
	import { passwordLogin } from '@/utils/network/api.js'
	import  md5  from '@/components/md5/md5.js' 
	export default {
		
		data() {
			return {
				backgroundHeight: '',
				heightImg: uni.getMenuButtonBoundingClientRect().bottom,
				bottom:uni.getMenuButtonBoundingClientRect().bottom+38,
				isShow: true,
				fromData: {
					"username": '',
					"password": ''
				},
				userData:'',
				allcode: null,
				tel: "",
				arthorize: false,
				tookenall: null,
				session_key: null,
				openid: null,
				isshare: null,
				order: null,
				newyear: 0,
				q: '',
				isAgree: false,
				p_showDis: false,
				fanke:'',
				loginCode: ''
			};
		},
		onLoad() {
			const vm = this
			vm.getLoginCode()
			// vm.checkSession()
			vm.calculateHeight()
		},
		methods: {
			calculateHeight() {
				const vm = this
				uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
					success(res) { 
						vm.backgroundHeight = res.windowHeight*0.44 + vm.heightImg					
					}
				})
			},
			// 显示密码
			showPassword() {
				this.isShow = false
			},
			// 隐藏密码
			hidePassword() {
				this.isShow = true
			},
			// 密码登录
			passworeLoin() { 
				const vm = this
				vm.fromData.password = md5(vm.fromData.password)
				passwordLogin(vm.fromData).then(res => {
					vm.fromData.password = ''
					vm.fromData.username = ''
				})
			},
			checkSession() {
				uni.checkSession({
					success: (res) => {
						// console.log('success：', res)
					},
					fail: (err) => {
						// console.log('fail：', err)
					},
					complete: (res) => {
						// const { errMsg } = res
					}
				})
			},
			getLoginCode() {
				const vm = this
				uni.login({
					provider: 'weixin',
					success: function (loginRes) {
						const { code } = loginRes
						vm.loginCode = code
					},
					fail:(err) => {
						console.log(err)
					}
				})
			},
	 		//获取用户手机号新的
			async postUserPhone(res) {
				const vm = this
				const { detail } = res
				let { iv, encryptedData, errMsg } = detail
				if (errMsg === "getPhoneNumber:ok") {
					uni.showLoading({
						title: "授权中...",
						mask: true
					});
					const params = {
						iv,
						encryptedData,
						code: vm.loginCode
					}
					try {
						const { data } = await login('/member/no_auth/shop/login', params)
						if (data) {
							uni.showToast({title: "授权成功!"})
							const token = 'Bearer ' + data
							uni.setStorageSync('authorization', token)
							uni.reLaunch({ url: '/pages/home/home' })
						} else {
							uni.showToast({title: "登录失败!"})
						}
					}
					catch (err) {
						vm.getLoginCode()
						console.log('err:', err)
					}
				} else{
					uni.showToast({title: "您已拒绝授权!", icon:'none'})
				}
			},
			// 客服
			callPhone(){
					uni.makePhoneCall({
						phoneNumber: "0755 86543537",
						// 成功回调
							success: (res) => {
								// console.log('调用成功!')	
							}
					})
      },
			// 多选框事件
			agree() {
				this.isAgree = !this.isAgree
			},
			// 点击弹窗不同意
			clickDis() {
				this.isAgree = false
				this.p_showDis = false
			},
			// 点击弹窗同意
			clickAgree() {
				this.isAgree = true
				this.p_showDis = false
			},
			// 关闭弹窗
			close(){
				this.p_showDis = false
			}
		}
	}
</script>
<style lang="scss" scoped>
	.arthorize{
		background: #ffffff;
		height: 100vh;
		// overflow-x: hidden;
		.top-box{
			width: 100%;
			font-weight: 300;
			.backrund-img{
				// height: 940rpx;
				.backrund-logo{
					width: 100%;
					height: 100%;
					display: block;
				}
			}
			.logo-text{
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				.login-img{
					width: 152rpx;
					height: 152rpx;
					image{
						display: block;
						max-width: 100%;
						width: 100%;
						height: 100%;
					}
				}
				.longin-name{
					font-size: 54rpx;
					line-height: 70rpx;
					text-align: center;
					color: #FBFBFB;
					margin-top: 24rpx;
				}
				.longin-one{
					line-height: 46rpx;
					text-align: center;
					color: #FBFBFB;
					font-size: 34rpx;
					margin-bottom: 32rpx;
				}
				.register{
					width: 654rpx;
					// height: 336rpx;
					padding: 48rpx 0;
					background: #ffffff;
					border-radius: 16rpx;
					box-shadow: 0px 2rpx 20rpx 2rpx rgba(0,0,0,0.09); 
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.uni-input{
						width: 558rpx;
						height: 96rpx;
						opacity: 1;
						background: #f5f2f7;
						border-radius: 48rpx;
						margin-bottom: 48rpx;
						display: flex;
						align-items: center;
						.iconfont{
							margin: 0 24rpx 0 32rpx;
							font-size: 40rpx;
							color: rgba(0,0,0,0.85);
							font-weight: bold;
						}
						.input-box{
							height: 96rpx;
							color: rgba(0,0,0,0.85);
							font-size: 30rpx;
						}
						/deep/ .input-placeholder {
							font-size: 35rpx;
							color: rgba(0,0,0,0.24)
						}
					}
					.password{
						display: flex;
						align-items: center;
						justify-content: space-between;
						.icon-password{
							display: flex;
							align-items: center;
						}
						.eye{
							margin-right: 32rpx;
						}
					}
				}
				.btn-refifter{
					width: 558rpx;
					height: 96rpx;
					background: #795c98;
					border-radius: 48rpx;
					box-shadow: 0px 2rpx 20rpx 0px #b6a6c7; 
					font-size: 34rpx;
					color: #ffffff;
					text-shadow: 0px 2rpx 20rpx 0px #b6a6c7;
					text-align: center;
					line-height: 96rpx;
					margin: 32rpx 0 51rpx 0;
				}
				.wx-register{
					padding-bottom: 155rpx;
					.wx-regis-box{
						display: flex;
						align-items: center;
						.iconfont{
							font-size:50rpx;
							margin-right: 16rpx;
						}
						.button-title{
							background-color: #FFFFFF;
							padding:0;
							font-size: 30rpx;
							color: rgba(0,0,0,0.85);
							font-size: 30rpx;
						}
						button::after {
							border: none;
						}
					}
				}
			}
	
	
			.ellipse{
				margin-top: 135rpx;
				width: 100%;
	      height: 100rpx;
				background: #ffffff;
				border-radius: 50% / 100% 100% 0 0;
				transform: scaleX(1.1);
			}
		}
		
		.footer{
			position: fixed;
			left: 0;
			bottom:0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			color: rgba(51,51,51,0.26);
			padding-bottom: constant(safe-area-inset-bottom);  // 核心代码
			padding-bottom: env(safe-area-inset-bottom); // 核心代码
			padding-bottom: 56rpx;
			background-color: #FFFFFF;
		}
		
		
		
		// .login-button{
		// 	padding-top: 60rpx;
		// 	width: 100%;
		// 	.button-title{
		// 		margin: 0 193rpx;
		// 		background: #795C98;
		// 		line-height: 74rpx;
		// 		text-align: center;
		// 		font-size: 33rpx;
		// 		color: #fbfbfb;
		// 		border-radius: 16rpx;
		// 	}
		// 	.service{
		// 		position: absolute;
		// 		bottom: var(--status-bar-height);
		// 		left: 0;
		// 		width: 100%;
		// 		// padding-top: 155rpx;
		// 		line-height: 64rpx;
		// 		font-size: 26rpx;
		// 		color: #65759B;
		// 		text-align: center;
		// 	}
		// }
		
	}
</style>
