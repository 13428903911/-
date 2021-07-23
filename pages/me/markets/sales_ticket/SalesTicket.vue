<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar>
		    <view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">销售单列表</text>
				</view>
			</view>
		</uni-nav-bar>
		<!-- tabs选项卡 -->
		<view class="tabs" :style="{'margin-top':bottom + 'px'}">
			<ms-tabs class="tabs-mzy" :list="list" v-model="active" itemColor='#795C98' lineColor='#795C98'
				@input="handleChange" />
		</view>
		<!-- 全部 -->
		<scroll-view scroll-y="true" refresher-enabled="true" class="sv" :refresher-triggered="triggered" :refresher-threshold="100"
		@refresherrefresh="onRefresh" @refresherabort="onAbort" @scrolltolower="scrolltolower" :style="{height:navHeight+'px'}">
		<view v-if="orderData.length" class="sales-main">
			<view class="header-title" v-for="(item,index) in orderData" :key="index" :data-id='item.orderId' @click.stop="orderDetails(item.orderId)">
				<view class="header-text">
					<view class="pick-order">
						<view class="pick-up" v-if="item.logisticsType === true">
							<view>自提</view>
						</view>
						<view class="pick-up distribution" v-else style="">
							<view>配送</view>
						</view>
						<view><text>订单:</text><text class="order">{{item.orderId}}</text></view>
					</view>
					<view class="pick-status">{{item.statusName}}</view>
				</view>
				<view class="header-center" v-for="(i,index) in item.orderSkuList" :key="index">
					<view class="list-img">
						<image :src="imgObs+i.skuImage" mode=""></image>
					</view>
					<view class="header-nr">
						<p class="header-tit">{{i.skuName || ''}}</p>
						<view>
							<view class="Specification">
								<text>{{i.skuSpec || ''}}</text>
							</view>
							<view class="price-amount">
								<text class="price">￥{{i.skuPrice}}/件</text>
								<text class="amount">x{{i.skuNum}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="close">
					<view class="close-goods">
						<view>共计<text class="count">{{item.goodsCount}}</text>件商品，合计<text class="total-price bold">￥{{item.totalMoney}}</text></view>
					</view>
					<view class="get-code bold" v-if="item.statusName === '待提货'">
						<view><text>取件码：</text><text>{{item.pickupNumber}}</text></view>
					</view>
					<view v-else-if="item.statusName === '待发货'">
						<view class="immediate-delivery" @click.stop="immediateDelivery(item.orderId)">立即发货</view>
						<view style="clear: both;"></view>
					</view>
				</view>
			</view>
			<view>
				<uni-load-more v-if="orderData.length > 10 || orderData.length == 10" style="padding-bottom: 70rpx;" :status="loadingType" iconType="auto"></uni-load-more>
			</view>
		</view>
		<!-- 暂无数据-->
		<nodata :noText="noDataText" v-else/>
	</scroll-view>
		<!-- 立即发货-模态层弹窗 -->
		<uni-popup ref="popup" type="bottom" :animation="false"  @change="popupChange">
			<view class="popup-contont">
				<view class="popup-title-content">
					<view class="popup-title-dhl">
						<view class="title">物流公司</view>
						<view class="dhl-iocn" @click="selectDhl">
							<text class="dhl">顺丰快递</text>
							<text class="iconfont">&#xe61a;</text>
						</view>
					</view>
					<view class="waybill-num">
						<text class="waybill-code">运单号：</text>
						<input class="uni-input" type="text" v-model="logisticsInfo.logisticsNum" placeholder="请输入运单号" placeholder-class/>
					</view>
				</view>
				<view class="btn-group">
					<button type="button" class="btn-primary" @click="TheDelivery">发货</button>
					<button type="button" class="btn-normal" @click="$refs.popup.close()">驳回</button>
				</view>
			</view>
		</uni-popup>		
			
	</view>
</template>

<script>
	import { sellStatu, filterStatus } from '@/utils/status.js'
	import { getAfterket,getImmediate } from '@/utils/network/aftermarket.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {
				noDataText: '暂无数据~',
				pH:0, //窗口高度
				navHeight:0, //元素的所需高度
				triggered: false, // 下拉刷新开关
				bottom:uni.getMenuButtonBoundingClientRect().bottom + 4,
				logisticsInfo: {
					logisticsNum: "",
					orderId:''
				},
				logisticsName: {},
				loadingType: 'loading', // 加载更多状态
				//分页
				fromData:{
					pageNum: 1, // 总页数
					pageSize: 10,
					orderStatus: '',
				},
				current: 1,
				orderTitle:'',
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				list: [],
				active: 0,
				sliders: {
					width: "auto",
					height: 3,
					round: true
				},
				orderData: []
			}
		},
	mounted() {
		const vm = this;
		uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
			success(res) { //成功回调函数
				vm.pH = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
				let titleH = uni.createSelectorQuery().select(".sv")
				titleH.boundingClientRect(data=>{
					console.log('data',data)
					vm.navHeight = vm.pH - data.top //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
				}).exec()
			}
		})
	},
		onLoad(options) {
			const vm = this
			// this.handleChange()
			vm.active = options.index // 我的页面跳转过来传递的参数
			if (options.index == 2) {
				vm.fromData.orderStatus = 'WAIT_SHIP'
				vm.orderTitle = '待发货'
			}
			if (options.index == 4) {
				vm.fromData.orderStatus = 'WAIT_PICKUP'
				vm.orderTitle = '待提货'
			}
			vm.list = sellStatu.filter(t => !t.hidden)
			vm.sendInfo()
		
		},
		methods:{
			// 选择快递
			selectDhl() {
				uni.navigateTo({
				   url: './logistics'
				})
			},
			// 滚动触发
			// 模态框change事件
			popupChange(e) {
				const vm = this
				if (!e.show) {
					vm.logisticsInfo.logisticsNum = ''
				}
			},
			// 滚动到底部
			scrolltolower() {
				const vm = this
				vm.fromData.pageNum++
				getAfterket(vm.fromData).then(res => {
					const arr = [...vm.orderData, ...res.data.records]
					arr.forEach(t => {
						const status = t.orderStatus
						if (vm.fromData.orderStatus) {
							t.statusName = vm.orderTitle
						} else {
							t.statusName = filterStatus(status, sellStatu)
						}
					})
					this.orderData = arr
				})
				if(vm.fromData.pageNum > this.current) {
					vm.loadingType='nomore'
					return
				}
			},
			onAbort() {
				const vm = this
				setTimeout(() => {
					vm.triggered = false;
				}, 500)
			},
			// 下拉刷新
			onRefresh() {
				const vm = this
				vm.triggered = true	
				vm.fromData.pageNum = 1
				vm.sendInfo() 		
			 },
			//  立即发货
			TheDelivery() {
				const vm = this
				// 正则订单号
					const orderCode = /^[a-zA-Z0-9]+$/
					if (!orderCode.test(vm.logisticsInfo.logisticsNum)) {
						uni.showToast({title: "订单格式不正确!", icon:'none'})
						return
					}
				getImmediate(vm.logisticsInfo).then(res => {
					uni.showToast({title: "发货成功!", icon:'none'})
					vm.cancel()
					vm.fromData.pageNum = 1
					vm.sendInfo()
				})
			},
			// 跳转物流
			selectLogistics() {
				uni.navigateTo({
				  url: '/pages/me/markets/sales_ticket/logistics'
				})
			},
			// 物流点击显示弹窗
			immediateDelivery(id) {
				const vm = this
				vm.logisticsInfo.orderId = id
				vm.$refs.popup.open()
			},
			 // 物流点击弹窗里面的内容触发的事件
			handlePopup(val,item) {
			  const vm = this
			  vm.$refs.popup.close()
			},
			// 物流取消按钮事件
			cancel(){
			  const vm = this
			  vm.$refs.popup.close()
			},
			//Tab选项卡
			handleChange(index, tab) {
				const vm = this
			
				vm.fromData.pageNum = 1
				const { title, value } = tab
				vm.fromData.orderStatus = value
				vm.orderTitle = title
				vm.sendInfo()
			},
			// 全部订单列表数据
			sendInfo() {
				const vm = this
				wx.showLoading({
				   title: '加载中'
				})
				if (!vm.fromData.orderStatus) {
					delete vm.fromData.orderStatus
				}
				getAfterket(vm.fromData).then(res => {
					wx.hideLoading()
					const { data } = res
					const list = data.records
					list.forEach(t => {
						const status = t.orderStatus
						if (vm.fromData.orderStatus) {
							t.statusName = vm.orderTitle
						} else {
							t.statusName = filterStatus(status, sellStatu)
						}
					})
					this.orderData = list
					vm.onAbort()
					this.current = data.current
					if(this.orderData.length < 10) {
						vm.loadingType='nomore'
					}
				}).catch(() => {
					wx.hideLoading()
					this.onAbort()
				})
			},
			//跳转销售单详情页
			orderDetails(id) {
				uni.navigateTo({
					url: '/pages/me/markets/sales_ticket/SalesTicketDetail?id='+id
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
	.contont{
		font-weight: 400;
		height: 100vh;
		background-color: #f9f9f9;
		.search{
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
		// 修改tab样式
		/deep/ .uni-navbar--border{
			border: none !important;
		}
		.tabs {
			margin-top:119rpx;
			width: 100%;
			position: fixed;
			top:0;
			left:0;
			right: 0;
			z-index: 999;
			// padding-left: 10px;
			font-size: 30rpx;
			color: #333333;
			background-color: #FFFFFF;
			box-shadow: 0 5px 10px -8px #ccc inset;
			border: 1rpx solid #eeeeee;
		}
		/deep/ .tabBlock .tab__item-title {
			font-weight: 400 !important;
			margin: 0 25rpx !important;
		}
		/deep/ .mm__tab:nth-child(5) {
			margin: 0rpx 24rpx 0rpx 24rpx !important;
		}
		.sales-main{
			margin-top:104rpx;
			.header-title {
				margin: 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				padding: 24rpx;
				.header-text {
					font-size: 26rpx;
					padding-bottom: 24rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 2rpx solid #eeeeee;
					.pick-order{
						display: flex;
						align-items: center;
						.pick-up{
							width: 28px;
							height: 14px;
							font-size: 20rpx;
							font-weight: 400;
							color: #795c98;
							border: 1px solid #795c98;
							border-radius: 7rpx;
							margin-right: 8px;
							text-align: center;
							line-height: 15px;
						}
						.distribution{
							border: 1px solid #2582ff !important;
							color: #2582ff !important;
						}
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
					// border-top: 2rpx solid #EEEEEE;
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
							// line-height: 36rpx;
						}
						.Specification{
							height: 36rpx;
							opacity: 1;
							font-size: 26rpx;
							font-weight: 400;
							text-align: left;
							color: rgba(51,51,51,0.50);
							// line-height: 36rpx;
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
				text-align: right;
				height: 37rpx;
				opacity: 1;
				font-size: 26rpx;
				font-weight: 400;
				text-align: right;
				color: #333333;
				line-height: 37rpx;
				.count{
					color: rgba(51,51,51,0.50);
					padding: 0 8rpx;
				}
				.total-price{
					height: 48rpx;
					opacity: 1;
					font-size: 34rpx;
					font-weight: 500;
					text-align: right;
					color: #333333;
					line-height: 48rpx;
					padding-left: 8rpx;
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
			.immediate-delivery{
				display:inline;
				// text-align: right;
				padding: 11rpx 24rpx;
				background: #795c98;
				border-radius: 32px;
				float: right;
				font-size: 30rpx;
				font-weight: 400;
				color: #ffffff;
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
	}
	
	// 弹出层样式
	.popup-contont{
		// width: 540rpx;
		background: #ffffff;
		border-radius: 16rpx;
		.popup-title-content{
			padding: 48rpx 48rpx 0 48rpx;
			.popup-title-dhl{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 24rpx;
				.title{
					height: 48rpx;
					opacity: 1;
					font-size: 34rpx;
					font-weight: 500;
					text-align: center;
					color: #333333;
					line-height: 48rpx;
				}
				.dhl-iocn{
					display: flex;
					align-items: center;
					.dhl{
						font-size: 30rpx;
						color: rgba(0,0,0,0.85);
					}
					.iconfont{
						margin-left: 24rpx;
						font-size: 48rpx;
						color: #9e9e9e;
					}
				}
			}
			.waybill-num{
				display: flex;
				height: 96rpx;
				align-items: center;
				border-top: 1rpx solid #eeeeee;
				border-bottom: 1rpx solid #eeeeee;
				margin-bottom: 48rpx;
				.waybill-code{
					font-size: 34rpx;
					padding-right: 24rpx;
				}
			.uni-input{
					/deep/ .input-placeholder{
						color: rgba(51,51,51,0.26);
						font-size: 34rpx;
					}
				}
			}
		}
	// 按钮样式
				.btn-group {
					padding:24rpx;
					border-top: 1rpx solid #eeeeee;
					overflow: hidden;
					button {
						float: right;
						padding: 11rpx 12px;
						border-radius: 30px;
						font-size: 30rpx;
						color: #fff;
						line-height: 22px;
					}
					.btn-normal {
						margin-right: 24rpx;
						color: #333333;
						background-color: #fff;
						box-shadow: 0 0 0 2rpx rgba(51,51,51,0.5) inset;
					}
					.btn-primary {
						background-color: #795c98;
					}
				}
	}


	 .goods-button{
	   padding: 0rpx 24rpx;
	   font-size: 30rpx;
	   height: 64rpx;
	   border: 2rpx solid rgba(51,51,51,0.26);
	   border-radius: 34rpx;
	   line-height: 64rpx;
	   text-align: center;
	   margin: 18rpx 0rpx;
	  }
	  .order-button{
	   margin-right: 24rpx;
	  }
	  .order-color{
	   background: #795c98;
	   color: #ffffff;
	  }
	  .order-btn{
	   display: flex;
	   background: #fff;
	   justify-content: flex-end;
	   padding: 0 24rpx;
	   box-shadow: 0rpx 1rpx 1rpx 0rpx #EEEEEE inset;;
	  }
		
		
		// 空白样式
.none{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top:30%;
		.none-img{
		 height: 98rpx;
		 width: 98rpx;
		 image{
			width: 100%;
			height: 100%;
		 }
		}
		.none-text{
		 line-height: 98rpx;
		 padding-left: 24rpx;
		 font-size: 30rpx;
		 text-align: center;
		 color: rgba(51,51,51,0.5);
		}
	 }
</style>
