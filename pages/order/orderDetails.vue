<template>
	<view class="container">
		<uni-nav-bar left-icon="back"  title="采购订单详情" fixed statusBar color="rgba(0,0,0,0.85)" @clickLeft="goBack"></uni-nav-bar>
		<uni-popup ref="popupCancel" type="dialog">
				<uni-popup-dialog type="success" title="提示" content="确定要取消该订单吗？" :duration="2000" :before-close="true" @close="$refs.popupCancel.close()" @confirm="confirmCancel"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popupConfirm" type="dialog">
				<uni-popup-dialog type="success" title="提示" content="确认收货后,无法申请售后服务!" :duration="2000" :before-close="true" @close="$refs.popupConfirm.close()" @confirm="confirmCon"></uni-popup-dialog>
		</uni-popup>
		<!--  -->
		<view class="bottom-button">
			<view class="tel" @click="telPhone(orderData.relationPhone)"><view class="iconfont icon">&#xe639;</view><view class="icon-txt">联系供应商</view></view>
			<view class="status">
				<view class="status-name" @click="gologistics(orderData.waybillNumber,orderData.relationPhone)" v-if="orderData.orderStatus === 'FINISHED'">
					查看物流
				</view>
				<view class="status-name" @click="goSale(orderData.orderId)" v-if="orderData.orderStatus === 'WAIT_RECEIVE' && orderData.afterSaleStatus !== 'APPLIED'">
					申请售后
				</view>
				<view  @click="confirm(orderData.orderId)" style="background: #795C98;color: #fff;" class="status-name" v-if="orderData.orderStatus === 'WAIT_RECEIVE' && orderData.afterSaleStatus !== 'APPLIED'">
					确认收货
				</view>
				<view @click="cancel(orderData.orderId)" class="status-name" v-if="orderData.orderStatus === 'WAIT_TAKE' || orderData.orderStatus === 'WAIT_PAYMENT'">
					取消订单
				</view>
				<view @click="fmony(orderData.orderId,orderData.payable)" class="status-name" style="background: #795C98;color: #fff;" v-if="orderData.orderStatus === 'WAIT_PAYMENT'">
					立即付款
				</view>
			</view>
		</view>
		 <view class="main">
			 <view >
				 <!-- 商品信息 -->
			 	 <view class="main-box">
						<view class="information">商品信息</view>
						<view class="goods">
								<view class="goods-list" v-for="(item,index) in orderForm" :key="item.goodsId">
									 <view class="goods-img">
										 <image :src="imgObs + item.goodsPhoto" mode="aspectFill"></image>
									 </view>
									 <view class="goods-name">
										 <view class="goods-name-txt">{{ item.goodsName }}</view >
										 <view class="goods-sku">
											 <view class="sku-list" v-for="i in item.goodsDetailList" :key="i.goodsId">
												 <view class="sku-name">{{ i.goodsSpecs }}</view>
												 <view class="sku-price">单价：<text style="color: #333333;">￥{{ i.goodsPrice }}</text></view>
												 <view class="sku-num">x{{ i.goodsNum }}</view>
											 </view>
										 </view>
										 <view class="subtotal">
											小计：<text style="color:#333333">￥{{ item.goodsMoney }}</text>
										 </view>
										</view>
									</view>
								</view>
						</view>	
			 	 </view>
				 <!-- 订单信息 -->
				 <view class="main-box" style="padding-bottom: 2rpx;">
				 		<view class="information">订单信息</view>
						<view class="logistics-information">
							<text class="text">订单号:</text><text class="content">{{ orderData.orderId || '--'}}</text>
						</view>
						<view class="logistics-information">
							<text class="text">订单状态:</text><text class="content" style="color: #795C98;">{{ orderData.orderStatus | orderStatusFilter }}</text>
						</view>
						<view class="logistics-information">
							<text class="text">创建时间:</text><text class="content">{{ orderData.createTime || '--'}}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'WAIT_RECEIVE' || orderData.orderStatus === 'FINISHED'">
							<text class="text">发货时间:</text><text class="content">{{ orderData.deliverTime || '--'}}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus !== 'FINISHED'">
							<text class="text">备注信息:</text><text class="content">{{ orderData.remark || '--'}}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'FINISHED'">
							<text class="text">完成时间:</text><text class="content">{{ orderData.finishedTime || '--' }}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'CANCELLED'">
							<text class="text">取消时间:</text><text class="content">{{ orderData.cancelTime || '--'}}</text>
						</view>
				 </view>
				 <!-- 配送信息 -->
				  <view class="main-box" style="padding-bottom: 2rpx;" v-if="orderData.orderStatus === 'WAIT_RECEIVE'">
				  	<view class="information">配送信息</view>
				 		<view class="logistics-information">
				 			<view class="text">
				 				物流信息:
				 			</view>
							<view class="logistics-wl" v-if="waybillList.length">
								<view class="logistics-time" v-for="(item,index) in waybillList" :key="index">
									<view class="cu-timeline " :class="{'txtColor': index === 0}">
										<view class="cu-item" :class="{'first-item': index === 0,'text-blue': index === 0}">
											<view class="content">
												<p>{{item.time}}</p>
												<text>{{item.status}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<!-- 空白 -->
							<!-- <nodata :noText="noDataText" v-else/> -->
							<view class="" v-else style="line-height: 200rpx;text-align: center;width: 80%;">
								暂无物流信息
							</view>
				 		</view>
				 </view>
				 <!-- 支付信息 -->
				 <view class="main-box" style="padding-bottom: 2rpx;" v-if="orderData.orderStatus !== 'WAIT_TAKE' && orderData.orderStatus !== 'CANCELLED'">
				 		<view class="information">支付信息</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'WAIT_SHIP' || orderData.orderStatus === 'WAIT_RECEIVE'"> 
							<text class="text">交易单号:</text><text class="content">{{ orderData.tradeNum || '--'}}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'WAIT_SHIP' || orderData.orderStatus === 'WAIT_RECEIVE'">
							<text class="text">支付时间:</text><text class="content">{{ orderData.payTime || '--' }}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'WAIT_SHIP' || orderData.orderStatus === 'WAIT_RECEIVE'">
							<text class="text">支付方式:</text><text class="content" style="color: #795C98;">{{ orderData.payMethod | payMethodFilter }}</text>
						</view>
						<view class="logistics-information">
							<text class="text">运费:</text><text class="content">￥{{ orderData.expressCharge || '--' }}</text>
						</view>
						<view class="logistics-information">
							<text class="text">服务费:</text><text class="content">￥{{ orderData.serviceMoney || '--' }}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'FINISHED' || orderData.orderStatus === 'WAIT_PAYMENT'">
							<text class="text">应付金额:</text><text class="content">￥{{ orderData.payable || '--' }}</text>
						</view>
						<view class="logistics-information" v-if="orderData.orderStatus === 'WAIT_SHIP' || orderData.orderStatus === 'WAIT_RECEIVE'">
							<text class="text">实付金额:</text><text class="content">￥{{  orderData.payMoney || '--' }}</text>
						</view>
	      </view>
				 <!--  -->
				 

			 </view>
			 
		 </view>
		
	</view>
			
</template>

<script>
	import { infoDetail, byUser, infoConfirm, orderDetail } from '@/utils/network/api.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {
				noDataText: '暂无物流信息~',
				indexState:'',
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				formData:{
					purchaseId:''
				},
				orderData:{
					payable:'',
					payMoney:''
				},
				orderForm:[],
				skuIds:'',
				goodsNos:'',
				totalMoney:'',
				waybillList:[],  // 物流信息
				activeIndex:null, // 支付成功后跳转
				purchaseIdItem: '', // 点击弹窗获取的id
				timeout:null
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
		 	 	return '--'
		 	 }
		 },
		 orderLogistics(logisticsCompany) {
			 if (logisticsCompany === 'YTO_EXPRESS') {
				 return '圆通快递'
			 } else if (logisticsCompany === 'SF_EXPRESS') {
				 return '顺丰快递'
			 } else if (logisticsCompany === 'STO_EXPRESS') {
				 return '申通快递'
			 } else if (logisticsCompany === 'ZTO_EXPRESS') {
				 return '中通快递'
			 } else if (logisticsCompany === 'YUN_DA_EXPRESS') {
				 return '韵达快递'
			 }  else if (logisticsCompany === 'EMS') {
				 return '邮政快递'
			 }  else {
				 return '--'
			 }
		 },
		 payMethodFilter(payMethod) {
			 if (payMethod === 'ALIPAY') {
				 return '支付宝'
			 } else if (payMethod === 'WECHAT') {
				 return '微信'
			 } else {
				 return '--'
			 }
		 }
		},
		onLoad(options) {
			  this.activeIndex = parseInt(options.activeIndex)
				this.formData.purchaseId = options.id
				this.sendInfo()
		},
		methods: {
			// 返回
			goBack(){ 
			  if(this.activeIndex === 22){
					uni.navigateTo({
							 url: '/pages/order/myOrder'
					})
				}else{
					uni.navigateBack({})
				}
				
			},
			// 全部订单列表详情数据
			sendInfo(){
				wx.showLoading({
					title: '加载中',
					mask: true
				})
				 infoDetail(this.formData).then(res => {
						this.orderData = res.data
						this.orderData.payable = parseFloat(this.orderData.payable)
						this.orderData.payMoney = parseFloat(this.orderData.payMoney)
						this.orderForm = res.data.goodsInfoList
						this.waybillList = res.data.distributionInfo.logisticsDetails
				 })
				 setTimeout(function () {wx.hideLoading();}, 500);
			},
			// 付款
			fmony(orderId,payable){
				uni.navigateTo({
						url: '/pages/order/checkstand?orderId='+ orderId +'&payable=' + payable
				})
			},
			// 取消订单
			cancel(e){
				const that = this
				that.$refs.popupCancel.open()
				that.purchaseIdItem = e
			},
			confirmCancel(){
				const that = this
				byUser({purchaseId:that.purchaseIdItem}).then(res => {
					that.$refs.popupCancel.close()
					uni.showToast({icon: 'none',title: '取消订单成功'});
					clearTimeout(that.timeout);
					that.timeout = setTimeout(() => {
						uni.navigateTo({
							 url: '/pages/order/myOrder' 
						});	
					}, 1000);
					
				})
			},
			// 确认收货
			confirm(e){
				const that =this
				that.$refs.popupConfirm.open()
				that.purchaseIdItem = e
			},
			confirmCon(){
				const that = this
				infoConfirm({purchaseId:that.purchaseIdItem}).then(res => {
					that.$refs.popupConfirm.close()
					uni.showToast({icon: 'none',title: '确认收货成功'});
					clearTimeout(that.timeout);
					that.timeout = setTimeout(() => {
						uni.navigateTo({
							 url: '/pages/order/myOrder' 
						});	
					}, 1000);
				})
			},
			// 物流详情
			gologistics(waybillNumber,relationPhone){
				const vm = this
				console.log("电话号码:",relationPhone)
				uni.navigateTo({
				   url: '/pages/me/markets/after_sale/logistics?waybillNumber=' + waybillNumber + '&phoneNumber=' + relationPhone
				});
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
			},
			// 申请售后
			goSale(orderId){
				uni.navigateTo({
				    url: '/pages/order/afterSale?orderId=' + orderId
				});
			},
			//点击商品信息
			commodity(e){
				uni.navigateTo({
						 url: '/pages/classify/classList?id=' + e.currentTarget.dataset.id
				});
			},
			cancelOrder(){
				this.$refs.popup.open()
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
			// confirm() {
			// 	byUser(this.formData).then(res => {
			// 		uni.navigateTo({
			// 			url: '/pages/order/myOrder'
			// 		})
			// 	})
			// 	this.$refs.popup.close()
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.container /deep/.uni-popup__success{
		 color: #000000;
	}
	.container /deep/.uni-navbar--border{
		box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff;
	}
	.container{
		background: #f9f9f9;
		height: 100vh;
		.bottom-button{
		    z-index: 9999999;
		    position: fixed;
		    bottom: var(--window-bottom);
				background: #fff;
				backdrop-filter: blur(50rpx);
		    width: 100%;
		    height: 110rpx;
		    display: flex;
				.tel{
					font-size: 26rpx;
					display: flex;
					.icon{
						line-height: 48rpx;
						font-size: 48rpx;
						text-align: center;
						padding: 30rpx 16rpx 32rpx 32rpx;
						color: rgba(51,51,51,0.5);
						}
					.icon-txt{
						line-height: 37rpx;
						font-size: 26rpx;
						color: rgba(51,51,51,0.5);
						text-align: center;
						padding: 37rpx 0;
					}
				}
				.status{
					background: #eeeeee;
					display: flex;
					height: 100%;
					line-height: 110rpx;
					position: absolute;
					right: 0;
					text-align: center;
					.status-name{
						padding: 0 32rpx;
						font-size: 30rpx;
						color: #333333;
					}
				}
			}
		.main{
			position: relative;
			margin-top: 24rpx;
			padding-bottom: 124rpx;
			background: #f9f9f9;
			.main-box{
				margin: 0px 24rpx 24rpx;
				border-radius: 16rpx;
				background: #ffffff;
				padding: 24rpx 24rpx 0 24rpx;
					.information{
						font-size: 28rpx;
						line-height: 40rpx;
						margin-bottom: 24rpx;
						font-weight: 500;
					}
					.goods{
						.goods-list{
							padding: 24rpx 0 8rpx 0;
							position: relative;
							border-top: 1rpx solid #eeeeee;
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
									padding: 16rpx 0;
								  color: rgba(51,51,51,0.5);
								}
							}
						}
			}
			.logistics-information{
				font-size: 24rpx;
				font-weight: 400;
				color: rgba(51,51,51,0.50);
				display: flex;
				margin-bottom: 24rpx;
				.text{
					width: 120rpx;
					line-height: 30rpx;
				}
				.content{
					color: #333333;
				  padding-left: 36rpx;
					line-height: 30rpx;
				}
				.logistics-wl{
					width: 80%;
					padding: 0 24rpx;
					.logistics-kd{
						padding: 0  0 24rpx 0;
						border-bottom: 1rpx solid #EEEEEE;
						font-size: 24rpx;
						text{
							margin-right: 16rpx;
							color: rgba(51,51,51,0.50);
						}
					}
					.logistics-time{
						// margin-top: 24rpx;
						position: relative;
						font-size: 24rpx;
						/deep/ .cu-timeline>.cu-item {
							padding: 0rpx 30rpx 30rpx 120rpx;
						}
						/deep/ .cu-timeline:last-child .cu-item{
							padding: 0rpx 30rpx 0rpx 120rpx;
						}
						/deep/ .cu-timeline>.cu-item>.content {
							padding: 0;
							line-height: inherit;
							position: relative;
							p{
								padding-bottom: 8rpx;
							}
							text{
								color: rgba(51,51,51,0.50);
								padding-bottom: 24rpx;
								display: inline-block;
							}
						}
						.cu-timeline>.cu-item>.content:not([class*="bg-"]) {
							background-color: #FFFFFF;
							// border-bottom: 1rpx solid #EEEEEE;
						}
						/deep/ .cu-timeline>.first-item::after {
							top: 50%;
							height: 50%;
						}
						/deep/ .cu-timeline>.cu-item:not([class*="cuIcon-"])::before {
						    content: "";
						}
						/deep/ .cu-timeline>.cu-item::before {
						    font-family: "cuIcon";
						    display: block;
						    position: absolute;
						    top: 50%;
						    z-index: 9;
						    background-color: #fff;
						    width: 12rpx;
						    display: inline-block;
						    height: 12rpx;
						    text-align: center;
						    border: none;
						    line-height: 50rpx;
						    left: 52rpx;
						    border-radius: 50%;
						    border: 4rpx solid #e5e5e5;
								transform: translateY(-50%);
						}
						/deep/ .cu-timeline>.text-blue::before {
							border: 4rpx solid #795c98;
						}
					}
				}
			}
		}
		
	}
}

</style>
