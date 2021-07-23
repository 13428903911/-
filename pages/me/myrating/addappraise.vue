<template>
	<view class="addprase-contion">
		<navbar :title="title" @goBack="goBack"></navbar>
		<view class="addprase-main">
			<!-- 商品信息 -->
			<view class="collect-list-box">
				<view class="title">商品信息</view>
				<view class="collect-list" v-for="(item, index) in collectData.list" :key="item.id">
					<view style="width:150rpx;height: 150rpx;">
						<image 
						:src="item.imgUrl" 
						style="width:100%;height: 100%;border-radius: 4rpx;"
						>
						</image>
					</view>
					<view class="sku-price">
						<view class="text">{{item.text}}</view>
						<view class="sku-name">藏青色，S码</view>
						<view class="price-amount">
							<view><text class="price">单价：</text><text>￥5818.00</text></view>
							<view>×1</view>
						</view>
					</view>
				</view>
				<view class="out-of-pocket">
					<text>实付金额：</text><text class="money bold">￥99.00</text>
				</view>
			</view>
			<!-- 评价信息 -->
			<view class="assing-information">
				<view class="title">评价信息</view>
				<view>
					<text>描述相符：</text>
					<htz-rate 
						v-model="ceshi1"
						disHref="../../static/rating/rate6_0.png" 
						checkedHref="../../static/rating/rate6_1.png"
					>
					</htz-rate>
				</view>
				<view class="good-reputation">
					<text>物流服务：</text>
					<htz-rate
						v-model="ceshi2"
						disHref="../../static/rating/rate6_0.png" 
						checkedHref="../../static/rating/rate6_1.png"
					>
					</htz-rate>
				</view>
				<view>
					<text>服务态度：</text>
					<htz-rate
						v-model="ceshi3"
						disHref="../../static/rating/rate6_0.png" 
						checkedHref="../../static/rating/rate6_1.png"
					>
					</htz-rate>
				</view>
				<view class="user-rating">
					<text>用户评价内容：</text>
					<text class="user-text">衣服非常好看！价格又实惠上身效果非常好。门店服务态度很棒，下次还会回购！</text>
				</view>
				<view class="user-reply">
					<view>
						<text>回复内容：</text>
						<text class="user-default">默认好评</text>
					</view>
					<view class="reply">回复</view>
				</view>
			</view>
	
			<!-- 订单信息 -->
			<view class="order-form">
				<view class="title">订单信息</view>
				<view class="order-time">
					<span class="order-label">订单编号:</span>
					<span>191895191859191561</span>
				</view>
				<view class="order-time">
					<span  class="order-label">创建时间:</span>
					<span>2017-01-15 14:35:08</span>
				</view>
				<view class="order-time">
					<span  class="order-label">支付时间:</span>
					<span >2017-01-15 14:35:08</span>
				</view>
				<view>
					<span  class="order-label">完成时间:</span>
					<span >2017-01-15 14:35:08</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/nav-bar/nav-bar.vue'
	import htzRate from '@/components/htz-rate/htz-rate.vue'
	export default {
		components:{ navbar, htzRate },
		data() {
			return {
				ceshi1: 0,
				ceshi2: 0,
				ceshi3: 0,
				title:"评价详情",
				value:1,
				radioStaus:false, // 单选框状态
				listStyles: {
					width:"224rpx",
					height:"142rpx",
					border:{
							background: "#f9f9f9",
							border: "1px solid #eeeeee",
							width: "1rpx",
							"style":"solid",
							radius:'17rpx'
					}
				},
				 imageStyles:{
						width:"224rpx",
						height:"142rpx",
						border:{
								background: "#f9f9f9",
								border: "1px solid #eeeeee",
								width: "1rpx",
								"style":"solid",
								radius:'17rpx'
						}
				},
				placeholder:'从多个角度评价宝贝,可以帮助多想买的人',
				collectData:{
					list: [
						{ id:1, text: '遮住腿部缺陷，女式设计感小众侧开叉半身裙', collect: "近xx人收藏",imgUrl: 'https://img13.360buyimg.com/babel/s320x320_jfs/t1/152107/9/4363/102864/5f9f91daE44173f04/5fbdd1f7b027eff2.jpg!cc_320x320.webp'}
					]
				},
			}
		},
		methods:{
			// 返回上一页
			goBack() {
				uni.navigateTo({
					 url: './addappraise',
				})
			},
			select(e) {
				console.log('选择图片',e)
			},
			radioChange(evt) {
				this.radioStaus = false
				// parseInt(evt.detail.value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addprase-contion{
		font-size: 30rpx;
		.addprase-main{
			height: 100vh;
			background-color: #f9f9f9;
			padding: 24rpx;
			border-radius: 16rpx;
		}
		// 商品样式
		.collect-list-box{
			padding: 24rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			.title{
				padding-bottom: 24rpx;
				font-size: 30rpx;
			}
			.collect-list{
				display: flex;
				.sku-price{
					width: 480rpx;
					margin-left: 24rpx;
					.text{
						font-size: 28rpx;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						line-clamp: 1;
						-webkit-box-orient: vertical;
					}
					.sku-name{
						font-size: 24rpx;
						color: rgba(51,51,51,0.50);
						margin: 29rpx 0 16rpx 0;
					}
					.price-amount{
						font-size: 24rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.price{
							color: rgba(51,51,51,0.50);
						}
					}
				}
			}
			.out-of-pocket{
				text-align: right;
				margin-top: 24rpx;
				font-size: 26rpx;
				.money{
					font-size: 34rpx;
				}
			}
		}
		// 评价信息
		.assing-information{
			padding: 24rpx;
			background-color: #FFFFFF;
			margin: 24rpx 0;
			font-size: 26rpx;
			border-radius: 16rpx;
			.title{
				font-size: 30rpx;
				padding-bottom: 24rpx;
			}
			.iconfont{
				color: #ed2648;
				font-size: 30rpx;
				margin-right: 16rpx;
			}
			.good-reputation{
				margin: 29rpx 0;
			}
			.user-rating{
				margin: 26rpx 0 24rpx 0;
				display: flex;
				.user-text{
					margin-left:8rpx;
					width: 464rpx;
					color: rgba(51,51,51,0.50);
					text-align: justify;
					text-align-last: left;
				}
			}
			.user-reply{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.user-default{
					color: rgba(51,51,51,0.50);
					margin-left: 8rpx;
				}
				.reply{
					color: #2582ff;
				}
			}
		}
	}
	// 订单信息
	.order-form{
		font-size: 26rpx;
		padding:24rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		.title{
			font-size: 30rpx;
			margin-bottom: 24rpx;
		}
		.order-label{
			margin-right: 56rpx;
			color: rgba(51,51,51,0.50);
		}
		.order-time{
			margin-bottom: 16rpx;
		}
	}
	// 多选框样式
	// checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked{
	// 	width: 32rpx;
	// 	height: 32rpx;
	// 	background:#ED2648;
	// 	border: 1rpx solid #ED2648;
	// 	border-radius: 50%;
	// 	color: #FFFFFF;
	// }
	// checkbox /deep/ .wx-checkbox-input{
	// 	width: 32rpx;
	// 	height: 32rpx;
	// 	border: 1rpx solid #eeeeee;
	// 	border-radius: 50%;
	// }
	// // √样式
	// checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked::before{
	//   width: 25rpx;
	//   height: 25rpx;  
	// 	line-height: 25rpx;
	// 	text-align: center;
	// 	font-size: 25rpx;
	// 	color: #fff;
	// 	background: transparent;
	// 	transform: translate(-50%, -50%) scale(1);
	// 	-webkit-transform: translate(-50%, -50%) scale(1);
	// }

</style>
