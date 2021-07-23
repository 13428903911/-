<template>
	<view class="container">
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
		<!--  -->
		<view class="botton-status">
			<view class="status" v-if="allData.retreatStatus === 'SUPPLIER_REJECTED'" @click="openSale">平台介入</view>
			<view class="status" v-if="allData.retreatStatus === 'WAIT_RETURN' && allData.retreatType.name === 'REFUND_RETURN'" @click="openPop">填写运单号</view>
			<view class="status" v-if="allData.retreatStatus === 'WAIT_EXAMINE'" @click="withdraw">撤回</view>
		</view>
		<view class="main">
			<view class="main-box">
				<view class="information">商品信息</view>
				<view class="goods">
					<view class="goods-list" v-for="(item,index) in goodsList" :key="index">
						<view class="goods-img">
							<image :src="imgObs + item.goodsPhoto" mode="aspectFill"></image>
						</view>
						<view class="goods-name">
							<view class="goods-name-txt">{{item.goodsName}}</view>
							<view class="goods-sku">
								<view class="sku-list" v-for="(s,index) in item.goodsDetailList" :key="index">
									<view class="sku-name">{{s.goodsSpecs}}</view>
									<view class="sku-price">单价：<text style="color: #333333;">￥{{s.goodsPrice || '0'}}</text></view>
									<view class="sku-num">x{{s.goodsNum}}</view>
								</view>
							</view>
							<view class="subtotal">
								小计：<text style="color:#333333">￥{{item.totalGoodsMoney || '0'}}</text>
							</view>
						</view>
					</view>
					<view class="price-money">
						<view class="serve"><text style="color: rgba(51,51,51,0.5);">服务费：</text>￥{{allData.serviceMoney || '0'}}</view>
						<view class="freight"><text style="color: rgba(51,51,51,0.5);">运费：</text>￥{{allData.freightMoney || '0'}}</view>
					</view>
					<view class="price-num">订单总金额：￥{{allData.orderTotalMoney || '0'}}</view>
				</view>
			</view>
			<!--  -->
			<view class="main-box" style="padding-bottom: 2rpx">
			 	<view class="information">售后信息</view>
				<view class="logistics-information">
					<text class="text">售后单号:</text><text class="content">{{allData.retreatId || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">售后状态:</text><text class="content" style="color: #795C98;">{{allData.retreatStatusValue || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">联系电话:</text><text class="content">{{allData.relationPhone || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">退款类型:</text><text class="content">{{allData.retreatType.description || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">申请时间:</text><text class="content">{{allData.createTime || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">退款原因:</text><text class="content">{{allData.retreatReason || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">退款备注:</text><text class="content">{{allData.remark || '--'}}</text>
				</view>
			</view>
			<!--  -->
			<view class="main-box" style="padding-bottom: 2rpx">
			 	<view class="information">订单信息</view>
				<view class="logistics-information">
					<text class="text">订单号:</text><text class="content">{{allData.purchaseId || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">交易单号:</text><text class="content">{{allData.tradeNum || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">联系电话:</text><text class="content">{{allData.relationPhone || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">下单时间:</text><text class="content">{{allData.placeTime || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">支付时间:</text><text class="content">{{allData.payTime || '--'}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">支付方式:</text><text class="content">{{allData.payMethod | payMethodFilter}}</text>
				</view>
				<view class="logistics-information">
					<text class="text">退款金额:</text><text class="content" style="font-weight: 500;">￥{{allData.refundMoney + ' (不含运费)' || '0'}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { selectDetail , saleCancel ,updateStatusAndLogisticsInfo ,applyPlatformHandle} from '@/utils/network/api.js'
 export default {
	 data() {
		 return {
			 imgObs: process.env.VUE_APP_OBS_FILE_API,
			 retreatId:'',// 售后订单
			 allData:{ // 全部信息
				 orderTotalMoney:'', // 订单总金额
				 serviceMoney:'' // 服务费
			 } ,
			 goodsList:[], // 商品列表
			 logisticsInfo: {
			 	waybillNumber: "",
			 	retreatId:''
			 },
		 }
	 },
	 filters:{
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
	 	const that = this
		that.retreatId = options.id
		that.getData()
	 },
	 methods:{
		 goBack(){
		 	uni.navigateBack({})
		 },
		 // 收货单数据
		 getData(){
			 const that = this
			 selectDetail({retreatId:that.retreatId}).then(res => {
	       that.allData = res.data
				 that.allData.orderTotalMoney = parseFloat(that.allData.orderTotalMoney)
				 that.allData.serviceMoney = parseFloat(that.allData.serviceMoney)
				 that.goodsList = res.data.goodsList
			 })
		 },
		 // 撤回
		 withdraw(){
		 	const that = this
		 	saleCancel({retreatId:that.retreatId}).then(res => {
		 		uni.showToast({title: "撤回成功!", icon:'none'})
				uni.navigateBack({})
		 	})
		 },
		 // 打开发货弹窗
		 openPop(){
		 	const that = this
			that.logisticsInfo.retreatId = that.retreatId
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
			// 		title:"运单号不能为空" ,
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
				uni.showToast({title: "发货成功!", icon:'none'})
		 		that.$refs.popup.close()
		 		uni.navigateBack({})
		 	})
		 },
		 // 平台介入
		 openSale(){
		 	const that = this
		 	that.$refs.popupSale.open()
		 },
		 closeSale(){
		 	const that = this
		 	that.$refs.popupSale.close()
		 },
		 confirmSale(){
		 	const that = this
		 	applyPlatformHandle({retreatId:that.retreatId}).then(res => {
		 		that.$refs.popupSale.close()
		 		uni.showToast({title: "申请平台介入成功!", icon:'none'})
				uni.navigateBack({})
		 	})	
		 },
	 }
 }
</script>

<style lang="scss" scoped>
	.container /deep/.uni-popup__success{
		 color: #000000;
	}
	.container /deep/.uni-navbar--border{
		border: none;
		box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff; 
		}
	.container{
		background: #f9f9f9;
		height: 100vh;
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
		.botton-status{
			position: fixed;
			bottom: 0;
			right: 0;
			width: 100%;
			display: flex;
			justify-content: flex-end;
			// backdrop-filter: blur(50rpx);
			background: rgba(255,255,255,1);
			.status{
				padding: 33rpx 32rpx;
				line-height: 42rpx;
				font-size: 30rpx;
				background: #eee;
			}
		}
		.main{
			background: #f9f9f9;
			padding: 0 24rpx 134rpx 24rpx;
			.main-box{
				margin: 24rpx 0;
				border-radius: 16rpx;
				background: #ffffff;
				padding: 24rpx;
				.information{
					font-size: 28rpx;
					line-height: 40rpx;
					margin-bottom: 24rpx;
					font-weight: 500;
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
				.price-money{
				 	display: flex;
					justify-content: flex-end;
					line-height: 33rpx;
					font-size: 24rpx;
					padding: 24rpx 0;
				 	.serve{}
				 	.freight{
						padding-left: 24rpx;
					}
				}
				 .price-num{
					 text-align: right;
					 line-height: 33rpx;
					 font-size: 28rpx;
					 font-weight: 500;
				 }
			}
		}
	}
</style>
