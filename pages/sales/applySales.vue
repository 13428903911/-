<template>
	<view class="header">
		<view class="header-apply">
			<text>换货原因</text>
			 <view class="uni-textarea">
					 <textarea placeholder-style="color:rgba(51,51,51,0.26)" placeholder="从多个角度评价宝贝,可以帮助多想买的人"/>
			 </view>
		</view>
		<button class="header-button" type="default">提 交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.header{
	background: #F9F9F9;
	color: #333333;
	box-shadow: 0px 2rpx 8rpx -1rpx rgba(0,0,0,0.10) inset;
	letter-spacing:2rpx;
	height: calc(100vh - 88rpx);
	padding-top: 24rpx;
	.header-apply{
		background: #fff;
		margin: 0px 12px 12px;
		padding: 24rpx;
		border-radius: 16rpx;
		text{
			font-size: 30rpx;
			display: inline-block;
			margin-bottom: 24rpx;
		}
		.uni-textarea{
			textarea{
				border: 1rpx solid #eeeeee;
				border-radius: 17rpx;
				padding: 24rpx;
				font-size: 26rpx;
			}
		}
	}
	/deep/ .header-button{
	    background-color: #f8f8f8;
	    margin: 12px;
	    border: none;
	    background: red;
	    color: #fff;
			margin-top: 560rpx;
	}
}
</style>
