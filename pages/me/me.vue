<template>
	<view class="header contont">
		<view class="fixed" :style="{height:bottom +'px'}">
			<cu-custom :isBack="true" bgColor="bg-shadeTop text-white">
				<block slot="content">
					<view class="top" :style="{height:height +'px',top:top + 'px'}">
						<view class="icon-tab">
							<view class="iconfont icons" @click="scan">&#xe651;</view>
							<view class="tab">
								<view class="constant" @click="clickTab(index)" v-for="(item,index) in tabTitleL" :key="index" :class="flag === index ? 'active': ''">{{item}}</view>
							</view>
						</view>
					</view>
				</block>
			</cu-custom>
		</view>	
		<view class="user-section">
				<image class="bg" src="../../static/me/me_banner.png"></image>
		</view> 
		<view class="user" :style="{top:  -userHeight + 'px'}">
			<view class="img-name">
				<!-- <view class="editor" v-if="flag === 0" @click="jump('/pages/me/setup/setup')">
					<view class="iconfont" style="margin-left: 16rpx;">&#xe643;</view>
					<view style="margin-left: 8rpx;font-size: 24rpx;margin-top: 6rpx;">编辑</view>
				</view>
				<view class="editor" v-if="flag === 1" @click="jump('/pages/me/setup/setup')">
					<view class="iconfont" style="margin-left: 16rpx;">&#xe652;</view>
					<view style="margin-left: 8rpx;font-size: 24rpx;margin-top: 6rpx;">设置</view>
				</view> -->
				<view class="user-pic">
					<open-data type="userAvatarUrl" v-if="!user.headUrl" ></open-data>
					<image :src="user.headUrl" class="portrait" v-else></image>
				</view>
				<view class="name-shop">
					<open-data type="userNickName" class="name bold" v-if="!user.nickname"></open-data>
					<view class="name bold" v-else>{{user.nickname}}</view>
					<view class="good-shop" v-if="flag == 1" @click="goodCloudStore">
						<view>进云店</view>
						<view class="iconfont shop-icon" >&#xe653;</view>
					</view>
				</view>
			</view>
			<!-- 采购 -->
			<view v-show="flag === 0">
				<view class="sales-icket">
						  <view class="market" @click="jump('/pages/order/myOrder?orderStatus='+ 0)">
								<view class="work">我的采购单</view>
								<view class="order-box">
									<span class="order">全部</span>
									<i class="iconfont">&#xe653;</i>
								</view>
							</view>
							<!-- 待发货/待提货/售后 -->
							<view class="Overhang">
								<view @click="jump('/pages/order/myOrder?orderStatus='+1)">
									<view class="round">
										<view class="iconfont" style="text-align: center;">&#xe648;</view>
									</view>
									<view class="name shipments">待接单</view>
								</view>
								<view @click="jump('/pages/order/myOrder?orderStatus='+2)">
									<view class="round">
										<view class="iconfont" style="text-align: center;">&#xe649;</view>
									</view>
									<view class="name shipments">待付款</view>
								</view>
								<view @click="jump('/pages/order/myOrder?orderStatus='+3)">
									<view class="round">
										<view class="iconfont" style="text-align: center;">&#xe64c;</view>
									</view>
									<view class="name shipments">待发货</view>
								</view>
								<view @click="jump('/pages/order/myOrder?orderStatus='+4)">
									<view class="round">
										<view class="iconfont" style="text-align: center;">&#xe64e;</view>
									</view>
									<view class="name shipments">待收货</view>
								</view>
							</view>
					</view>
				<!-- 售后处理-我的地址-我的收藏 -->
				<view class="order-my">
					<view class="order-jf" @click="jump('../sales/sales')">
						<i class="iconfont">&#xe60b;</i>
						<p>售后处理</p>
					</view>
					<view class="order-jf" @click="jump('/pages/me/collect/collect')">
						<i class="iconfont">&#xe644;</i>
						<p>我的收藏</p>
					</view>
					<view class="order-jf"  @click="jump('./myurl/myurl')">
						<i class="iconfont">&#xe645;</i>
						<p>我的地址</p>
					</view>
				</view>
				<!-- 客服电话 -->
				<view class="service-phone" @click="open">
					<text>联系客服</text>
					<view class="service-time">
						<span class="servicing-time">服务时间9:00-22:00</span>
						<i class="iconfont">&#xe653;</i>
					</view>
				</view>
				<!-- 设置 -->
				<view class="order-phone" @click="jump('/pages/me/setup/setup')">
					<text>我的设置</text>
					<i class="iconfont">&#xe653;</i>
					<view style="clear: both;"></view>
				</view>
			<!-- 	<view class="dy-img">
					<image src="../../static/me/DYLogo.png" mode="widthFix"></image>
				</view> -->
			</view>
			<!-- 销售 -->
			<view v-show="flag === 1">
				<Market ref="mainindex"></Market>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" :animation="false" @change="upChange">
		   <view class="tel" @click="callPhone">
		   	<view class="tel-num">
		   		呼叫电话 0755 86543537
		   	</view>
				<view class="tel-time">
					服务时间 9:00-22:00
				</view>
		   </view>
			 <view class="close-tel" @click="closePop">
			 	取消
			 </view>
		</uni-popup>
		<!-- <uni-popup ref="popupScan" type="dialog" :animation="true">
			<view class="scan-box">
				<view>温馨提示</view>
				<view class="scan-txt">确定要核销该订单吗？</view>
				<view class="scan-botton" @click="confirmScan">确定</view>
			</view>
		</uni-popup> -->
		<uni-popup ref="popupScan" type="dialog" :animation="true">
				<uni-popup-dialog type="info" title="温馨提示" content="确定要核销该订单吗？" :duration="2000" :before-close="true" @close="$refs.popupScan.close()" @confirm="confirmScan"></uni-popup-dialog>
		</uni-popup>
		<!-- 提示登录弹窗 -->
		<uni-popup ref="loginPrompt" type="dialog">
				<uni-popup-dialog type="info" title="温馨提示" content="是否跳转登录授权" :duration="2000" :before-close="true" @close="$refs.loginPrompt.close()" @confirm="loginConfirm"></uni-popup-dialog>
		</uni-popup>

	</view>
