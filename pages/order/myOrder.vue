<template>
	<view class="header">
		<uni-nav-bar left-icon="back"  title="我的订单" fixed statusBar color="rgba(0,0,0,0.85)" @clickLeft="goBack"></uni-nav-bar>
		<uni-popup ref="popupConfirm" type="dialog">
				<uni-popup-dialog type="success" title="提示" :content="content" :duration="2000" :before-close="true" @close="$refs.popupConfirm.close()" @confirm="confirmCon"></uni-popup-dialog>
		</uni-popup>
		<view class="header-top">
			<!-- tabs选项卡 -->
			<view class="tabs">
				<ms-tabs class="tabs-mzy" :list="list" v-model="active" itemColor='#795C98' lineColor='#795C98' @input="handleChange" />
			</view>
			<!-- 空白 -->
			<view class="none" v-if="!orderData.length">
				<view class="none-img">
					<image src="@/static/icon-none.png" mode=""></image>
				</view>
				<view class="none-text">
					暂无订单~
				</view>
			</view>
			<!-- 全部 -->
			<scroll-view v-else class="scroll-view" 
			scroll-y 
			:refresher-threshold="20" 
			refresher-enabled="true" 
			:scroll-top="scrollTop"
			@scroll="scrollChange"
			:refresher-triggered="triggered"
			@scrolltolower='scrolltolower'
			@refresherrefresh="onRefresh"
			@refresherrestore="onRestore">
				<view  class="main">
					<view class="header-title" v-for="(item,index) in orderData" :key="index">
						<view class="header-text" :data-id='item.orderId' @click.stop="orderDetails">
							<text class="dk bold">{{item.supplierName || ''}}</text>
							<text class="sh bold">{{item.orderStatusValue || ''}}</text>
							<view style="clear: both;"></view>
						</view>
						<view class="header-center" v-for="(i,indexs) in item.goodsInfoList" :key="indexs" :data-id='item.orderId' @click.stop="orderDetails">
							<image :src="imgObs+i.goodsPhoto" mode="aspectFill"></image>
							<view class="header-nr">
								<p class="header-tit">{{i.goodsName || ''}}</p>
								<view style="padding-bottom: 14rpx" >
									<view class="header-jg" v-for="(is,indext) in i.goodsDetailList" :key="indext">
										<view class="">
											<view class="djs" style="margin-right: 16rpx;">{{is.goodsSpecs || ''}}</view>
										</view>
										<view class="" style="position: relative;display: flex;">
											<view class="jq">￥{{is.goodsPrice || 0}}</view>
											<view class="sl" style="position: absolute;right: 0;">x{{is.goodsNum || 1}}</view>
										</view>
									</view>
								</view>
								<view class="header-jg header-jg-right">
									<text class="dj">小计：</text>
									<text class="jq">￥{{i.goodsMoney}}</text>
								</view>
							</view>
						</view>
						<view class="jes" :data-id='item.orderId' @click="orderDetails">
							<view class="jes-yf">
								<!--<view class="ch" v-if="orderData.orderStatus == 'WAIT_VERIFY'">
										撤回
									</view> -->
								<view class="header-jg">
									<text class="dj">服务费：</text>
									<text class="jq">￥{{item.serviceMoney || '0'}}</text>
								</view>
								<view class="header-jg" style="padding-left: 24rpx;">
									<text class="dj">运费：</text>
									<text class="jq">￥{{item.expressCharge || '0'}}</text>
								</view>
							</view>
							<view class="header-ch">
								<view class="header-yfje bold">
									<text class="yfje">总计金额：</text>
									<text class="money">￥{{item.payable || '0'}}</text>
								</view>
							</view>
						</view>
						<view class="status-button">
							<view class="tel" :class="{'yc':item.orderStatus === 'WAIT_SHIP'}" @click.stop="telPhone(item.relationPhone)">
								<view class="iconfont icon-tel">
									&#xe639;
								</view>
								<view class="tel-txt">
									联系供应商
								</view>
							</view>
							<view class="button-list">
								<button type="default"  class="btn-normal" v-if="item.orderStatus === 'WAIT_SHIP'" @click.stop="telPhone(item.relationPhone)">联系供应商</button>
								<button type="default"  class="btn-normal" v-if="item.orderStatus === 'FINISHED' || item.orderStatus === 'WAIT_RECEIVE'" @click.stop="logistics(item.waybillNumber,item.relationPhone)">查看物流</button>
								<button type="default" class="btn-primary" v-if="item.orderStatus === 'WAIT_RECEIVE'" @click.stop="confirm(item.orderId,item.afterSaleStatus)">确认收货</button>
								<button type="default" class="btn-normal" v-if="item.orderStatus === 'WAIT_TAKE' || item.orderStatus === 'WAIT_PAYMENT'" @click.stop="cancel(item.orderId)">取消订单</button>
								<button type="default" class="btn-primary" v-if="item.orderStatus === 'WAIT_PAYMENT'" @click.stop="fmony(item.orderId,item.payable)">付款</button>		 
							</view>
						</view>
					</view>
					<!--  -->
					<view>
						<uni-load-more style="padding-bottom: 70rpx;" :status="loadingType" iconType="auto"
							v-if="pages > 1">
						</uni-load-more>
					</view>
				</view>
			</scroll-view>
			<!--  -->
		</view>
	</view>
