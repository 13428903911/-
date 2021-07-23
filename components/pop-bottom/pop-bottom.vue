<template>
	<view class="container" >
		 	<view class="popup" :style="{bottom:bottom + 'rpx'}">
		 	  <view class="popup-text">金额明细</view>
				<view class="popup-text2">实际金额请以下单为准</view>
				<view class="popup-list">
					<view class="list">
						<view>采购单总金额</view>
						<view>¥{{popData.payMoney}}</view>
					</view>
					<view class="list">
						<view>服务费</view>
						<view>¥{{popData.serviceMoney}}</view>
					</view>
					<view class="list">
						<view>运费</view>
						<view style="color: #E02020;">-¥{{popData.expressCharge}}</view>
					</view>
					<view class="list">
						<view class="size">退款金额</view>
						<view class="size">¥{{popData.refundMoney}}</view>
					</view>
				</view>
		 	</view>	
	</view>
</template>

<script>
	export default {
		props:{
			bottom:{ // 底部距离
				type:Number,
				default:110
			},
			popData:{
				type:Object
			}
		},
		data() {
			return {
				// show:true
			}
		},
		methods: {
			// clickNone(){
			// 	this.show = this.show === false ? true : false
			// }
		}
	}
</script>

<style lang="scss" scoped>
 .container{
	 position: fixed;
	 z-index: 9;
	 top: 0;
	 left: 0;
	 background: rgba(0,0,0,0.55);
	 width: 100%;
	 height: 100%;
	 .popup{
			width: 100%;
			background: #fff;
			border-radius: 16rpx 16rpx 0px 0px;
			position: fixed;
	 	.popup-text{
	 		font-size: 34rpx;
	 		line-height: 48rpx;
	 		text-align: center;
	 		padding: 16rpx 0 6rpx 0;
	 	}
		.popup-text2{
			font-size: 24rpx;
			line-height: 33rpx;
			text-align: center;
			color: rgba(0,0,0,0.5);
		}
		.popup-list{
			// background: #ccc;
			padding: 8rpx 30rpx 122rpx 30rpx;
			.list{
				display: flex;
				justify-content:space-between;
				font-size: 24rpx;
				line-height: 33rpx;
				margin-top: 24rpx;
				.size{
					 font-size: 28rpx;
					 font-weight: 500;
				}
			}
		}
	 	// .popup-list:nth-child(2){
	 	// 	border-bottom: 1rpx solid #eee;
	 	// }
	 
	 }
 }
</style>
