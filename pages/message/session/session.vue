<template>
	<view class="header">
		<uni-swipe-action>
			<uni-swipe-action-item @tap="bindClick">
				<template v-slot:left>
					<view class="slot-button">
						<text class="slot-button-text">置顶</text>
					</view>
				</template>
				<view class="content-box">
					<image src="../../../static/home/logo.png" mode="">
						   <uni-badge class="badge" text="99" type="error" />
					</image>
					<view class="session-title">
						<view class="title">
							<text class="title-name">供应商名称</text>
							<text class="title-message">摘要信息</text>
						</view>
						<view class="session-time">下午4:21</view>
					</view>
				</view>
				<template v-slot:right>
					<view class="slot-button"><text class="slot-button-text">删除</text></view>
				</template>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<uni-swipe-action>
			<uni-swipe-action-item @click="bindClick">
				<template v-slot:left>
				</template>
				<view class="content-box">
					<image src="../../../static/home/logo.png" mode=""></image>
					<view class="session-title">
						<view class="title">
							<text class="title-name">供应商名称</text>
							<text class="title-message">摘要信息</text>
						</view>
						<view class="session-time">下午4:21</view>
					</view>
				</view>
				<template v-slot:right>
					<view class="slot-button"><text class="slot-button-text">删除</text></view>
				</template>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			bindClick() {
				console.log(111)
				uni.navigateTo({
					url:'/pages/message/session/customerService'
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.header{
	border-top: 1rpx solid #F5F5F5;
	.slot-button {
		/* #ifndef APP-NVUE */
		display: flex;
		height: 100%;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0 20px;
		background-color: #ff5a5f;
	}
	.slot-button-text {
		color: #ffffff;
		font-size: 14px;
	}
	.content-box {
		flex: 1;
		/* #ifdef APP-NVUE */
		justify-content: center;
		/* #endif */
		height: 144rpx;
		padding-left: 32rpx;
		position: relative;
		background-color: #fff;
		image{
			width: 96rpx;
			height: 96rpx;
			margin: 24rpx 24rpx 24rpx 0;
			float: left;
		}
		/deep/ .badge{
			position: absolute !important;
			top: 10rpx !important;
			left: 95rpx !important;
			
			/deep/ .uni-badge{
				border-radius: 50% !important;
			}
		}
		.session-title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 142rpx;
			border-bottom: 2rpx solid #F5F5F5;
			.title{
				flex-direction: column;
				display: flex;
				.title-name{
					font-size: 34rpx;
				}
				.title-message{
					font-size: 28rpx;
					color: rgba(0,0,0,0.24);
				}
			}
			.session-time{
				margin-top: -34rpx;
				padding-right: 24rpx;
				font-size: 24rpx;
				color: rgba(0,0,0,0.24);
			}
		}
	}
	.content-text {
		font-size: 15px;
	}
}

</style>
