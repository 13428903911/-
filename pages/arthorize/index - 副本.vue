<template>
	<view class="arthorize">
		<cherishTop title="授权登录" />
		<view class="top-box">
			<view class="login-img">
				<image src="../../static/home/logo.png" mode="" ></image>
			</view>
			<view class="longin-name">
				懂衣云档口
			</view>
			<view class="longin-one">
				一键采买
			</view>
			<view class="longin-one">
				海量货源
			</view>
			<view class="ellipse"></view>
		</view>
		<view class="login-button">
			<button class="button-title" open-type="getPhoneNumber" @getphonenumber="postUserPhone">
				微信登录
			</button>
			<view class="service" @click="callPhone">
				联系客服
			</view>
		</view>
		
	</view>
</template>
<script>
	import { login } from '@/utils/network/api.js'
	export default {
		data() {
			return {
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
			
		},
		methods: {
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
		overflow-x: hidden;
		.top-box{
			background: #795C98;
			padding-top: 242rpx;
			font-weight: 300;
			.login-img{
				width: 128rpx;
				height: 128rpx;
				margin: 0 auto 24rpx;
				border-radius: 16rpx;
				overflow: hidden;
				image{
					display: block;
					max-width: 100%;
					width: 100%;
					height: 100%;
				}
			}
			.longin-name{
				font-size: 50rpx;
				line-height: 70rpx;
				text-align: center;
				color: #FBFBFB;
				margin-bottom: 135rpx;
			}
			.longin-one{
				line-height: 46rpx;
				text-align: center;
				color: #FBFBFB;
				font-size: 33rpx;
				margin-bottom: 23rpx;
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
		.login-button{
			padding-top: 60rpx;
			width: 100%;
			.button-title{
				margin: 0 193rpx;
				background: #795C98;
				line-height: 74rpx;
				text-align: center;
				font-size: 33rpx;
				color: #fbfbfb;
				border-radius: 16rpx;
			}
			.service{
				position: absolute;
				bottom: var(--status-bar-height);
				left: 0;
				width: 100%;
				// padding-top: 155rpx;
				line-height: 64rpx;
				font-size: 26rpx;
				color: #65759B;
				text-align: center;
			}
		}
		
	}
</style>
