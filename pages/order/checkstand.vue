<template>
	<view class="header">
		<view class="header-stand">
			<view class="stand-fk">
				<text>应付金额：</text>
				<text class="money">￥{{payable}}</text>
			</view>
			<view class="stand-wx">
				<view class="wx-zf">
					<i class="iconfont">&#xe620;</i>
					<text>微信支付</text>
				</view>
				<view class="zf">
					<text class="zf-mony">支付<text>{{payable}}</text>元</text>
					<radio value="1" color="#795C98" @click="clickRadio(1)" :checked="payType === 1" />
				</view>
			</view>
			<!-- 		<view class="stand-wxs">
				<view class="wx-zf">
					<i class="iconfont">&#xe60d;</i>
					<text>支付宝</text>
				</view>
				<view class="zf">
					<text>支付<span>13.50</span>元</text>
					<radio value="2" color="red" :checked="payType === 2" @click="clickRadio(2)" />
				</view>
			</view> -->
			<button class="ljzf" @click="payment(0)">
				立即支付
			</button>
		</view>
	</view>
</template>

<script>
	import {
		wechatPay
	} from '@/utils/network/api.js'
	export default {
		data() {
			return {
				payType: 1,
				orderIds: '',
				payable: ''
			}
		},
		onLoad(options) {
			this.orderIds = options.orderId
			this.payable = options.payable
		},
		methods: {
			clickRadio(val) {
				this.payType = val;
			},
			payment(item) {
				const that = this
				// uni.removeStorageSync('SubmitOrders')
				// uni.removeStorageSync('evt_key')
				const params = {
					orderId: that.orderIds
				}
				uni.showLoading({
					title: '支付中...'
				});
				setTimeout(() => {
					uni.hideLoading();
					setTimeout(() => {
						//微信支付
						wechatPay(params).then(res => {
							var data = res.data
							wx.requestPayment({
								appid:data.appid,
								timeStamp: data.timeStamp,
								nonceStr: data.nonceStr,
								package: data.packages,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									uni.navigateTo({
										  url: '/pages/order/successfulOrder?id='+ item + '&orderId=' + that.orderIds
									})
								},
								fail: function(res) {
									console.log('返回：',res)
								}
							})
							
						})
					}, 300);
				}, 700)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		background: #f9f9f9;
		padding-top: 24rpx;
		color: #333333;
		letter-spacing: 2rpx;
		box-shadow: 0px 4rpx 8rpx -1px rgba(0, 0, 0, 0.10) inset;
		padding-top: 24rpx;
		height: 100vh;

		.header-stand {
			margin: 0px 24rpx 24rpx;
			border-radius: 16rpx;
			background: #fff;
			padding: 24rpx 24rpx 0 24rpx;
			font-size: 30rpx;

			.stand-fk {
				font-size: 34rpx;
				margin-bottom: 36rpx;

				.money {
					color: #333333;
				}
			}

			.stand-wx {
				display: flex;
				padding: 12px 0;

				// border-bottom: 1rpx solid #EEEEEE;
				.wx-zf {
					flex: 1;

					.iconfont {
						display: inline-block;
						font-size: 48rpx;
						vertical-align: middle;
						margin-right: 16rpx;
						color: rgb(72, 189, 28) !important;
					}

					text {
						font-size: 34rpx;
					}
				}

				.zf {
					font-size: 26rpx;
					color: rgba(51, 51, 51, 0.50);

					.zf-mony {
						margin-right: 16rpx;

						text {
							color: #333333;
						}
					}

					.radio {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}

			.stand-wxs {
				display: flex;
				padding: 12px 0;
				border-bottom: 0rpx solid #EEEEEE;

				.wx-zf {
					flex: 1;

					.iconfont {
						display: inline-block;
						font-size: 48rpx;
						vertical-align: middle;
						margin-right: 16rpx;
						color: rgb(91, 171, 225) !important;
					}

					text {
						font-size: 34rpx;
					}
				}

				.zf {
					font-size: 26rpx;
					color: rgba(51, 51, 51, 0.50);

					.zf-mony {
						margin-right: 16rpx;

						text {
							color: #333333;
						}
					}

					.radio {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
		}

		.ljzf {
			position: fixed;
			bottom: 70rpx;
			width: 702rpx;
			height: 112rpx;
			border-radius: 16rpx;
			background: #795C98;
			margin: auto;
			line-height: 112rpx;
			color: #fff;
			text-align: center;
			font-size: 36rpx;
			margin: 0 12px;
			left: 0;
		}
	}

	/deep/ uni-radio .uni-radio-input {
		width: 32rpx;
		height: 32rpx;
	}
</style>
