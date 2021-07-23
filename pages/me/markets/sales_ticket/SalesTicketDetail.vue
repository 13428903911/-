<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar shadow>
			<view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">销售单详情</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="detail-stautus">
			<view class="detail-img">
				<image class="imsges" src="../../../../static/me/bg_shape.png"></image>
			</view>
			<view class="title-text bold">
				<view>{{salesSnitTxtx}}</view>
				<view class="time"  v-if="orderData.orderStatus === 'WAIT_PAYMENT' || orderData.orderStatus === 'SHIPPED'">
				<text>剩余时间：</text>
				<text v-if="orderData.orderStatus === 'WAIT_PAYMENT'">{{lefth}}小时{{leftm}}分钟</text>
					<text v-if="orderData.orderStatus === 'SHIPPED'">{{leftd}}天{{lefth}}小时自动确认收货</text>
				</view>
			</view>
		</view>
		<!-- 商品信息 -->
		<view class="sales-main">
			<view class="header-title" v-for="(item,index) in orderData.orderSkuList" :key="index" :data-id='item.skuId'
				@click.stop="orderDetails">
				<view class="header-text">
					<view>商品信息</view>
				</view>
				<view class="header-center">
					<view class="list-img">
						<image :src="imgObs+item.skuImage" mode=""></image>
					</view>
					<view class="header-nr">
						<p class="header-tit">{{item.skuName || ''}}</p>
						<view>
							<view class="Specification">
								<text>{{item.skuSpec || ''}}</text>
								<!-- <text style="margin-left: 10rpx;">L码</text> -->
							</view>
							<view class="price-amount">
								<text class="price">￥{{item.skuPrice || ''}}/件</text>
								<text class="amount">x{{item.skuNum || ''}}</text>
							</view>
						</view>
					</view>
				</view>
		<!-- 	<view class="close">
				<view class="goods-count-price">
					<view class="goods-price">
						<view>商品总价</view>
						<view>￥{{orderData.totalMoney || ''}}</view>
					</view>
					<view class="goods-price">
						<view>运费</view>
						<view>￥0.00</view>
					</view>
				</view>
				<view class="close-goods">
					<view>共计<text class="count">{{orderData.goodsCount || ''}}</text>件商品，合计<text class="total-price bold">￥{{orderData.totalMoney || ''}}</text>
					</view>
				</view>
			</view> -->
			</view>
<!-- 		<view class="sales-inform" v-if="orderData.orderStatus === 'WAIT_PAYMENT' && orderData.orderAddres">
			<view class="title">物流信息</view>
			<view class="recipients">
				<text>收件人:</text><text class="content" style="margin-left: 82rpx;">{{orderData.orderAddress.name || ''}}</text>
			</view>
			<view class="recipients phone">
				<text>联系电话:</text><text class="content" style="color: #795C98;"> {{orderData.orderAddress.telephone || ''}}</text>
			</view>
			<view class="recipients">
				<text>收货地址:</text><text class="content">{{orderData.orderAddress.address || ''}}</text>
			</view>
		</view> -->
		<!-- 订单信息 -->
	<!-- 	<view class="order-information">
			<view class="order-information-title">订单信息</view>
			<view class="logistics-information" v-if="orderData.statusName == '待提货'">
				<text>取件码:</text><text class="content" style="margin-left: 82rpx;">{{orderData.pickupNumber || ''}}</text>
			</view> -->
	<!-- 		<view class="logistics-information" v-if="!orderData.logisticsType">
				<view>收件人信息:</view>
				<view class="location-copy">
					<view class="location">
						<view>{{orderData.orderAddress.name || ''}} {{orderData.orderAddress.telephone || ''}}</view>
						<view>{{orderData.orderAddress.address || ''}}</view>
					</view>
					<view class="location-txt" @click="clickCopy">复制</view>
				</view>
			</view> -->
