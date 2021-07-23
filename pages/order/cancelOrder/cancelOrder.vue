<template>
	<view class="container">
		<nav-bar :title="title" @goBack="goBack"/>
		<view class="main">
			<view class="main-box">
				<view class="title">取消原因</view>
				<uni-easyinput type="textarea" placeholderStyle="color: rgba(0,0,0,0.25);" maxlength="200" :inputBorder="false" v-model="value" @input="inputValue" placeholder="请输入取消原因"></uni-easyinput>
				<view class="length">{{valueLlength + "/200"}}</view>
			</view>
		</view>
		<view class="button">
			<view class="button-txt" @click="confirmCancel">提 交</view>
		</view>
	</view>
</template>

<script>
	import { byUser} from '@/utils/network/api.js'
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		components:{
			navbar
		},
		data() {
			return {
				title:'请输入取消原因',
				purchaseId:'', // 订单号
				value:'',
				valueLlength:0,
				timeout:null
			}
		},
		onLoad(options) {
			const that = this
			// console.log("订单号",options)
			that.purchaseId = options.purchaseId
		},
		methods: {
			// 返回
			goBack(){
				uni.navigateBack({})
			},
			// 获取内容长度
			inputValue(e){
				this.valueLlength = e.length
				// this.value = e
				// console.log(e.length,this.value)
			},
			// 提交
			confirmCancel(){
				const that =this
				if(that.value === ''){
					uni.showToast({icon: 'none',title: '取消原因不能为空',duration:1000});
				}else{
					// console.log(that.value)
					byUser({purchaseId:that.purchaseId,cancelReason:that.value}).then(res => {
						uni.showToast({icon: 'none',title: '取消订单成功',duration:1000});
						clearTimeout(that.timeout);
							that.timeout = setTimeout(() => {
							 uni.navigateTo({
							    url: '/pages/order/myOrder'
							 });
						 }, 500);
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container /deep/.uni-easyinput__content-textarea{
		background: #f9f9f9;
		height: 326rpx;
		text-indent: 24rpx;
	}
  .container{
	 background: #f9f9f9;
	 height: 100vh;
	 .main{
		 padding: 24rpx;
		.main-box{
			background: #fff;
			padding: 0 24rpx 24rpx;
			border-radius: 16rpx;
			.title{
				font-size: 30rpx;
				line-height: 90rpx;
			}
			.length{
				background: #f9f9f9;
				text-align: right;
				padding: 24rpx;
			}
		}
	 }
	 .button{
		 width: 702rpx;
		 position: fixed;
		 bottom: 72rpx;
		 left: 0;
		 padding: 0 24rpx;
		 .button-txt{
			 background: #795C98;
			 color: #fff;
			 font-size: 36rpx;
			 line-height: 50rpx;
			 padding: 31rpx 0;
			 text-align: center;
			 border-radius: 16rpx;
		 }
	 }
 }
</style>
