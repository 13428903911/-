<template>
	<view class="no-data-conter" :style="{marginTop:marginTop}"> 
		<view class="no-data-img">
			<image src="@/static/icon-none.png"></image>
		</view>
		<view class="no-data-title">{{noText}}</view>
	</view>
</template>

<script>
	export default {
		props:{
			noText: String,
			marginTop:{
				type:String,
				default:'30%'
			}
		},
		data() {
			return {}
		},
	}
</script>

<style lang="scss" scoped>
	.no-data-conter{
		display: flex;
		flex-direction: column;
		align-items: center;
		// margin-top:30%;
		.no-data-img{
			height: 98rpx;
			width: 98rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.no-data-title{
			font-size: 30rpx;
			color: rgba(51,51,51,0.50);
		}
	}
</style>