<!-- 			<view class="logistics-information">
				<text>订单编号:</text><text class="content">{{orderData.orderId || ''}}</text>
			</view>
			<view class="logistics-information">
				<text>订单状态:</text><text class="content" style="color: #795C98;">{{orderData.statusName || ''}}</text>
			</view>
			<view class="logistics-information">
				<text>下单时间:</text><text class="content">{{orderData.createTime || ''}}</text>
			</view>
			<view v-if="orderData.statusName !== '待付款'">
				<view class="logistics-information">
					<text>支付时间:</text><text class="content">{{orderData.payTime || ''}}</text>
				</view>
				<view class="logistics-information" v-if="orderData.statusName == '已取消'">
					<text>取消原因:</text><text class="content">{{orderData.cancelReason || ''}}</text>
				</view>
				<view class="logistics-information" v-else>
					<text>交易单号:</text><text class="content">{{orderData.transactionId || ''}}</text>
				</view>
			</view> -->
			<!-- 物流信息 -->
	<!-- 		<view class="logistics-information">
				<text >物流信息:</text>
				<text class="content" v-if="!orderData.orderAddress.logisticsInfo.logisticsDetails.length">暂无物流信息</text>
				<view class="logistics-wl" v-else>
					<view class="logistics-time">
						<view class="cu-timeline first-item" 
						v-for="(item,index) in orderData.orderAddress.logisticsInfo.logisticsDetails" :key="index"
						:class="(index + 1) % orderData.orderAddress.logisticsInfo.logisticsDetails.length == 0 ?'altve':''">
							<view class="cu-item text-blue">
								<view class="content">
									<p>{{item.time || ''}}</p>
									<text>{{item.status || ''}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view> -->
		<!-- </view> -->
			<!-- 物流信息 -->
			<details-card 
			:cardList="logisticsList" 
			@clickCopy="clickCopy" 
			v-if="orderData.orderStatus == 'WAIT_PICKUP' || orderData.orderStatus == 'CANCELLED' || orderData.orderStatus === 'CLOSED' ? false : true"/>
			<!-- 订单信息 -->
			<details-card :cardList="cardList"/>
			<!-- 支付信息 -->
			<details-card :cardList="paymentList" v-if="orderData.orderStatus == 'CANCELLED' || orderData.orderStatus === 'CLOSED' ? false : true"/>
		</view>
		<!-- <view class="sales-inform">
			<view class="title">支付信息</view>
			<view class="recipients">
				<text>应付金额:</text><text class="content" style="color: #795C98;">￥{{orderData.totalMoney || ''}}</text>
			</view>
		</view> -->
		<!-- 立即发货 -->
		<view class="btn-group" v-if="orderData.orderStatus === 'WAIT_SHIP'">
			<button type="button" class="btn-primary" @click="TheDelivery">立即发货</button>
		</view>
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
					<button type="button" class="btn-primary" @click="Delivery">发货</button>
					<button type="button" class="btn-normal" @click="$refs.popup.close()">驳回</button>
				</view>
			</view>
		</uni-popup>	
	</view>
</template>

<script>
	import {	sellStatu,filterStatus} from '@/utils/status.js'
	import {	getAfterketDetail} from '@/utils/network/aftermarket.js'
	import detailsCard from '@/components/details-card/details-card.vue'
	export default {
		components:{detailsCard},
		data() {
			return {
				orderData: {},
				leftd: '',
				lefth: '00',
				leftm: '00',
				salesSnitTxtx: '',
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				cardList:{},
				paymentList: {},
				logisticsList: {}
			}
		},
		onLoad(options) {
			this.gitsalesDetail(options.id)
		},
		methods: {
			// 立即发货
			TheDelivery() {
				this.$refs.popup.open()
			},
		  showtime() {
				const vm = this
		    var nowtime = new Date(), //获取当前时间
		     tieml = new Date(Date.parse(this.orderData.createTime.replace(/-/g, '/'))); //定义结束时间
		    // let endtime = new Date((tieml / 1000 + 600) * 1000) // 选择后加一天
		    let endtime = new Date((tieml / 1000 + 604800) * 1000) // 选择后加一天
		    var lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
		     leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
		     lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24), //计算小时数
		     leftm = Math.floor(lefttime / (1000 * 60) % 60), //计算分钟数
		     lefts = Math.floor(lefttime / 1000 % 60); //计算秒数
		    if (lefth <= 0 && leftm <= 0) {
		     this.lefth = '00'
		     this.leftm = '00'
		     //返回倒计时的字符串
		     return;
		    }
		    this.lefth = lefth < 10 ? ('0' + lefth) : lefth
		    this.leftm = leftm < 10 ? ('0' + leftm) : leftm
				this.leftd = leftd
		   },
			// 复制
			clickCopy() {
				const vm = this
				const copyList = vm.orderData.orderAddress.name + vm.orderData.orderAddress.telephone + vm.orderData.orderAddress.address
				 console.log("复制的内容:",copyList)
				 uni.setClipboardData({
						data:copyList,//要被复制的内容
						success:()=>{//复制成功的回调函数
							uni.showToast({	title:'复制成功',icon:'none'	})
						}
					})
			},
			gitsalesDetail(id) {
				const vm = this
				getAfterketDetail(id).then(res => {
					vm.orderData = res.data
					const status = vm.orderData.orderStatus
					vm.orderData.statusName = filterStatus(status, sellStatu)
					 if (this.orderData.orderStatus === 'WAIT_PAYMENT') { // 待付款
						 vm.salesSnitTxtx = '等待付款'
						 this.showtime()
						 setInterval(() => {
							this.showtime()
						 }, 1000 * 60)
						 vm.logisticsList = { // 物流数据
							 title:'物流信息' ,
							 status: vm.orderData.orderStatus,
							 list:[
								{ label:'收件人:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.name : '' },
								{ label:'联系电话:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.telephone : '' },
								{ label:'收货地址:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.address : '' },
							 ]
						 }
						 vm.cardList = { // 订单数据
							title:'订单信息' ,
							status: vm.orderData.orderStatus,
							list:[
								{ label:'订单编号:',value: vm.orderData.orderId },
								{ label:'创建时间:', value: vm.orderData.createTime },
								{ label:'备注:', value: vm.orderData.remark || '' },
							]
						 }
						 vm.paymentList = { // 支付数据
							 title:'支付信息' ,
							 status: vm.orderData.orderStatus,
							 list:[
									{ label:'应付金额:',value: '￥'+ vm.orderData.payableMoney ? vm.orderData.payableMoney : '' },
							 ]
						 }
					 }
					 if (this.orderData.orderStatus === 'WAIT_SHIP') { // 待发货
					 		vm.salesSnitTxtx = '待发货'		
							vm.logisticsList = { // 物流数据
								 title:'物流信息' ,
								 status: vm.orderData.orderStatus,
								 list:[
									{ label:'收件人:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.name : '' },
									{ label:'联系电话:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.telephone : '' },
									{ label:'收货地址:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.address : '' },
								 ]
							}
							vm.cardList = { // 订单数据
									title:'订单信息' ,
									status: vm.orderData.orderStatus,
									list:[
										{ label:'订单编号:',value: vm.orderData.orderId },
										{ label:'创建时间:', value: vm.orderData.createTime },
										{ label:'备注:', value: vm.orderData.remark || '' },
									]
							}
							vm.paymentList = { // 支付数据
								 title:'支付信息' ,
								 status: vm.orderData.orderStatus,
								 list:[
									{ label:'交易单号:',value: vm.orderData.transactionId },
									{ label:'支付时间:',value: vm.orderData.payTime },
									{ label:'支付方式:',value: vm.orderData.payMethod ? vm.orderData.payMethod.name : ''},
									{ label:'应付金额:',value: '￥'+ vm.orderData.payableMoney ? vm.orderData.payableMoney : '' },
									{ label:'实付金额:',value: '￥'+ vm.orderData.payMoney ? vm.orderData.payMoney : '' },
								 ]
							}
					 }
					 if (this.orderData.orderStatus === 'SHIPPED') { // 待收货
					 		vm.salesSnitTxtx = '待收货'	
							this.showtime()
							setInterval(() => {
								this.showtime()
							}, 1000 * 60)
							vm.logisticsList = { // 物流数据
								 title:'物流信息' ,
								 status: vm.orderData.orderStatus,
								 logisticsInfo:  vm.orderData.orderAddress.logisticsInfoVO ? vm.orderData.orderAddress.logisticsInfoVO.logisticsDetails : '',
								 list:[
									{ label:'收件人:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.name : '' },
									{ label:'联系电话:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.telephone : '' },
									{ label:'收货地址:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.address : '' },
									{ label:'物流公司:',value: vm.orderData.orderAddress.logisticsCompany || '' },
									{ label:'物流单号:',value: vm.orderData.orderAddress.logisticsInfoVO ? vm.orderData.orderAddress.logisticsInfoVO.number : '' }
								 ]
							}
							vm.cardList = { // 订单数据
								title:'订单信息' ,
									status: vm.orderData.orderStatus,
									list:[
										{ label:'订单编号:',value: vm.orderData.orderId },
										{ label:'创建时间:', value: vm.orderData.createTime },
										{ label:'发货时间:', value: vm.orderData.shipTime },
										{ label:'备注:', value: vm.orderData.remark || '' },
									]
							}
							vm.paymentList = { // 支付数据
								 title:'支付信息' ,
								 status: vm.orderData.orderStatus,
								 list:[
									{ label:'交易单号:',value: vm.orderData.transactionId },
									{ label:'支付时间:',value: vm.orderData.payTime },
									{ label:'支付方式:',value: vm.orderData.payMethod ? vm.orderData.payMethod.name : ''},
									{ label:'应付金额:',value: '￥'+ vm.orderData.payableMoney ? vm.orderData.payableMoney : '' },
									{ label:'实付金额:',value: '￥'+ vm.orderData.payMoney ? vm.orderData.payMoney : '' },
								 ]
							}
					 }
					 if (this.orderData.orderStatus === 'WAIT_PICKUP') { // 待提货
					 		vm.salesSnitTxtx = '待客户提货'	
							vm.cardList = { // 订单数据
								title:'订单信息' ,
									status: vm.orderData.orderStatus,
									list:[
										{ label:'订单编号:',value: vm.orderData.orderId },
										{ label:'创建时间:', value: vm.orderData.createTime },
										{ label:'备注:', value: vm.orderData.remark || '' },
									]
							}
							vm.paymentList = { // 支付数据
								 title:'支付信息' ,
								 status: vm.orderData.orderStatus,
								 list:[
									{ label:'交易单号:',value: vm.orderData.transactionId },
									{ label:'支付时间:',value: vm.orderData.payTime },
									{ label:'支付方式:',value: vm.orderData.payMethod ? vm.orderData.payMethod.name : ''},
									{ label:'应付金额:',value: '￥'+ vm.orderData.payableMoney ? vm.orderData.payableMoney : '' },
									{ label:'实付金额:',value: '￥'+ vm.orderData.payMoney ? vm.orderData.payMoney : '' },
								 ]
							}
					 }
					  if (this.orderData.orderStatus === 'FINISHED') { // 已完成
							vm.salesSnitTxtx = '订单已完成'
							vm.logisticsList = { // 物流数据
								 title:'物流信息' ,
								 status: vm.orderData.orderStatus,
								 logisticsInfo:  vm.orderData.orderAddress.logisticsInfoVO ? vm.orderData.orderAddress.logisticsInfoVO.logisticsDetails : '',
								 list:[
									{ label:'收件人:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.name : '' },
									{ label:'联系电话:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.telephone : '' },
									{ label:'收货地址:',value: vm.orderData.orderAddress ? vm.orderData.orderAddress.address : '' },
									{ label:'物流公司:',value: vm.orderData.orderAddress.logisticsCompany || '' },
									{ label:'物流单号:',value: vm.orderData.orderAddress.logisticsInfoVO ? vm.orderData.orderAddress.logisticsInfoVO.number : '' }
								 ]
							}
							vm.cardList = { // 订单数据
								title:'订单信息' ,
									status: vm.orderData.orderStatus,
									list:[
										{ label:'订单编号:',value: vm.orderData.orderId },
										{ label:'创建时间:', value: vm.orderData.createTime },
										{ label:'发货时间:', value: vm.orderData.shipTime },
										{ label:'完成时间:', value: vm.orderData.receiptTime || '' },
										{ label:'备注:', value: vm.orderData.remark || '' },
									]
							}
							vm.paymentList = { // 支付数据
								 title:'支付信息' ,
								 status: vm.orderData.orderStatus,
								 list:[
									{ label:'交易单号:',value: vm.orderData.transactionId },
									{ label:'支付时间:',value: vm.orderData.payTime || '' },
									{ label:'支付方式:',value: vm.orderData.payMethod ? vm.orderData.payMethod.name : ''},
									{ label:'应付金额:',value: '￥'+ vm.orderData.payableMoney ? vm.orderData.payableMoney : '' },
									{ label:'实付金额:',value: '￥'+ vm.orderData.payMoney ? vm.orderData.payMoney : '' },
								 ]
							}
						}
						if (this.orderData.orderStatus === 'CANCELLED') { // 已取消
						 	vm.salesSnitTxtx = '用户取消，交易关闭'
							vm.cardList = { // 订单数据
								title:'订单信息' ,
									status: vm.orderData.orderStatus,
									list:[
										{ label:'订单编号:',value: vm.orderData.orderId },
										{ label:'创建时间:', value: vm.orderData.createTime },
										{ label:'关闭时间:', value: vm.orderData.closeTime },
										{ label:'备注:', value: vm.orderData.remark || '' },
									]
							}
						}
						if (this.orderData.orderStatus === 'CLOSED') { // 已关闭
							vm.salesSnitTxtx = '超时未付款，交易关闭'
							vm.cardList = { // 订单数据
								title:'订单信息' ,
									status: vm.orderData.orderStatus,
									list:[
										{ label:'订单编号:',value: vm.orderData.orderId },
										{ label:'创建时间:', value: vm.orderData.createTime },
										{ label:'关闭时间:', value: vm.orderData.closeTime },
										{ label:'备注:', value: vm.orderData.remark || '' },
									]
							}
						}
					if (this.orderData.orderStatus === 'AFTER_SALE_CLOSE') { // 退款完成，已关闭
						vm.salesSnitTxtx = '退款完成，交易关闭'
						vm.cardList = { // 订单数据
							title:'订单信息' ,
								status: vm.orderData.orderStatus,
								list:[
									{ label:'订单编号:',value: vm.orderData.orderId },
									{ label:'创建时间:', value: vm.orderData.createTime },
									{ label:'关闭时间:', value: vm.orderData.closeTime },
									{ label:'备注:', value: vm.orderData.remark || '' },
								]
						}
					}
				})
			},
			// 返回上一页
			clickBack() {
				uni.navigateTo({
					url:'./SalesTicket'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.contont {
		font-weight: 400;
		.search {
			background-color: #ffffff;
			display: flex;
			width: 696rpx;
			position: relative;
			left: 0rpx;
			bottom: 0rpx;

			.iconfont {
				font-size: 48rpx;
			}

			text {
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: rgba(0, 0, 0, 0.85);
				line-height: 48rpx;
				margin: auto;
			}
		}
		.detail-stautus{
			position: relative;
			margin-top: 24rpx;
			.detail-img{
				width: 702rpx;
				height: 140rpx;
				margin: auto;
				.imsges{
					width: 100%;
					height: 100%;
				}
			}
			.title-text{
				color: #FFFFFF;
				font-size: 30rpx;
				position: absolute;
				top:0;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.time{
					margin-top:8rpx;
					font-size: 20rpx;
					letter-spacing:1rpx;
				}
			}
		}

		// 商品样式
		.sales-main{
			margin-bottom: 136rpx;
			.header-title {
				margin: 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				padding: 24rpx;
			
				.header-text {
					height: 40rpx;
					opacity: 1;
					font-size: 28rpx;
					font-weight: 400;
					text-align: left;
					line-height: 40rpx;
					padding-bottom: 24rpx;
				}
			
				.header-center {
					padding: 24rpx 0;
					border-top: 2rpx solid #EEEEEE;
					// border-bottom: 2rpx solid #eeeeee;
					display: flex;
			
					.list-img {
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
			
						.Specification {
							height: 36rpx;
							opacity: 1;
							font-size: 26rpx;
							font-weight: 400;
							text-align: left;
							color: rgba(51, 51, 51, 0.50);
							// line-height: 36rpx;
							margin: 8rpx 0;
						}
			
						.price-amount {
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
			
				// 商品总计-合计
				.close {
					.goods-count-price {
						padding-top: 24rpx;
						font-size: 26rpx;
						font-weight: 400;
			
						.goods-price {
							margin-bottom: 24rpx;
							display: flex;
							justify-content: space-between;
						}
					}
			
					.close-goods {
						text-align: right;
						height: 37rpx;
						opacity: 1;
						font-size: 26rpx;
						font-weight: 400;
						text-align: right;
						color: #333333;
						line-height: 37rpx;
			
						.count {
							color: rgba(51, 51, 51, 0.50);
							padding: 0 8rpx;
						}
			
						.total-price {
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
				}
			}
		}

		// 物流信息
		.sales-inform{
			margin: 0 24rpx 24rpx 24rpx;
			padding: 24rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			.title{
				font-size: 30rpx;
				margin-bottom:24rpx;
			}
			.recipients{
				font-size: 26rpx;
				color: rgba(51,51,51,0.50);
				.content{
					margin-left: 56rpx;
					color: #333333;
				}
			}
			.phone{
				margin: 24rpx 0;
			}
		}
		// 订单样式
		.order-information {
			margin: 0 24rpx 24rpx 24rpx;
			padding: 24rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;

			.order-information-title {
				font-size: 30rpx;
				font-weight: 400;
				height: 42rpx;
				padding-bottom: 24rpx;
			}

			.logistics-information {
				font-size: 26rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 0.50);
				display: flex;
				margin-bottom: 24rpx;

				.content {
					color: #333333;
					margin-left: 56rpx;
				}

				.location-copy {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.location {
						color: #333333;
						width: 353rpx;
						margin-left: 30rpx;
					}

					.location-txt {
						margin-left: 80rpx;
						color: #795c98;
					}
				}
				//  物流样式
				.logistics-wl{
					width: 527rpx;
					padding-top: 0;
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
							padding: 0rpx 0 0rpx 24rpx;
						}
						/deep/ .cu-timeline:last-child .cu-item{
							padding: 0rpx 0rpx 0rpx 24rpx;
						}
						/deep/ .cu-timeline>.cu-item>.content {
							padding: 0;
							line-height: inherit;
							color: rgba(51,51,51,0.50);
							p{
								padding-bottom: 8rpx;
							}
							text{
								padding-bottom: 24rpx;
								display: inline-block;
							}
						}
						/deep/ .cu-timeline>.cu-item>.content:not([class*="bg-"]) {
							background-color: #FFFFFF;
							// border-bottom: 1rpx solid #EEEEEE;
						}
						/deep/ .cu-timeline>.cu-item::before {
							top: 21%;
							transform: translateY(-50%);
						}
						
						// 最后一个样式
						/deep/ .altve>.cu-item::after {
							height: 50% !important;
						}
						
						
						/deep/ .first-item>.cu-item::after {
							top: 20rpx;
						}
						/deep/ .cu-timeline>.cu-item:not([class*="cuIcon-"])::before {
						    content: "";
						}
						/deep/ .cu-timeline>.cu-item::before {
						    font-family: "cuIcon";
						    display: block;
						    position: absolute;
						    top: 38rpx;
						    z-index: 9;
						    background-color: #fff;
						    width: 12rpx;
						    display: inline-block;
						    height: 12rpx;
						    text-align: center;
						    border: none;
						    line-height: 50rpx;
						    left: 51rpx;
						    border-radius: 50%;
						    border: 4rpx solid #e5e5e5;
						}
						/deep/ .cu-timeline>.text-blue::before {
							border: 4rpx solid rgba(51,51,51,0.26);
						}
						.cu-timeline:first-child{
							/deep/ .text-blue::before{
								 border: 4rpx solid #795C98;
							}
							.content{
								color: #333333;	
							}
						 }
					}
				}
			}
		}
	}
	// 按钮样式
	.btn-group {
		width: 94%;
		position: fixed;
		bottom: 0;
		padding:24rpx;
		border-top: 1rpx solid #eeeeee;
		background-color: #FFFFFF;
		overflow: hidden;
		button {
			float: right;
			padding: 11rpx 12px;
			border-radius: 30px;
			font-size: 30rpx;
			color: #fff;
			line-height: 22px;
		}
		.btn-primary {
			background-color: #795c98;
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
	
</style>
