<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar shadow>
		    <view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">物流详情</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="logistics" v-if="waybillList && waybillList.length >= 1">
			<view class="logistics-wl">
				<view class="logistics-kd">物流信息</view>
				<view class="logistics-gs">
					<view>物流公司：</view>
					<view>{{waybillData.expName}}</view>
				</view>
				<view class="logistics-gs" style="margin-bottom: 38rpx;">
					<view>顺丰配送：</view>
					<view>{{waybillData.number}}</view>
				</view>
				<view v-for="(item,index) in waybillList" :key="index" class="logistics-time" v-show="isOpen || index < max">
					<view class="cu-timeline" :class="(index + 1) % waybillList.length == 0 ?'altve':''">
						<view class="time">
							<view :class="{'first-time': index === 0}">06-12</view>
							<view>08:23:20</view>
						</view>
						<view class="cu-item" :class="{'first-item': index === 0,'text-blue': index === is}">
							<view class="content">
								<text>{{item.status}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="bottomAdd" v-show="!isOpen && waybillList.length > max" @click="isOpens">
					<view class="iconfont">&#xe63e;</view>
				</view>
				<view class="bottomAdd" v-show="isOpen && waybillList.length > max" @click="isOpens_x">
					<view class="iconfont">&#xe63c;</view>
				</view>
			</view>
		</view>
		<!-- 空白 -->
		<view class="none" v-if="waybillList && waybillList.length < 1">
			<view class="none-img">
				<image src="@/static/icon-none.png" mode=""></image>
			</view>
			<view class="none-text">
				暂无数据~
			</view>
		</view>
	</view>
</template>

<script>
	import { getLogisticsTrack } from '@/utils/network/api.js'
	export default {
		data() {
			return {
				max: 6, //默认展示几条数据
				isOpen: false, // 是否展开全部信息的标识 Boolean 默认false
				waybillNumber:'', // 物流单号
				waybillData:{},
				waybillList:[],
				is: 5,
				phoneNumber: '' // 手机号
			}
		},
		onLoad(options) {
			const that = this
			that.waybillNumber = options.waybillNumber
			that.phoneNumber = options.phoneNumber
			// that.orderMark = options.orderMark
			that.getData()
		},
		methods: {
			// 返回上一页
			clickBack() {
				uni.navigateBack({})
			},
			isOpens(){
				this.isOpen = !this.isOpen
				this.is = !this.is
			},
			isOpens_x(){
				this.isOpen = !this.isOpen
				this.is = 5
			},
			// 根据运单号查询物流
			getData(){
				const that = this
				const params = {
					phoneNumber:that.phoneNumber,
					waybillNumber:that.waybillNumber,
				}
				getLogisticsTrack(params).then(res => {
					that.waybillData = res.data
					that.waybillList = JSON.parse(res.data.list)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.txtColor{
		color: #333333;
	}
	.contont{
		font-weight: 400;
		background: #f9f9f9;
		height: 100vh;
		.search{
			background-color: #ffffff;
			display: flex;
			width: 696rpx;
			position: relative;
			left: 0rpx;
			bottom: 0rpx;
			.iconfont{
				font-size: 48rpx;
			}
			text{
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: rgba(0,0,0,0.85);
				line-height: 48rpx;
				margin: auto;
			}
		}

	.logistics{
		margin: 24rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		color: rgba(51,51,51,0.50);
		.logistics-wl{
			padding: 24rpx;
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
					height: 0% !important;
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
						top: 0;
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
					content: "\e645"!important;
					color: #FFFFFF;
					background: #795c98;
					border: 3px solid #d6cee0;
				}
			}
			.bottomAdd{
				text-align: center;
				color: rgba(51,51,51,0.50);
				.iconfont{
					font-size: 22rpx;
				}
			}
		}
		
	}
	// 空白页
	.none{
				 display: flex;
				 // background-color: red;
				 padding: 30% 213rpx;
				 .none-img{
					 // background-color: green;
					 height: 98rpx;
					 width: 98rpx;
					 image{
						 width: 100%;
						 height: 100%;
					 }
				 }
				 .none-text{
					 line-height: 98rpx;
					 padding-left: 24rpx;
					 font-size: 30rpx;
					 text-align: center;
					 color: rgba(51,51,51,0.5);
				 }
	}
}
</style>