</template>

<script>
	import { allOrders, infoConfirm, byUser} from '@/utils/network/api.js'
	export default {
		data() {
			return {
				triggered:false,
				scrollTop:0,
				lastScrollY:0,
				loadingType: 'loading', // 加载更多状态
				//分页
				current: 1,
				pages: 1, // 总页数
				pageSize: 10,
				orderStatus: '',
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				list: [
					{title: '全部'}, 
					{title: '待接单'},
					{title: '待付款'}, 
					{title: '待发货'}, 
					{title: '待收货'}, 
				  // {title: '已完成'}
					],
				active: 0,
				sliders: {
					width: "auto",
					height: 3,
					round: true
				},
				orderData: [],
				purchaseId:'', // 订单id
				afterSaleStatus:null, // 订单售后状态
				content:''
			}
		},
		filters: {
			orderStatusFilter(orderStatus) {
				if (orderStatus === 'WAIT_TAKE') {
					return '待接单'
				} else if (orderStatus === 'WAIT_PAYMENT') {
					return '待付款'
				} else if (orderStatus === 'WAIT_SHIP') {
					return '待发货'
				} else if (orderStatus === 'WAIT_RECEIVE') {
					return '待收货'
				} else if (orderStatus === 'FINISHED') {
					return '已完成'
				} else if (orderStatus === 'CANCELLED') {
					return '已取消'
				} else {
					return ''
				}
			}
		},
		onLoad(options) {
			this.active = options.orderStatus // 我的页面跳转过来传递的参数
			if(this.active === '1'){
				this.orderStatus = 'WAIT_TAKE'
			}
			if(this.active === '2'){
				this.orderStatus = 'WAIT_PAYMENT'
			}
			if(this.active === '3'){
				this.orderStatus = 'WAIT_SHIP'
			}
			if(this.active === '4'){
				this.orderStatus = 'WAIT_RECEIVE'
			}
			this.sendInfo()
			// this.$refs.popupConfirm.open()
		},
		methods: {
			// 返回
			goBack(){
				// uni.reLaunch({
				//    url: '/pages/me/me'
				// }),
				uni.switchTab({
					url: '/pages/me/me'
				})
			},
			// 刷新高度
			scrollChange (e) {
			 this.lastScrollY = e.detail.scrollTop;
			},
			goTop(){
				this.scrollTop = this.lastScrollY
				this.$nextTick(function() {
						this.scrollTop = 0
				});
			},
			// 触底刷新函数
			scrolltolower(){
				if (this.current < this.pages) {
					this.current++
					const params = {
						pageSize: this.pageSize,
						pageNum: this.current,
						purchaseStatus: this.orderStatus
					}
					allOrders(params).then(res => {
						this.current = res.data.current
						this.orderData = [...this.orderData, ...res.data.records]
					})
					this.loadingType = 'loading'
				} else {
					this.loadingType = 'nomore'
					return
				}
			},
			onRefresh(){
				const that = this
				that.triggered = true;
				setTimeout(() => {
						that.scrollTop = that.lastScrollY
						that.$nextTick(function(){
							that.scrollTop = 0;
						})
						that.triggered = false;
						that.sendInfo()
				}, 1000)
			},
			onRestore(){
				this.triggered = 'restore'; // 需要重置
			},
			//Tab选项卡
			handleChange(index, tab) {
				this.current = 1
			  this.goTop()
				if (parseInt(this.active) === 0) {
					this.orderStatus = ''
				} else if (parseInt(this.active) === 1) {
					this.orderStatus = 'WAIT_TAKE'
				} else if (parseInt(this.active) === 2) {
					this.orderStatus = 'WAIT_PAYMENT'
				} else if (parseInt(this.active) === 3) {
					this.orderStatus = 'WAIT_SHIP'
				} else if (parseInt(this.active) === 4) {
					this.orderStatus = 'WAIT_RECEIVE'
				}else{
					this.orderStatus = 'FINISHED'
				}
				this.sendInfo()
			},
			// 全部订单列表数据
			sendInfo() {
				// wx.showLoading({
				// 	title: '加载中',
				// 	mask: true
				// })
				const params = {
					pageSize: this.pageSize,
					pageNum: this.current,
					orderStatus: this.orderStatus || ''
				}
				allOrders(params).then(res => {
					this.orderData = res.data.records
					this.orderData.forEach(t => {
						t.payable = parseFloat(t.payable)
					})
					this.current = res.data.current
					this.pages = res.data.pages
				})
				// setTimeout(function () {wx.hideLoading();}, 500);
			},
			//跳转订单详情页
			orderDetails(e) {
				uni.navigateTo({
					url: '/pages/order/orderDetails?id=' + e.currentTarget.dataset.id
				})
			},
			// 确认收货
			confirm(e,status){
				const that =this
				that.$refs.popupConfirm.open()
				that.purchaseId = e
				that.afterSaleStatus = status
				if(that.afterSaleStatus === 'APPLIED'){
					that.content = '正在申请售后中,无法确认收货!'
				}else{
					that.content = '确认收货后,无法申请售后服务!'
				}
			},
			confirmCon(){
				const that =this
				if(that.afterSaleStatus === 'APPLIED'){
					that.$refs.popupConfirm.close()
				}else{
					that.current = 1
					infoConfirm({purchaseId:that.purchaseId}).then(res => {
						uni.showToast({icon: 'none',title: '确认收货成功'});
						that.$refs.popupConfirm.close()
						that.sendInfo()
					})
				}
				
			},
			// 取消订单
			cancel(e){
				const that =this
				that.purchaseId = e
				uni.navigateTo({
						url: '/pages/order/cancelOrder/cancelOrder?purchaseId=' + e
				})
			},
			// confirmCancel(){
			// 	const that =this
			// 	that.current = 1
			// 	byUser({purchaseId:that.purchaseId}).then(res => {
			// 		uni.showToast({icon: 'none',title: '取消订单成功'});
			// 		that.$refs.popupCancel.close()
			// 		that.sendInfo()
			// 	})
			// },
			// 付款
			fmony(orderId,payable){
				uni.navigateTo({
						url: '/pages/order/checkstand?orderId='+orderId+'&payable='+payable
				})
			},
			// 查看物流
			logistics(waybillNumber,phoneNumber){
				uni.navigateTo({
				    url: '/pages/me/markets/after_sale/logistics?waybillNumber=' + waybillNumber + '&phoneNumber=' + phoneNumber
				})
			},
			// 联系供应商
			telPhone(e){
				uni.makePhoneCall({
					phoneNumber: e,
					// 成功回调
						success: (res) => {
						 console.log('调用成功!')	
						}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header /deep/.uni-popup__success{
		 color: #000000;
	}
	.header /deep/.uni-button-color{
		color: #795C98;
	}
	.yc{
		visibility:hidden
	}
	.header /deep/ .uni-nav-bar-text{
		padding-left: 12rpx;
		}
		// 空白页
		.none{
			 padding: 30% 213rpx;
			 display: flex;
			 flex-direction: column;
			 align-items: center;
			 justify-content: center;
			 .none-img{
				 height: 98rpx;
				 width: 98rpx;
				 image{
					 width: 100%;
					 height: 100%;
				 }
			 }
			 .none-text{
				 line-height: 45rpx;
				 padding-left: 24rpx;
				 font-size: 30rpx;
				 text-align: center;
				 color: rgba(51,51,51,0.5);
			 }
		}
	.scroll-view{
		position: relative;
		// left: 0;
		top:90rpx;
		height: 82vh;
	}
	.main{
		position: relative;
		background-color: #f9f9f9;
		padding-top: 24rpx;
		// padding-bottom: 24rpx;
	}
	.header {
		background-color: #f9f9f9;
		color: #333333;
		height: 100vh;
		.header-top {
			background-color: #f9f9f9;
		}
	}

	.tabs {
		position: fixed;
		z-index: 9;
		background-color: #FFFFFF;
		box-shadow: 0 3px 10px -5px #ccc inset;
		width: 100%;
	}

	/deep/ .mm__tab:nth-child(5) {
		margin: 0rpx 24rpx 0rpx 24rpx !important;
	}

	.header-title {
		// margin: 24rpx;
		margin: 0 24rpx 24rpx 24rpx;
		background: #ffffff;
		border-radius: 16rpx;
		.header-text {
			font-size: 28rpx;
			padding: 24rpx 0;
			margin: 0 24rpx;
			.dk {
				color: #333333;
				float: left;
			}
			.sh {
				float: right;
				color: #795C98;
			}
		}
	}

	.header-center {
		border-top: 2rpx solid #EEEEEE;
		padding: 24rpx 0;
		margin: 0 24rpx;
		display: flex;
		image {
			width: 150rpx;
			height: 150rpx;
			border-radius: 8rpx;
		}
		.header-nr {
			margin-left: 24rpx;
			width: 480rpx;
			.header-tit {
				font-size: 26rpx;
				color: #333333;
				height: 37rpx;
				line-height: 37rpx;
				text-align: justify;
				text-align-last: left;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			.header-jg {
				font-size: 24rpx;
				margin-top: 16rpx;
				.djs {
					margin-bottom: 2rpx;
					color: rgba(51, 51, 51, 0.4);
					width: 120rpx;
					line-height: 33rpx;
				}

				.dj {
					color: rgba(51, 51, 51, 0.50);
				}

				.sl {
					float: right;
				}
			}
			.header-jg-right{
				font-size: 24rpx;
				text-align: right;
			}

			.header-ch {
				margin-top: 20rpx;
				.ch {
					font-size: 26rpx;
					color: #00b7f4;
					float: left;
					margin-top: 2rpx;
				}

				.header-yfje {
					float: right;
					font-size: 28rpx;
					color: #333333;
					font-size: 28rpx;
					font-weight: 500;
					.money {
						color: #333333;
						font-size: 28rpx;
						font-weight: 500;
					}
				}
				
			}
		}
	}

	.jes {
		margin: 0 24rpx;
		padding-bottom:24rpx;
		display: flow-root;
		.jes-yf {
			display: flex;
			float: right;
			.header-jg {
				font-size: 24rpx;
				
				.djs {
					color: rgba(51, 51, 51, 0.50);
					width: 168rpx;
					display: inline-block;
				}

				.dj {
					color: rgba(51, 51, 51, 0.50);
				}

				.sl {
					float: right;
				}
			}

			.ch {
				font-size: 26rpx;
				color: #00b7f4;
				flex: 1;
			}
		}
    
		.header-ch {
			margin-top: 20rpx;
			clear: both;
			
			.header-yfje {
				float: right;
				color: #333333;
				font-size: 28rpx;
				font-weight: 500;
				margin-top: 24rpx;
				.money {
					color: #333333;
					font-size: 28rpx;
					font-weight: 500;
				}
			}
		}
   
		.header-dd {
			float: right;
			font-size: 30rpx;
			margin-top: 24rpx;

			.dd {
				padding: 0 24rpx;
				height: 64rpx;
				border: 1rpx solid rgba(51, 51, 51, 0.26);
				border-radius: 34rpx;
				display: inline-block;
				line-height: 64rpx;
				text-align: center;
				margin-right: 16rpx;
			}
		}
	}
   .status-button{
		 padding:0 0 24rpx 24rpx;
    	line-height: 64rpx;
			display: flex;
			position: relative;
			.tel{
				display: flex;
				line-height: 48rpx;
				padding: 8rpx 0;
				color: rgba(51,51,51,0.5);
				.icon-tel{
					line-height: 48rpx;
					font-size: 48rpx;
					padding-right: 16rpx;
				}
				.icon-txt{
					font-size: 26rpx;
				}
			}
			.button-list{
				display: flex;
				position: absolute;
				right: 24rpx;
				color: #333333;
				text-align: center;
				overflow: hidden;
				button{
					min-width: 144rpx;
					line-height: 42rpx;
					font-size: 28rpx;
					border-radius: 34rpx;
					background: #ffffff;
					padding: 12rpx 16rpx;
					margin-left: 16rpx;
				}
				.btn-normal {
					 color: #333333;
					 background-color: #fff;
					 box-shadow: 0 0 0 2rpx rgba(51,51,51,0.5) inset;
				 }
				.btn-primary{
					background-color: #fff;
					background: #795C98;
					color: #fff;
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

	/deep/ .tabBlock .tab {
		height: 84rpx !important;
		line-height: 84rpx !important;
	}

	/deep/ .tabBlock .tab__item {
		line-height: 84rpx !important;
	}

	/deep/ .uni-load-more.data-v-90d4256a {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
