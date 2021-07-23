<template>
	<view class="container">
		<uni-nav-bar left-icon="back"  title="售后申请" fixed statusBar color="rgba(0,0,0,0.85)" @clickLeft="goBack"></uni-nav-bar>
		<view class="bottom-button">
			<view class="button-box">
				<view class="button-price">退款总金额: ￥{{ refundMoney }}</view>
				<view class="button-submit" @click="subimt">提交申请</view>
			</view>
		</view>
		<view class="main" style="margin-top: 24rpx;">
					 <view >
					 	 <view class="main-box">
								<view class="information">商品信息</view>
								<view class="goods">
										<view class="goods-list" v-for="item in orderForm" :key="item.goodsId">
											 <view class="goods-img">
												 <image :src="imgObs + item.goodsPhoto" mode="aspectFill"></image>
											 </view>
											 <view class="goods-name">
												 <view class="goods-name-txt">
													{{ item.goodsName }}
												 </view >
												 <view class="goods-sku" v-for="i in item.goodsDetailList" :key="i.goodsId">
													 <view class="sku-list">
														 <view class="sku-name">{{ i.goodsSpecs }}</view>
														 <view class="sku-price">单价:<text style="color: #333333;">￥{{ i.goodsPrice }}</text></view>
														 <view class="sku-num">x{{ i.goodsNum }}</view>
													 </view>
												 </view>
												 <view class="subtotal">
													小计：<text style="color:#333333">￥{{ item.goodsMoney }}</text>
												 </view>
												</view>
											</view>
										</view>
										<!--  -->
										<view class="from-data">
											<view class="logistics-information">
												<text class="text">退款总金额:</text><text class="content">￥{{ refundMoney }}</text>
											</view>
											<view class="logistics-information">
												<view class="text">退款类型:</view>
												<view class="content" style="width: 466rpx;height: 40rpx;display: flex;">
													<picker  @change="bindPickerChange($event,array)" :range="array" :value="index" :range-key="'value'" style="position: relative;left: 0;width: 100%;">
															<view style="float: left;">{{array[index].value}}</view>
															<view class="iconfont" style="float: right;color: #cccccc;">&#xe61a;</view>
													</picker>
												</view>
											</view>
											<view class="logistics-information">
												<view class="text">退款原因:</view>
												<view class="content" style="width: 466rpx;height: 40rpx;display: flex;">
													<picker  @change="bindPickerChange2($event,array2)" :range="array2" :value="index2" :range-key="'value'" style="position: relative;left: 0;width: 100%;">
															<view style="float: left;">{{array2[index2].value}}</view>
															<view class="iconfont" style="float: right;color: #cccccc;">&#xe61a;</view>
													</picker>
												</view>
											</view>
											<!-- <view class="logistics-information">
												<text class="text">申请时间:</text><text class="content">2017-01-15 14:35:08</text>
											</view> -->
											<view class="logistics-information">
												<text class="text">备注信息:</text><uni-easyinput type="textarea" autoHeight v-model="remark" placeholder="请输入备注信息" class="input" @input="remarkValue"></uni-easyinput>
											</view>
										</view>
									
								</view>
					 	 </view>
					 </view>
				</view>
	</view>
</template>

<script>
	import { infoDetail, createReturnOrder } from '@/utils/network/api.js'
	export default {
		data(){
			return {
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				index:0,
				index2:0,
				// array:[{id:'REFUND',value:'仅退款'},{id:'REFUND_RETURN',value:'退货退款'}],
				array:[{id:'REFUND_RETURN',value:'退货退款'}],
				array2:[{id:1,value:'不想要了'},{id:2,value:'拍错了'},{id:3,value:'其它'}],
				retreatType:'REFUND_RETURN', // 退货类型
				retreatReason:'不想要了', // 退货原因
				remark:'', // 备注
				purchaseId:'', // 采购单号
				refundMoney:'', // 退款金额
				orderForm:[] // 商品列表
			}
		},
		onLoad(options){
			if(options.orderId){
				this.purchaseId = options.orderId
			}
			this.getGoodsData()
		},
		methods:{
			// 订单商品信息
			getGoodsData(){
				infoDetail({purchaseId:this.purchaseId}).then(res => {
					this.refundMoney  = parseFloat(res.data.refundMoney)
					this.orderForm = res.data.goodsInfoList
				})
			},
			// 申请
			subimt(){
				const params = {
					purchaseId:this.purchaseId,
					retreatType:this.retreatType,
					retreatReason:this.retreatReason,
					remark:this.remark
				}
				createReturnOrder(params).then(res => {
					uni.navigateTo({
					   url: '/pages/sales/sales' 
					});
				})
				// if(this.remark === ''){
				// 	uni.showToast({title: "请输入备注信息", icon:'none'})
				// }else{
					
				// }
			},
			// 备注
			remarkValue(e){
				this.remark = e
			},
			// 退款类型
			bindPickerChange(e,s) {
				const that = this
				that.index = e.target.value
				that.retreatType = s[this.index].value
				if(that.retreatType === '仅退款'){
				that.retreatType = 'REFUND'
				}else{
				that.retreatType = 'REFUND_RETURN'
				}
				// console.log('退款类型',that.index,that.retreatType)
			 },
			 // 退款原因
			bindPickerChange2(e,s) {
				 this.index2 = e.target.value
				 this.retreatReason	 = s[this.index2].value
				 // console.log('退款原因', this.index2,this.pickerData2)
			 },
			 // 返回
			 goBack(){
				 uni.navigateBack({})
			 }
		}
	}
</script>

<style lang="scss" scoped>
	.container /deep/.uni-navbar--border{box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff; }
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
			  .button-box{
					position: absolute;
					right: 0;
					display: flex;
					.button-submit{
						line-height: 110rpx;
						padding: 0 32rpx;
						background: #795C98;
						color: #ffffff;
						font-size: 30rpx;
					}
					.button-price{
						line-height: 110rpx;
						color: #333333;
						font-size: 28rpx;
						font-weight: 500;
						padding-right: 24rpx;
					}
				}
					
				
				
			}
			.main{
					background: #f9f9f9;
					position: relative;
					margin-bottom: 134rpx;
					.main-box{
						margin: 0 24rpx 24rpx;
						border-radius: 16rpx;
						background: #ffffff;
						padding: 24rpx 24rpx 2rpx 24rpx;
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
											display: block;
											max-width: 100%;
											height: 100%;
											width: 100%;
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
					.from-data{
						padding-top: 72rpx;
					}
					.logistics-information{
						line-height: 40rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: rgba(51,51,51,0.50);
						display: flex;
						padding: 12rpx 0;
						margin-bottom: 24rpx;
						.text{
							width: 150rpx;
						}
						.content{
							color: #333333;
						  padding-left: 24rpx;
							position: relative;
							.icon-right{
								color: #cccccc;
								position: absolute;
								right: 12rpx;
							}
						}
						.input{
							margin-left: 24rpx;
							width: 490rpx;
						}
					}
				}
			}
			
	}
</style>
