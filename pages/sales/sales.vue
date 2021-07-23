<template>
	<view class="header">
		<uni-nav-bar left-icon="back"  title="售后处理" fixed statusBar color="rgba(0,0,0,0.85)" @clickLeft="goBack"></uni-nav-bar>
		<!-- 立即发货-模态层弹窗 -->
		<uni-popup ref="popup" type="center" :animation="true">
			<view class="popup-contont">
				<view class="popup-title-content">
					<view class="title">运单号</view>
					<input class="uni-input" type="text" v-model="logisticsInfo.waybillNumber" @blur="orderCode" placeholder="请输入运单号" placeholder-class/>
				</view>
				<view class="btn-cancel-affirm">
					<view @click="closeTheDelivery">取消</view>
					<view class="Agree-return" @click="TheDelivery">发货</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupSale" type="dialog">
				<uni-popup-dialog type="success" title="提示" content="确定要申请平台介入吗？" :duration="2000" :before-close="true" @close="closeSale" @confirm="confirmSale"></uni-popup-dialog>
		</uni-popup>
		<!-- tabs选项卡 -->
		<view class="tabs">
		    <!-- <mzy-tabs class="tabs-mzy" :list="list" v-model="active" grow gutter="12" paddingX="300" activeColor="#795C98" fontSize="15" height="40" :slider="sliders" @change="handleChange"/> -->
				<view class="tabs-list" v-for="(item,index) in list" :key="item.id" :class="active === item.id ? 'active' : ''" @click="changeTabs(item.id,item.status)">
					<view style="padding-bottom: 16rpx;" :class="active === item.id ? 'active2' : ''"> {{item.value}}</view>
				</view>
		</view>
		<!-- 暂无数据 -->
		<nodata :noText="noDataText" v-if="orderData.length < 1"/>
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
			<view class="main">
				 <view class="main-box" v-for="(item,index) in orderData" :key="index">
						<view class="stalls" @click.stop="goDetail(item.retreatId)">
							<text class="stall-name">{{item.supplierName}}</text>
							<text class="stall-status">{{item.retreatStatusValue}}</text>
							<view style="clear: both;"></view>
						</view>
						<view class="goods" @click.stop="goDetail(item.retreatId)">
							<view class="goods-list" v-for="(s,index) in item.goodsList" :key="index">
							  <view class="goods-img">
								  <image :src="imgObs + s.goodsPhoto" mode="aspectFill"></image>
							  </view>
								<view class="goods-name">
									 <view class="goods-name-txt">{{s.goodsName}}</view >
									 <view class="goods-sku">
										 <view class="sku-list" v-for="(t,index) in s.goodsDetailList" :key="index">
											 <view class="sku-name">{{t.goodsSpecs}}</view>
											 <view class="sku-price">单价：<text style="color: #333333;">￥{{t.goodsPrice || '0'}}</text></view>
											 <view class="sku-num">x{{t.goodsNum}}</view>
										 </view>
									 </view>
									 <view class="subtotal">小计：<text style="color:#333333">￥{{s.totalGoodsMoney || '0'}}</text></view>
								</view>
							</view>
							<view class="priceNum" @click="goDetail(item.retreatId)">退款总金额：￥{{item.refundMoney || '0'}}</view>
							<view class="status-button">
								<view class="button-list">
									<button type="default" class="btn-normal" v-if="item.retreatStatus === 'WAIT_EXAMINE'" @click.stop="withdraw(item.retreatId)">撤回</button>
									<button type="default" class="btn-normal" v-if="item.retreatStatus === 'WAIT_RETURN' && item.retreatType.name === 'REFUND_RETURN'" @click.stop="openPop(item.retreatId)">填写运单号</button>
									<button type="default" class="btn-normal" v-if="item.retreatStatus === 'SUPPLIER_REJECTED'" @click.stop="openSale(item.retreatId)">平台介入</button>
								</view>
							</view>
						</view>
				 </view>
				 <uni-load-more style="padding-bottom: 70rpx;" :status="loadingType" iconType="auto"
					v-if="pages > 1">
				 </uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { orderList , updateStatusAndLogisticsInfo , saleCancel ,applyPlatformHandle} from '@/utils/network/api.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {
				triggered:false,
				scrollTop:0,
				lastScrollY:0,
				noDataText: '暂无订单~',
				// list: ['全部','待审核','未通过','已完成'],
				loadingType: 'loading', // 加载更多状态
				//分页
				pages:1,
				current: 1,
				pageSize:10,
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				logisticsInfo: {
					waybillNumber: "",
					retreatId:''
				},
				orderStatus:'', // 状态
				list:[
					{id:1,value:'全部',status:''},
					{id:2,value:'待审核',status:'WAIT_EXAMINE'},
					{id:3,value:'待退货',status:'WAIT_RETURN'},
					{id:4,value:'待退款',status:'WAIT_REFUND'},
					],
				active:1,
				sliders:{width:"auto",height:2,round:true},
				orderData:[],
			}
		},
		filters:{
			orderStatusFilter(orderStatus) {
				 if (orderStatus === 'WAIT_PAYMENT') {
					 return '待付款'
				 } else if (orderStatus === 'WAIT_SHIP') {
					 return '待发货'
				 } else if (orderStatus === 'CANCELLED') {
					 return '已取消'
				 } else if (orderStatus === 'SHIPPED') {
					 return '已发货'
				 } else if (orderStatus === 'WAIT_COMMENT') {
					 return '待评价'
				 } else if (orderStatus === 'WAIT_VERIFY') {
					 return '待审核'
				 } else if (orderStatus === 'WAIT_SHIP') {
					 return '待换货'
				 } else if (orderStatus === 'EXCHANGED') {
					 return '已发货'
				 } else if (orderStatus === 'REJECT') {
					 return '已驳回'
				 } else if (orderStatus === 'FINISHED') {
					 return '已完成'
				 }  else if (orderStatus === 'CLOSED') {
					 return '已关闭'
				 } else {
					 return ''
				 }
			}
		},
		onLoad() {
			this.sendInfo()
		},
		methods: {
			goBack(){
				uni.switchTab({
					url: '/pages/me/me'
				})
				// uni.reLaunch({
				//    url: '/pages/me/me'
				// })
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
						retreatStatus: this.orderStatus
					}
					orderList(params).then(res => {
						this.loadingType = 'loading'
						this.current = res.data.current
						this.orderData = [...this.orderData, ...res.data.records]
					})
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
			// handleChange(index,tab){
			// 	this.active = index
			// },
			changeTabs(id,status){
				const that = this
				that.active = id
				that.orderStatus = status
				that.current = 1
				that.goTop()
				that.sendInfo()
			},
			// 售后订单列表
			sendInfo(){
				wx.showLoading({
					title: '加载中',
					mask: true
				})
				const params = {
					pageSize: this.pageSize,
					pageNum: this.current,
					retreatStatus: this.orderStatus || ''
				}
				 orderList(params).then(res => {
					 // console.log(res.data.records)
						this.orderData = res.data.records
						this.current = res.data.current
						this.pages = res.data.pages
				 })
				 setTimeout(function () {wx.hideLoading();}, 500);
			},
			// 打开发货弹窗
			openPop(id){
				const that = this
				that.logisticsInfo.retreatId = id
				that.$refs.popup.open()
			},
			// 输入快递号
			orderCode(e) {
				// console.log('快递单号:',e.detail.value)
				const vm = this
				// vm.logisticsInfo.waybillNumber = e.detail.value.replace(/\s*/g, "")
				vm.logisticsInfo.waybillNumber = e.detail.value
				// if(vm.logisticsInfo.waybillNumber == ''){
				// 	uni.showToast({
				// 	  title:"运单号不能为空" ,
				// 		icon:"none"
				// 	})
				// }
			},
			// 取消发货
			closeTheDelivery(){
				const that = this
				that.$refs.popup.close()
				that.logisticsInfo.waybillNumber = ''
				that.logisticsInfo.retreatId = ''
			},
			// 立即发货
			TheDelivery() {
				const that = this
				const orderCode = /^[a-zA-Z0-9]+$/
				if (!orderCode.test(that.logisticsInfo.waybillNumber)) {
						uni.showToast({title: "运单格式不正确!", icon:'none'})
						return
				}
				updateStatusAndLogisticsInfo(that.logisticsInfo).then(res => {
					that.$refs.popup.close()
					that.sendInfo()
					uni.showToast({title: "发货成功!", icon:'none'})
				})
			},
			// 平台介入
			openSale(id){
				const that = this
				that.logisticsInfo.retreatId = id
				that.$refs.popupSale.open()
			},
			closeSale(){
				const that = this
				that.$refs.popupSale.close()
			},
			confirmSale(){
				const that = this
				applyPlatformHandle({retreatId:that.logisticsInfo.retreatId}).then(res => {
					that.$refs.popupSale.close()
					that.sendInfo()
					uni.showToast({title: "申请平台介入成功!", icon:'none'})
				})	
			},
			// 撤回
			withdraw(id){
				const that = this
				saleCancel({retreatId:id}).then(res => {
					that.sendInfo()
					uni.showToast({title: "撤回成功!", icon:'none'})
				})
			},
			// 售后详情
			goDetail(id){
				uni.navigateTo({
					 url: '/pages/sales/saleDetail/index?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
 .header /deep/.uni-popup__success{
	 color: #000000;
 }
.header /deep/.uni-navbar--border{
		box-shadow: 0px 2rpx 8rpx 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff; 
	}
.header /deep/ .uni-nav-bar-text{
		padding-left: 12rpx;
		}
.active{
	color: #795C98;
	font-weight: 500;
}
.active2{color: #795C98;
  font-weight: 500;
	border-bottom: 4rpx solid #795C98;
}
.header {
	background-color: #f9f9f9;
	color: #333333;
	letter-spacing:2rpx;
	// box-shadow: 0px 4rpx 8rpx -1px rgba(0,0,0,0.10) inset;
	// height: calc(100vh - -310rpx);
	height: 100vh;
	// tabs
	.tabs{
		width: 100%;
		position: fixed;
		z-index: 9999;
		background-color: #FFFFFF;
		padding: 22rpx 32rpx 0rpx 32rpx;
		display: flex;
		font-size: 30rpx;
		line-height: 42rpx;
		box-shadow: 0 3px 10px -5px #ccc inset;
		.tabs-list{
			padding-right: 111rpx;
		}
		.tabs-list:nth-child(4){
			padding: 0;
		}
	}
	// 
	.scroll-view{
		position: relative;
		top:90rpx;
		height: 82vh;
		//border: 1rpx solid red;
		.main{
				padding: 24rpx 24rpx 0rpx 24rpx;
				background-color: #f9f9f9;
				.main-box{
					border-radius: 16rpx;
					background: #ffffff;
					padding: 24rpx;
					margin-bottom: 24rpx;
						.stalls{
							font-size: 28rpx;
							line-height: 40rpx;
							margin-bottom: 24rpx;
							font-weight: 500;
							.stall-name {
								width: 65%;
								color: #333333;
								float: left;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								line-clamp: 1;
								-webkit-box-orient: vertical;
							}
							.stall-status {
								float: right;
								color: #795C98;
							}
						}
						.goods{
							.goods-list{
								padding: 24rpx 0 8rpx 0;
								position: relative;
								border-top: 1rpx solid #eeeeee;
								border-bottom: 1rpx solid #eeeeee;
								.goods-img{
									position: absolute;
									left: 0;
									top: 24rpx;
									width: 150rpx;
									height: 150rpx;
									background: rgba(51,51,51,0.05);
									border-radius: 4rpx;
									image{
										max-height: 100%;
										width: 100%;
										height: 100%;
										border-radius: 4rpx;
									}
								}
								.goods-name{
									min-height: 150rpx;
									margin-left: 150rpx;
									padding-left: 24rpx;
									.goods-name-txt{
										width: 100%;
										line-height: 37rpx;
										font-size: 26rpx;
										text-align: left;
										text-overflow: -o-ellipsis-lastline;
										overflow: hidden;
										text-overflow: ellipsis;
										display: -webkit-box;
										-webkit-line-clamp: 1;
										line-clamp: 1;
										-webkit-box-orient: vertical;
									}
									.goods-sku{
										position: relative;
										padding: 12rpx 0;
										border-bottom: 1rpx solid #eeeeee;
										.sku-list{
											display: flex;
											padding: 4rpx 0;
											line-height: 33rpx;
											font-size: 24rpx;
											.sku-name{
												width: 150rpx;
												color: rgba(51,51,51,0.5);
											}
											.sku-price{
												color: rgba(51,51,51,0.5);
												padding-left: 32rpx;
											}
											.sku-num{
												position: absolute;
												right: 0;
												text-align: right;
											}
										}
									}
									.subtotal{
										width: 100%;
										text-align: right;
										font-size: 24rpx;
										line-height: 33rpx;
										padding: 16rpx 0 8rpx 0;
										color: rgba(51,51,51,0.5);
									}
								}
							}
				    }
					.priceNum{
						text-align: right;
						color: #333333;
						font-size: 28rpx;
						line-height: 40rpx;
						padding: 24rpx 0;
					}
					.status-button{
						display: flex;
						justify-content:flex-end;
						line-height: 64rpx;
						.button-list{
							display: flex;
							color: #333333;
							text-align: center;
							overflow: hidden;
							button{
								line-height: 42rpx;
								font-size: 30rpx;
								border-radius: 34rpx;
								background: #ffffff;
								padding: 11rpx 24rpx;
								margin-left: 24rpx;
							}
							.btn-normal {
								 color: #333333;
								 background-color: #fff;
								 box-shadow: 0 0 0 2rpx rgba(51,51,51,0.5) inset;
							 }
						}
							
					}
					
			 }
		}
	}

 // 弹出层样式
 .popup-contont{
 	width: 540rpx;
 	background: #ffffff;
 	border-radius: 16rpx;
 	.popup-title-content{
 		padding: 48rpx;
 		text-align: center;
 		.uni-input{
 			height: 52rpx;
 			margin-top: 24rpx;
 			background: #f9f9f9;
 			border-radius: 8rpx;
 			/deep/ .input-placeholder{
 				line-height: 52rpx;
 				// text-align: left;
 				// margin-left: 16rpx;
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

// /deep/ .uni-popup__success{
// 	color: #333333!important;
// 	font-size: 34rpx;
// }
// /deep/ .uni-button-color{
// 	color: #333333;
// 	font-size: 34rpx;
// }
}
</style>
