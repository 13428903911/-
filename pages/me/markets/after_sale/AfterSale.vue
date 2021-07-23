<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar>
		    <view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">售后处理</text>
				</view>
			</view>
		</uni-nav-bar>
				<!-- tabs选项卡 -->
			<view class="tabs">
				<ms-tabs class="tabs-mzy" :list="list" v-model="active" itemColor='#795C98' lineColor='#795C98'
					@input="handleChange" />
			</view>
				<!-- 全部 -->
				<scroll-view scroll-y="true" refresher-enabled="true" style="padding-top: 84rpx;" class="sv" :refresher-triggered="triggered" :refresher-threshold="100"
					@scroll="scroll" @refresherrefresh="onRefresh" @refresherabort="onAbort" @scrolltolower="scrolltolower" :style="{height:navHeight+'px'}">
				<view v-if="orderData.length" class="sales-main">
					<view class="header-title" v-for="(item,index) in orderData" :key="item.afterSaleId" @click.stop="orderDetails(item.afterSaleId)">
						<view class="header-text">
							<view class="pick-order">
								<view><text>售后单号:</text><text class="order">{{item.afterSaleId}}</text></view>
							</view>
							<view class="pick-status">{{item.afterSaleStatus.userMsg}}</view>
						</view>
						<view class="header-center" v-for="(i,index) in item.goodsList" :key="index">
							<view class="list-img">
								<image :src="imgObs+i.goodsPhoto" mode=""></image>
							</view>
							<view class="header-nr">
								<p class="header-tit">{{i.goodsName}}</p>
								<view>
									<view class="Specification">
										<text>{{i.goodsSpecs}}</text>
									<!-- 	<text style="margin-left: 10rpx;">L码</text> -->
									</view>
									<view class="price-amount">
										<text class="price">￥{{i.goodsPrice}}/件</text>
										<text class="amount">x{{i.goodsNum}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="close">
							<view class="close-goods">
								<view><text>退货类型:</text><text class="refund">{{item.afterSaleType.description}}</text></view>
								<view class="return-reason"><text>退货原因:</text><text class="refund">{{item.refundReason}}</text></view>
								<view><text>退款金额:</text><text class="refund">￥{{item.totalMoney}}</text></view>
							</view>
							<view class="btn-group" v-if="item.afterSaleStatus.name == 'WAIT_HANDLE' || item.afterSaleStatus.name == 'RETURNED'">
								<view v-if="item.afterSaleStatus.name !== 'WAIT_HANDLE'" >
									<button type="button" class="btn-normal" style="float: left;margin: 0;" @click.stop="queryLogistics(item.waybillNumber,item.shopAdrTelephone)">查看物流</button>
									<button type="button" class="btn-primary" @click.stop="agreeRefund(item.afterSaleId)">同意退款</button>
								<!-- 	<button type="button" class="btn-normal" @click.stop="refuseReimburse(item.afterSaleId)">拒绝退款</button> -->
								</view>
								<view v-else>
									<view v-if="item.afterSaleType.name == 'REFUND'">
										<button type="button" class="btn-primary" @click.stop="agreeRefund(item.afterSaleId)">同意退款</button>
											<button type="button" class="btn-normal" @click.stop="refuseReimburse(item.afterSaleId)">拒绝退款</button>
									</view>
									<view v-else>
										<button type="button" class="btn-primary" @click.stop="handleAgree(item.afterSaleId)">同意退货</button>
										<button type="button" class="btn-normal" @click.stop="refuseSalesReturn(item.afterSaleId)">拒绝退货</button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<uni-load-more v-if="orderData.length>10" :status="loadingType" iconType="auto"></uni-load-more>
				</view>		
				<!-- 暂无数据 -->
				<nodata :noText="noText" v-else/>
				
			 </scroll-view>
				<!-- 同意与拒绝退货弹窗 -->
				<uni-popup ref="popup" type="center" :animation="false" @change="popupChange">
					<view class="popup-contont">
						<view class="popup-title-content">
							<view class="title">{{ popupForm.popupTitle }}</view>
							<input v-if="popupForm.popupTitle === '拒绝退货' || popupForm.popupTitle === '拒绝退款'" v-model="afterSaleForm.rejectReason" class="uni-input" focus placeholder="填写拒绝原因" placeholder-class/>
							<view  v-else-if="popupForm.affirm === '同意退货'" class="content">同意退货后，允许买家将货物寄回，收到退回货物后，可允许退款</view>
							<view  v-else class="content">点击"同意退款后"，款项将原路返回付款帐号，请谨慎操作，此操作不可逆！</view>
						</view>
						<view class="btn-cancel-affirm">
							<view @click="$refs.popup.close()">取消</view>
							<view class="Agree-return" @click="affirmsalesReturn">{{ popupForm.affirm }}</view>
						</view>
					</view>
				</uni-popup>
			</view>
		

</template>

<script>
	import { sellAfterSaleStatu } from '@/utils/status.js'
	import {	getSelectAllByShop,salesReturn,salesReject,consentReimburse } from '@/utils/network/aftermarket.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {
				scrollTop:0, // 滚动条位置
				triggered: false,
				pH:0, //窗口高度
				navHeight:0, //元素的所需高度
				afterSaleForm: {
					afterSaleId: '', // 售后单Id
					rejectReason: '' // 拒绝原因
				},
				addressId: '', // 地址id
				noText: '暂无数据~',
				popupForm: {
					popupTitle: '',
					affirm:''
				},
				loadingType: 'loading', // 加载更多状态
				//分页
				current: 1,
				fromData: {
					pageNum: 1,
					pageSize: 10,
					afterSaleStatus: ''
				},
				orderStatus: '',
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				list: [],
				active: 0,
				orderData: [],
			}
		},
		mounted() {
			const vm = this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					vm.pH = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
					let titleH = uni.createSelectorQuery().select(".sv")
					titleH.boundingClientRect(data=>{
						vm.navHeight = vm.pH - data.top - 42//计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
					}).exec()
				}
			})
		},
		onShow() {
			const vm = this
			vm.list = sellAfterSaleStatu.filter(t => !t.hidden)
		},
		onLoad(options) {
			const vm = this 
			this.sendInfo()
			this.active = options.index // 我的页面跳转过来传递的参数
			if (options.addressId) {
				vm.addressId = options.addressId
				vm.active = 1
				vm.fromData.afterSaleStatus = 'WAIT_HANDLE'
				vm.sendInfo()
				this.$refs.popup.open()
				vm.popupForm.popupTitle = '确认同意退货？'
				vm.popupForm.affirm = '同意退货'
			}
		},
		methods:{
			// 滚动触发
			scroll(e) {
				this.scrollTop = e.detail.scrollTop
			},
			// 模态框change事件
			popupChange(e) {
				const vm = this
				if (!e.show) {
					vm.afterSaleForm.rejectReason = ''
					uni.removeStorageSync('AfterSaleId')
				}
			},
			// 滚动到底部
			scrolltolower() {
				const vm = this
				vm.fromData.pageNum++
				getSelectAllByShop(vm.fromData).then(res => {
					vm.orderData = [...vm.orderData, ...res.data.records]
				})
				if(vm.fromData.pageNum > vm.current) {
					vm.loadingType='nomore'
					return
				}
			},
			onAbort() {
				 setTimeout(() => {
						this.triggered = false;
				}, 500)
			},
			// 下拉刷新
			onRefresh() {
				const vm = this
				vm.triggered = true	
				vm.fromData.pageNum = 1
				vm.sendInfo() 		
			 },
			// 确认弹窗
			affirmsalesReturn() {
				const vm = this
				if(vm.popupForm.affirm === '同意退货') {
					salesReturn({
						afterSaleId:uni.getStorageSync('AfterSaleId'),
						addressId: vm.addressId
					}).then(res => {
						uni.showToast({title: "已同意退货!", icon:'none'})
						vm.$refs.popup.close()
					})
				}
				if (vm.popupForm.affirm === '确定') {
					salesReject(vm.afterSaleForm).then(res => {
						uni.showToast({title: "已拒绝退货!", icon:'none'})
						vm.$refs.popup.close()
					})
				}
				if (vm.popupForm.affirm === '同意退款') {
					consentReimburse({afterSaleId: vm.afterSaleForm.afterSaleId}).then(res => {
						uni.showToast({title: "已同意退款!", icon:'none'})
						vm.$refs.popup.close()
					})
				}
				if (vm.popupForm.popupTitle === '拒绝退款') {
					salesReject(vm.afterSaleForm).then(res => {
						uni.showToast({title: "已拒绝退款!", icon:'none'})
						vm.$refs.popup.close()
					})
				}
				vm.fromData.pageNum = 1
				vm.sendInfo()
			},
			// 拒绝退款
			refuseReimburse(id) {
				const vm = this
				vm.afterSaleForm.afterSaleId = id
				vm.popupForm.popupTitle = '拒绝退款'
				vm.popupForm.affirm = '确定'
				vm.$refs.popup.open()
			},
			// 同意退款
			agreeRefund(id) {
				const vm = this
				vm.afterSaleForm.afterSaleId = id
				vm.popupForm.popupTitle = '确认同意退款?'
				vm.popupForm.affirm = '同意退款'
				this.$refs.popup.open()
			},
			// 查看物流
			queryLogistics(id,phoneNumber) {
				uni.navigateTo({
				  url: './logistics?waybillNumber='+id+'&phoneNumber='+phoneNumber
				})
			},
			// 拒绝退货
			refuseSalesReturn(id) {
				const vm = this
				vm.afterSaleForm.afterSaleId = id
				vm.popupForm.popupTitle = '拒绝退货'
				vm.popupForm.affirm = '确定'
				this.$refs.popup.open()
			},
			// 同意退货
			handleAgree(id){
				const vm = this
				uni.setStorageSync('AfterSaleId', id)
				uni.navigateTo({
				  url: '/pages/me/myurl/myurl?afterSaleId='+ id
				})
			},
			//Tab选项卡
			handleChange(index, tab) {
				const vm = this
				vm.scrollTop = 0
				vm.fromData.pageNum = 1
				vm.fromData.afterSaleStatus = tab.value
				vm.sendInfo()
			},
			// 全部销售订单列表数据
			sendInfo() {
				const vm = this
				wx.showLoading({
				   title: '加载中'
				})
				if (!vm.fromData.afterSaleStatus) {
					delete vm.fromData.afterSaleStatus
				}
				getSelectAllByShop(vm.fromData).then(res => {
					wx.hideLoading()
					this.orderData = res.data.records
					this.current = res.data.pages
					this.onAbort()
					if(this.orderData.length < 10) {
						vm.loadingType='nomore'
					}
				}).catch(() => {
					wx.hideLoading()
					this.onAbort()
				})
			},
			//跳转售后详情页
			orderDetails(id) {
				uni.navigateTo({
					url: './afterSaleDetail?id='+ id
				})
			},
			// 返回上一页
			clickBack() {
				uni.switchTab({
					url:'../../me'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	// 修改tab样式
	/deep/ .uni-navbar--border{
		border: none !important;
	}
	.contont{
		font-weight: 400;
		height: 100vh;
		background-color: #f9f9f9;
		.search{
			background-color: #ffffff;
			display: flex;
			width: 696rpx;
			position: relative;
			left: 0rpx;
			bottom: 0rpx;
			.iconfont{
				font-size: 48rpx;
			}
			text{
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: rgba(0,0,0,0.85);
				line-height: 48rpx;
				margin: auto;
			}
		}
		.tabs {
			width: 100%;
			position: fixed;
			z-index: 999;
			font-size: 30rpx;
			color: #333333;
			background: #FFFFFF;
			box-shadow: 0 5px 10px -8px #ccc inset;
		}
	  /deep/ .tab {
			
			height: 84rpx !important;
		}
	  /deep/ .tab__item {
			line-height: 84rpx !important;
		}
		/deep/ .mm__tab:nth-child(5) {
			margin: 0rpx 24rpx 0rpx 24rpx !important;
		}
		.sales-main{
			// margin-top:104rpx;
			.header-title {
				margin: 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				padding: 24rpx;
				line-height: 1;
				text-align: justify;
				text-align-last: left;
				.header-text {
					font-size: 26rpx;
					padding-bottom: 24rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.pick-order{
						display: flex;
						align-items: center;
						.order{
							padding-left: 8rpx;
						}
					}
					.pick-status{
						color: #795C98;
					}
				}
				.header-center {
					padding: 24rpx 0;
					border-top: 2rpx solid #EEEEEE;
					border-bottom: 2rpx solid #eeeeee;
					display: flex;
					.list-img{
						width: 166rpx;
						height: 166rpx;
						overflow: hidden;
						border-radius: 8rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
					.header-nr {
						margin-left: 24rpx;
						width: 480rpx;
				
						.header-tit {
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
							font-size: 26rpx;
							font-weight: 400;
							height: 72rpx;
							line-height: 36rpx;
						}
						.Specification{
							height: 36rpx;
							opacity: 1;
							font-size: 26rpx;
							font-weight: 400;
							text-align: left;
							color: rgba(51,51,51,0.50);
							line-height: 36rpx;
							margin: 8rpx 0;
						}
						.price-amount{
							height: 42rpx;
							opacity: 1;
							font-size: 30rpx;
							font-weight: 400;
							text-align: left;
							color: #333333;
							line-height: 42rpx;
							display: flex;
							justify-content: space-between;
						}
				
					}
				}
			}
		}
		// 合计多少件-取件码样式
		.close{
			.close-goods{
				padding: 24rpx 0;
				opacity: 1;
				font-size: 26rpx;
				font-weight: 400;
				text-align: left;
				color: rgba(51,51,51,0.50);
				.return-reason{
					margin: 24rpx 0;
				}
				.refund{
					margin-left: 56rpx;
					opacity: 1;
					font-size: 26rpx;
					font-weight: 400;
					text-align: left;
					color: #333333;
				}
			}
			.get-code{
				text-align: right;
				height: 50rpx;
				opacity: 1;
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
				line-height: 50rpx;
			}
			.btn-group {
				overflow: hidden;
				button {
					float: right;
					padding: 11rpx 24rpx;
					border-radius: 60rpx;
					font-size: 30rpx;
					color: #fff;
					line-height: 42rpx;
					margin-left: 16rpx;
				}
				.btn-normal {
					// padding: 8rpx 22rpx;
					color: #333333;
					background-color: #fff;
					box-shadow: 0 0 0 2rpx rgba(51,51,51,0.5) inset;
				}
				.btn-primary {
					background-color: #795c98;
				}
			}
		}
		.myOrderImg {
			padding-top: 164rpx;
			width: 630rpx;
			height: 540rpx;
			margin: auto;
			text-align: center;
		
			text {
				color: rgba(51, 51, 51, 0.50);
				font-size: 30rpx;
				display: inline-block;
			}
		}
	}
	// 弹窗样式
	.popup-contont{
		width: 540rpx;
		background: #ffffff;
		border-radius: 16rpx;
		.popup-title-content{
			padding: 48rpx;
			// text-align: center;
			.uni-input{
				height: 52rpx;
				margin-top: 24rpx;
				background: #f9f9f9;
				border-radius: 8rpx;
				padding-left: 16rpx;
				/deep/ .input-placeholder{
					line-height: 52rpx;
					text-align: left;
					color: rgba(51,51,51,0.50);
					font-size: 26rpx;
					font-weight: 400;
				}
			}
			.title{
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: #333333;
				line-height: 48rpx;
			}
			.content{
				margin-top:8rpx;
				opacity: 1;
				font-size: 26rpx;
				font-weight: 400;
				text-align: center;
				color: #333333;
				line-height: 37rpx;
				text-align: justify;
				text-align-last: center;
			}
		}
		.btn-cancel-affirm{
			height: 86rpx;
			border-top: 2rpx solid #eeee;
			display: flex;
			align-items: center;
			view{
				width: 50%;
				text-align: center;
				font-size: 34rpx;
				color: #333333;
			}
			.Agree-return{
				height: 84rpx;
				border-left: 2rpx solid #eeee;
				line-height: 84rpx;
				font-weight: 500;
				color: #795c98;
			}
		}
	}
</style>

