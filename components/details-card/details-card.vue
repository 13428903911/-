<template>
	<view class="content" >
			<view class="title-copy">
				<view class="title">{{cardList.title}}</view>
				<view class="copy" v-if="cardList.title == '物流信息'" @click="copyUrl">复制</view>
			</view>
			<view class="recipients" v-for="(item,index) in cardList.list" :key="index">
				<view>
					<text>{{item.label}}</text><text class="content-value" 
					:class="{'active': item.label.length == 4, 'three': item.label.length == 3, 'five': item.label.length == 6,'seven':item.label.length == 7,'bold':item.showBold}"
				>{{item.value}}</text>
				</view>
			</view>
			
		<!-- 物流详情 -->
				<view class="logistics-wl">
					<view v-for="(items,indexs) in cardList.logisticsInfo" :key="indexs" class="logistics-time" v-show="isOpen || indexs < max">
						<view class="cu-timeline" :class="(indexs + 1) % cardList.logisticsInfo.length == 0 ?'altve':''">
							<view class="time">
								<view :class="{'first-time': indexs === 0}" style="font-size: 22rpx;">{{items.time.slice(5,10)}}</view>
								<view>{{items.time.slice(11,19)}}</view>
							</view>
							<view class="cu-item" :class="{'first-item': indexs === 0,'text-blue': indexs === is}">
								<view class="content">
									<text :class="{'first-time': indexs === 0}">{{items.status}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="bottomAdd" v-show="!isOpen && cardList.logisticsInfo.length > max" @click="isOpens">
						<view class="iconfont">&#xe63e;</view>
					</view>
					<view class="bottomAdd" v-show="isOpen && cardList.logisticsInfo.length > max" @click="isOpens_x">
						<view class="iconfont">&#xe63c;</view>
					</view>
				</view>
	</view>
</template>

<script>
	export default {
		props: {
			cardList:{
				type: Object
			}
		},
		data() {
			return {
				max: 6, //默认展示几条数据
				isOpen: false, // 是否展开全部信息的标识 Boolean 默认false
			}
		},
		methods:{
			isOpens(){
				this.isOpen = !this.isOpen
				this.is = !this.is
			},
			isOpens_x(){
				this.isOpen = !this.isOpen
				this.is = 5
			},
			copyUrl() {
				const vm = this
				vm.$emit('clickCopy')
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.content{
		margin: 0 24rpx 24rpx 24rpx;
		padding: 24rpx 24rpx 0 24rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		.title-copy{
			display: flex;
			justify-content: space-between;
			// align-items: center;
			.title{
				font-size: 30rpx;
				margin-bottom: 24rpx;
			}
			.copy{
				color: #795c98;
				font-size: 26rpx;
			}
		}
		.recipients{
			font-size: 26rpx;
			color: rgba(51,51,51,0.50);
			padding-bottom: 24rpx;
			.content-value{
				margin-left: 56rpx;
				color: #333333;
			}
			.active{
				margin-left: 82rpx !important;
			}
			.three{
				margin-left: 108rpx !important;
			}
			.five{
				margin-left: 31rpx !important;
			}
			.seven{
				margin-left: 0rpx !important;
			}
		}
	}
	//  物流样式

		.logistics-wl{
			// padding: 24rpx;
			margin-top: 24rpx;
			color: #333;
			.logistics-kd{
				font-size: 30rpx;
				margin-bottom: 30rpx;
			}
			.logistics-gs{
				display: flex;
				align-items: center;
				font-size: 24rpx;
				margin-top: 12rpx;
			}
			.logistics-time{
				position: relative;
				font-size: 24rpx;
				.time{
					text-align: right;
					font-size: 20rpx;
					color: rgba(51,51,51,0.50);
				}
				//第一个时间颜色
				.first-time{
					color: #333;
				}
				/deep/ .cu-timeline>.cu-item {
					padding: 0rpx 30rpx 30rpx 120rpx;
				}
				/deep/ .cu-timeline:last-child .cu-item{
					padding: 0rpx 30rpx 0rpx 100rpx;
					left: -12px;
				}
				/deep/ .cu-timeline>.cu-item>.content {
					padding: 0;
					line-height: inherit;
					position: relative;
					p{
						padding-bottom: 8rpx;
					}
					text{
						color: rgba(51,51,51,0.50);
						padding-bottom: 40rpx;
						display: inline-block;
					}
					.first-time{
						color: #333;
					}
				}
				.cu-timeline>.cu-item>.content:not([class*="bg-"]) {
					background-color: #FFFFFF;
					// border-bottom: 1rpx solid #EEEEEE;
				}
				/deep/ .cu-timeline {
					display: flex;
				}
				// 最后一个样式
				/deep/ .altve>.cu-item::after {
					height: 50% !important;
				}
				/deep/ .cu-timeline>.text-blue::after {
					height: 0% !important;
				}
				/deep/ .cu-timeline>.first-item::after {
					top: 0;
					left: 29.5px !important;
				}
				/deep/ .cu-timeline>.cu-item::after {
					left: 29.5px !important;
				}
				/deep/ .cu-timeline>.cu-item:not([class*="cuIcon-"])::before {
					content: "";
				}
				/deep/ .cu-timeline>.cu-item::before {
				    font-family: "cuIcon";
				    position: absolute;
				    z-index: 9;
				    background-color: #fff;
				    width: 8px;
				    height: 8px;
						top: 4px;
				    // text-align: center;
				    // line-height: 50rpx;
				    left: 26px;
				    border-radius: 50%;
				    background: #cacaca;
				}
				/deep/ .cu-timeline>.first-item::before {
					width: 12px;
					height: 12px;
					line-height: 10px;
					left: 22px;
					font-size: 10px;
					// content: "\e645"!important;
					color: #FFFFFF;
					background: #795c98;
					border: 3px solid #d6cee0;
				}
			}
			.bottomAdd{
				text-align: center;
				color: rgba(51,51,51,0.50);
				padding-bottom: 22rpx;
				.iconfont{
					font-size: 22rpx;
				}
			}
		}
</style>