</template>


<script>
	import Market from './markets/market.vue'
	import { getMemberInfo , $POST } from '@/utils/network/api.js'
	import {getStatistics} from '@/utils/network/aftermarket.js'
	export default {
		components: { Market },
		data() {
			return {
				popupScan:true,
				statisticalData: {},
				flag: 0, // 切换tab
				tabTitleL: ["采购","销售"],
				height :uni.getMenuButtonBoundingClientRect().height,
				width :uni.getMenuButtonBoundingClientRect().left - 24,
				top:uni.getMenuButtonBoundingClientRect().top,
				bottom:uni.getMenuButtonBoundingClientRect().bottom + 4,
				navHeight:uni.getMenuButtonBoundingClientRect().bottom + 4 ,
				userHeight: 0,//元素距离顶部的距离
				current: 0,
				items: ["采购", "销售"], // 选项卡数据
				user: {
					headUrl: '',
					telephone: '',
					gender: '',
					nickname:'',
					shopId: ''
				},
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				token: '',
				orderId:'', // 核销id
				code:'', // 核销code
				url:'' // 核销api
			}
		},
		onLoad() {
			const vm = this
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					let titleH = uni.createSelectorQuery().select(".user")
					titleH.boundingClientRect(data=>{
						vm.userHeight = data.top - vm.navHeight //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
					}).exec()
				}
			})
			// vm.$refs.popupScan.open()
		},
		 onPullDownRefresh() { // 监听下拉刷新
			const vm = this
			vm.getUserInfo()
			vm.$refs.mainindex.getStatisticsData()
			 setTimeout(function () {
					uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
		onShow() {
			const vm = this
			vm.token = uni.getStorageSync('authorization')
			if (vm.token) {
				vm.getUserInfo()
			}
		},
		methods:{
			// 进云店
			goodCloudStore() {
				const vm = this
				let envStatus = ''
				console.log("环境变量:",process.env.VUE_APP_ENV_CODE)
				if (process.env.VUE_APP_ENV_CODE === "dev") {
					envStatus = 'trial' // 体验版
				}
				if (process.env.VUE_APP_ENV_CODE === "test") {
					envStatus = 'trial' // 体验版
				}
				if (process.env.VUE_APP_ENV_CODE === "prod") {
					envStatus = 'release' // 正式版
				}
				wx.navigateToMiniProgram({
				  appId: 'wxfb80034f4a93d2c5',
				  path: 'pages/initial/index',  
				  extraData: {
				    shopId: vm.user.shopId,
						nickname: vm.user.nickname,
				  },
				  envVersion: envStatus,
				  success(res) {
				    // 打开成功
				  }
				});
			},
			// 扫码
			 scan() {
				const that = this
				uni.scanCode({
				    success: function (res) {
								const datas = res.result
								that.url = datas.split('?')[0]
								that.orderId = datas.split('orderId=')[1].split('&code=')[0]
								that.code = datas.split('code=')[1]
								that.$refs.popupScan.open()
				    },
						// fail: (err) => {
						// 	// 需要注意的是小程序扫码不需要申请相机权限
						// 	uni.showToast({title: "扫码失败!",icon:'none',duration: 2000})
						// }
				});
			},
			// 确定核销
			confirmScan(){
				const that = this
				that.$refs.popupScan.close()
				const params = {
					orderId:that.orderId,
					code:that.code
				}
				$POST(that.url, params).then(res => {
					// console.log('扫码核销：', res)
					if(res.code === 200){
						uni.showToast({title: "核销成功!",duration: 2000})
					}else{
						uni.showToast({title: "核销失败!",icon:'none',duration: 2000})
					}
				})
			},
			// 选项卡事件
			clickTab(index) {
				const vm = this
				vm.flag = index
			},
			// 获取个人信息
			getUserInfo() {
				const vm = this
				getMemberInfo().then(res => {
					wx.hideLoading()
					vm.user = res.data
					uni.stopPullDownRefresh()
					uni.setStorageSync('UserInfo', JSON.parse(JSON.stringify(res.data)))
					if(res.data.headUrl) {
						vm.user.headUrl = vm.imgObs + res.data.headUrl
					}
					vm.user.shopId = res.data.shopId
					vm.user.nickname = res.data.nickname
					vm.user.telephone = res.data.telephone
					vm.user.gender = res.data.gender === 1 ? '男' : '女' 
				})
				// console.log("ref调用子组件方法:",vm.$refs.mainindex)
				// vm.$refs.market.getStatisticsData()
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
			// session(){
				// uni.navigateTo({
				// 	 url: '/pages/me/message/message'
				// })
			// },
			// 跳登录
			loginConfirm() {
				uni.navigateTo({
				  url: '/pages/arthorize/index'
			})
			this.$refs.loginPrompt.close()
			},
			// 判断是否有token
			jump(path) {
				const vm = this
				if(vm.token) {
					uni.navigateTo({
					   url: path
					})
				}else {
					this.$refs.loginPrompt.open()
				}
			},
			// 登陆
			logoin() {
				uni.navigateTo({
				   url: '/pages/arthorize/index'
				})
			},
			//弹出层
			upChange(e){
				if(e.show){
					 uni.hideTabBar({
						animation: false
					})
					 }else{
					 uni.showTabBar()
					 }
			},
			open() {
				this.$refs.popup.open()
				uni.hideTabBar({
						animation: false
					})
					// uni.showModal({
					// 	  title:'0755 - 86543537',
					// 		content: '服务时间：9:00 至 18:00' ,
					// 		showCancel: false
					// })
			},
			closePop(){
				this.$refs.popup.close()
				uni.showTabBar()
			},
			
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close() {
					this.$refs.popup.close()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 * @param {Object} value
			 */
			confirm() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
		font-family: PingFangSC, PingFangSC-Regular;
	}
	/deep/ .segmented-control__item--button--last{
		background-color: #FFFFFF !important;
		color: #333333 !important;
		font-size: 30rpx !important;
		border-radius: 16rpx !important;
	}
	.fixed {
		position: fixed;
		z-index: 99;
		width: 100%;
		background-color: rgba(0,0,0,0);
	}
	.tel{
		background-color: #ffffff;
		padding: 24rpx 0rpx;
		border-bottom: 1rpx solid rgba(0,0,0,0.05);
		.tel-num{
			font-size: 34rpx;
			color: #333333;
			font-weight: 500;
			line-height: 48rpx;
			text-align: center;
		}
		.tel-time{
			font-size: 34rpx;
			color: #cccccc;
			font-weight: 500;
			line-height: 48rpx;
			text-align: center;
		}
	}
	.close-tel{
		padding: 24rpx 180rpx;
		background-color: #ffffff;
		font-size: 34rpx;
		color: #795C98;
		line-height: 48rpx;
		text-align: center;
		box-shadow: 0 45px 0 0 #fff;
	}
	// .scan-box{
	// 	background: #FFF;
	// 	border-radius: 12rpx;
	// 	text-align: center;
	// 	padding:24rpx 48rpx;
	// 	.scan-txt{
	// 		margin: 24rpx 0;
	// 	}
	// 	.scan-botton{
	// 		width: 50%;
	// 		padding: 12rpx 0;
	// 		margin: 0 auto;
	// 		color: #fff;
	// 		background: #795C98;
	// 		border-radius: 12rpx;
	// 		box-shadow: 0 0 0 2rpx rgba(51,51,51,0.5) inset;
	// 	}
	// }
.header{
	height: 100vh;
	background: #f9f9f9;
	.top{
		background-color: rgba(0,0,0,0);
		position: relative;
		.icon-tab{
			display: flex;
			height: 32px;
			line-height: 32px;
			.icons{
				padding-left: 24rpx;
				font-size: 48rpx;
			}
			// 选项卡样式
			.tab{
				font-size: 30rpx;
				font-weight: 400;
				text-align: center;
				color: #ffffff;
				line-height: 64rpx;
				display: flex;
				// justify-content: space-between;
				align-items: center;
				width:256rpx;
				height: 64rpx;
				background: rgba(51,51,51,0.16);
				border-radius: 16rpx;
				position: absolute;
				right: 0;
				top:0;
				bottom: 0;
				left: 0;
				margin: auto;
				.active{
					background: #ffffff;
					border-radius: 16rpx;
					margin: 4rpx;
					color: #333333 !important;
				}
				.constant{
					width: 124rpx;
					height: 56rpx;
					opacity: 1;
					text-align: center;
					color: #FFFFFF;
					line-height: 56rpx;
				}
			}
		}
	}
	// 图片
	.user-section{
		position: relative;
		.bg{
			display: block;
			max-width: 100%;
			width: 100%;
			height: 500rpx;
		}
	}
	// 定位主体内容
	.user{
		width: 100%;
		position: relative;
		left: 0;
		box-sizing: border-box;
		padding: 24rpx;
		border-radius: 16rpx;
		overflow-x:hidden;
		.img-name{
			display: flex;
			align-items: center;
			padding: 24rpx;
			position: relative;
			.editor{
				position: absolute;
				right: 8rpx;
				top: 8rpx;
				width: 128rpx;
				height: 48rpx;
				background: rgba(0,0,0,0.40);
				border-radius: 24rpx;
				color: #fff;
				line-height: 48rpx;
				display: flex;
				align-items: center;
			}
			.user-pic {
				width: 128rpx;
				height: 128rpx;
				box-sizing: border-box;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 32rpx;
				background: #fff;
				.portrait {
					display: block;
					max-width: 100%;
					width: 100%;
					height: 100%;
				}
			}
			.name-shop{
				.name{
					height: 48rpx;
					opacity: 1;
					font-size: 36rpx;
					font-weight: 500;
					font-family: PingFangSC, PingFangSC-Medium;
					text-align: left;
					color: rgba(0,0,0,0.85);
					line-height: 48rpx;
				}
				.good-shop{
					// width: 200px;
					margin-top: 16rpx;
					height: 42rpx;
					opacity: 1;
					font-size: 30rpx;
					font-family: PingFangSC, PingFangSC-Regular;
					font-weight: 400;
					text-align: left;
					line-height: 42rpx;
					display: flex;
					align-items: center;
					.shop-icon{
						margin-top: 7rpx;
						font-size: 32rpx;
						line-height: 32rpx;
					}
				}
			}
		}
		// 我的采销单样式
		.sales-icket{
			font-size: 30rpx;
			padding: 29rpx 32rpx 32rpx 32rpx;
			// margin: 24rpx;
			opacity: 1;
			background: #ffffff;
			border-radius: 16rpx;
			box-shadow: 0rpx 28rpx 40rpx -20rpx rgba(121,92,152,0.18); 
			.market{
				// background: #ccc;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.work{
					font-size: 30rpx;
					line-height: 42rpx;
					font-family: PingFangSC, PingFangSC-Medium;
					font-weight: 500;
					text-align: left;
					color: #333333;
				}
				.order-box{
					// background: red;
					display: flex;
					align-items: center;
					.order{
						padding-top: 2rpx;
						opacity: 1;
						font-size: 24rpx;
						// font-family: PingFangSC, PingFangSC-Regular;
						// font-weight: 400;
						text-align: right;
						color: rgba(0,0,0,0.24);
						line-height: 42rpx;
					}
					.iconfont{
						font-size: 40rpx;
						line-height: 42rpx;
						color: rgba(0,0,0,0.24);
					}
				}
			}
			// 待接单、单付款、待发货
			.Overhang{
				display: flex;
				justify-content: space-around;
				padding-top: 24rpx;
				.name{
					padding-top: 16rpx;
				}
				.round{
					width: 72rpx;
					height: 72rpx;
					line-height: 72rpx;
					background: #f9f9f9;
					border-radius: 50%;
					.iconfont{
						font-size: 40rpx;
					}
				}
				.shipments{
					font-size: 24rpx;
					font-weight: 400;
				}
			}
		}
		// 售后处理-我的地址-我的收藏
		.order-my{
			margin: 24rpx 0;
			padding: 0 24rpx;
			display: flex;
			background: #fff;
			border-radius: 16rpx;
			.order-jf{
				flex: 1;
				text-align: center;
				padding: 32rpx 0;
				.iconfont{
					font-size: 40rpx;
					font-family: PingFangSC, PingFangSC-Medium;
					font-weight: 500;
				}
				p{
					font-size: 24rpx;
					font-weight: 400;
					height: 33rpx;
					line-height: 33rpx;
					margin-top: 16rpx;
				}
			}
			.order-jf:last-child{
				margin-right: 0rpx;
			}
		}
		// 客服电话
		.service-phone{
			line-height: 42rpx;
			font-size: 30rpx;
			font-weight: 400;
			background: #fff;
			padding: 32rpx;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.service-time{
				// background: #ccc;
				display: flex;
				align-items: center;
				line-height: 42rpx;
				.servicing-time{
					padding-top: 4rpx;
					text-align: right;
					color: rgba(0,0,0,0.24);
					font-size: 24rpx;
					line-height: 42rpx;
				}
				.iconfont{
					font-size: 40rpx;
					float: right;
					color: rgba(0,0,0,0.24);
				}
			}
		}
		// 设置
		.order-phone{
			background: #fff;
			padding: 32rpx;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			text{
				font-size: 30rpx;
				font-weight: 400;
				vertical-align: middle;
			}
			.iconfont{
				font-size: 40rpx;
				float: right;
				color: rgba(0,0,0,0.24);
			}
		}
		// 水印
		.dy-img{
			text-align: center;
			image{
				width: 197rpx;
				height: 60rpx;
				margin-top: 160rpx;
			}
		}
	}
}
// 清除模态框底部高度
/deep/ .modal {
	box-shadow: 0 50px 0 0 #fff;
}
</style>
