<template>
	<view class="container">
		<nav-bar :title="title" @goBack="goBack"/>
		<view class="custome">
			<view class="custome-time">下午11:00</view>
			<view class="uni-flex uni-row">
				<view class="text custome-img">
					<image src="../../../static/home/logo.png" mode=""></image>
				</view>
				<view class="text">
					<view class="text-gys">供应商</view>
					<view class="text-cl">您好！现在这个订单已经在处理中了~</view>
				</view>
			</view>
			<view class="uni-flex uni-row" style="-webkit-justify-content: flex-end;justify-content: flex-end;">
				<view class="text" style="margin-right: 24rpx;">
					<view class="text-gys" style="text-align: right;">昵称昵称</view>
					<view class="text-cl" style="background: #f5f2f7;">您好！现在这个订单已经在处理中了~</view>
				</view>
				<view class="text custome-img">
					<image src="../../../static/home/logo.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 安卓手机判断 -->
		<view class="footer" v-if="isIosApp" :style="[{bottom:InputBottom+'px'}]">
			<input type="text" value="" :adjust-position="false" :focus="false" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"/>
			<image src="../../../../static/photoAlbum.svg" mode=""></image>
			<view class="button-fs">发送</view>
		</view>
		<!-- 苹果手机判断 -->
		<view class="footer footers" v-else>
			<input type="text" value="" />
			<image src="../../../static/photoAlbum.svg" mode=""></image>
		</view>
		<view class="customerService">
			<image src="../../../static/custome.svg" mode="" @click="customerService"></image>
		</view>
		<!-- 驳回订单-模态层弹窗 -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog :type="msgType" title="是否需要平台介入" :duration="2000" @confirm="confirm()"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		components:{
			navbar
		},
		data() {
			return {
				title:'供应商、云档口客服',
				isIosApp: true,
				InputBottom: 0
			}
		},
		onLoad() {
			// 判断安卓和ios手机
			this.isIosApp=uni.getSystemInfoSync().platform === 'android'
		},
		methods: {
			// 返回上一页
			goBack(){
				uni.navigateBack({})
			},
			// 平台介入弹窗
			customerService(){
				this.$refs.popup.open()
			},
			// 确定
			confirm(){
				this.$refs.popup.close()
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
				console.log(e.detail.height)
			},
			InputBlur(e) {
				this.InputBottom = 0
			}
		}
	}
</script>

<style lang="scss" scoped>
.container /deep/.uni-navbar--border{
	box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(0,0,0,0.08), 0rpx 2rpx 8rpx 0rpx #ffffff; 
}
page{
  padding-bottom: 100upx;
}
.container{
	background-color: #f9f9f9;
	height: 100vh;
	.custome{
		.custome-time{
			text-align: center;
			margin: 24rpx 0;
			font-size: 24rpx;
			color: rgba(0,0,0,0.24);
		}
		.uni-flex{
			padding: 24rpx 24rpx 24rpx 32rpx;
			display: flex;
			margin-top: 24rpx;
			.custome-img{			
				width: 96rpx;
				height: 96rpx;
				margin-right: 24rpx;
				image{
					width: 96rpx;
					height: 96rpx;
					border: 1px solid #eeeeee;
					border-radius: 8rpx;
				}
			}
			.text{
				.text-gys{
					color: rgba(0,0,0,0.40);
					font-size: 28rpx;
				}
				.text-cl{
					width: 486rpx;
					height: 83rpx;
					line-height: 83rpx;
					background: #ffffff;
					border-radius: 16rpx;
					font-size: 24rpx;
					margin-top: 16rpx;
					text-indent: 24rpx;
					color: rgba(0,0,0,0.85);
				}
			}
		}
	}
	// 安卓手机
	.footer{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #FFFFFF;
		display: flex;
		justify-content:space-between;
		align-items: center;
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0px 0px 4rpx 0px rgba(0,0,0,0.24) inset; 
		input{
			width: 454rpx;
			height: 64rpx;
			background: #f9f9f9;
			border-radius: 38rpx;
			margin: 24rpx 24rpx 24rpx 32rpx;
			padding-left: 24rpx;
			box-sizing: border-box;
		}
		image{
			width: 48rpx;
			height: 48rpx;
			margin-right: 24rpx;
		}
		.button-fs{
			width: 144rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			color: #FFFFFF;
			background: #795c98;
			border-radius: 32rpx;
			margin-right: 24rpx;
			font-size: 28rpx;
		}
	}
	// 苹果手机
	.footer.footers{
		input{
			width: 606rpx!important;
		}
		image{
			margin-right: 35rpx!important;
		}
	}
	.customerService{
		position: fixed;
		top:50%;
		right: 24rpx;
		width: 157rpx;
		height: 52rpx;
		image{
			width: 165rpx;
			height: 52rpx;
			border-radius: 8rpx;
			box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0,0,0,0.09);
		}
	}
	/deep/ .uni-dialog-title{
		padding-top: 48rpx;
	}
	/deep/ .uni-dialog-title-text{
		font-weight: 500!important;
		font-size: 34rpx!important;
		font-family: PingFangSC, PingFangSC-Medium;
	}
	/deep/ .uni-button-color{
		font-size: 34rpx;
		font-weight: 500;
		font-family: PingFangSC, PingFangSC-Medium;
	}
}
</style>
