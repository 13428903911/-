<template>
	<view class="category">
		<view class="example-nav">
			<uni-nav-bar fixed statusBar>
			    <view slot="left">
					<view class="search" :style="{width:width + 'px'}">
						<view class="input" @click="inputChange">
							<view class="icon">
								  <view class="iconfont">&#xe630;</view>
							</view>
							  	搜索
						</view>
					</view>
				</view>
			</uni-nav-bar>
		</view>
		<view class="category-wrapper" :style="{height:ktxWindowHeight + 'rpx'}">
			<!-- 左边导航 -->
			<scroll-view scroll-y="true" class="left-wrapper" scroll-with-animation="true" :scroll-top="left_scroll">
				<view class="left-content">
					<view class="title-content" :class="select_index === index?'onSelected':''" v-for="(title,index) in catrgory"
					 :key="index" @tap="choose(title,index)">{{title.name}}</view>
				</view>
			</scroll-view>
			<!-- 右边内容 -->
			<scroll-view class="right" :style="{width:ktxWindowWidth + 'rpx',height:goodsHeight + 'rpx'}" scroll-y="true" scroll-with-animation="true" :scroll-top="right_scroll" @scroll="myscroll">
				<!-- <view class="right-banner"></view> -->
				 <view class="right-wrapper">
				 		<!-- 产品区 -->
				 		<view class="right-content">
				 			<!-- 产品区 -->
				 			<view class="product-wrapper">
				 				<view class="category-item">
				 					<view class="category-title">
				 						<view class="title">
				 							{{parentName}}
				 						</view>
				 					</view>
				 					<view class="category-content">
				 						<view class="product-item" v-for="(p_item,p_index) in catrgoryList" :key="p_item.id" @click="navToList(p_item.id,p_item.name)">
				 							<image class="product-img" :src="imgObs+p_item.imgUrl"></image>
				 							<text class="product-title">{{p_item.name}}</text>
				 						</view>
				 					</view>
				 				</view>
				 			</view>
				 		</view>
				 </view>
			</scroll-view>
			
		</view>
	</view>
</template>

<script>
	import { getSongList,classify } from '@/utils/network/api.js'
	export default {
		data() {
			return {
				width :uni.getMenuButtonBoundingClientRect().left - 24,
				windows_height: 0, //屏幕高度
				ktxWindowHeight:0,
				ktxWindowWidth:0, // 屏幕的宽度
				goodsHeight:0,
				goodsHeight2:0,
				catrgoryList: [],
				catrgory: [],
				select_index: 0,
				right_height: [], //右侧每个内容的高度集合
				right_scroll: 0, //右侧的滑动值
				left_height: 0, //左侧总高度
				left_scroll: 0, //左侧滑动值
				last: 0,
				parentId:'',
				parentName:'',
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				 //分页
				 current: 1,
				 pages:1,
				 pageSize:10,
				 fuzzyData:[]
			}
		},
		onLoad() {
			this.sendInfo();
			this.getHeight()
			this.windows_height = uni.getSystemInfoSync().windowHeight;
		},
		methods: {
			getHeight(){
				let systemInfo = wx.getSystemInfoSync()
					    // px转换到rpx的比例
				      let pxToRpxScale = 750 / systemInfo.windowWidth;
				      // 状态栏的高度
				      let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
				      // 导航栏的高度
				      let navigationHeight = 44 * pxToRpxScale
				      // window的宽度
				      let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
				      // window的高度
				      let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
				      // 屏幕的高度
				      let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
				      // 底部tabBar的高度
				      let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight
							this.ktxWindowHeight = ktxWindowHeight - navigationHeight - ktxStatusHeight
							// console.log(this.ktxWindowHeight)
							// console.log(this.ktxWindowHeight)
							this.goodsHeight= this.ktxWindowHeight
							this.goodsHeight2 = this.goodsHeight - 24
							// console.log(this.goodsHeight)
							this.ktxWindowWidth = ktxWindowWidth - 180
			},
			//搜索
			inputChange(e){
				uni.navigateTo({
				    url: '/pages/search/search?classIndex='+1
				})
			},
			// 左侧一级分类接口数据
			sendInfo(){
				 getSongList().then(res => {
						this.catrgory = res.data;
						// 默认第一个显示二级分类
						this.choose(this.catrgory[0], 0)
				 })
			},
			// 右侧二级分类接口数据
			catrgorys(){
					const params = {
						//传左侧一级分类id
						parentId:this.parentId,
						pageSize:this.pageSize,
						pageNum:this.current
					}
					classify(params).then(res => {
						this.catrgoryList = res.data;
						this.pages = res.data.pages
						this.$nextTick(() => {
							this.getHeightList();
						})
					})
			},
			getHeightList() {
				let _this = this;
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery.select('.left-content').boundingClientRect(function(rects) {
					_this.left_height = rects.height;
				});
				selectorQuery.selectAll('.category-item').boundingClientRect(function(rects) {
					_this.right_height = rects.map((item) => item.top);
				}).exec();
			},
			choose(title,index) {
				console.log(title)
				//获取左侧一级分类id
				this.parentId = title.id
				this.parentName = title.name
				this.catrgorys()
				if (this.select_index === index) {
					return;
				}
				this.select_index = index;
			}, 
			myscroll(e) {
				//引入节流	
				let right_content_height = e.detail.scrollHeight - this.windows_height;
				if (right_content_height == e.detail.scrollTop) {
					return;
				}
			},
			navToList(tid,names){
					uni.navigateTo({
						url: '/pages/classify/classifyPage?id='+tid+'&names='+names
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.category /deep/.uni-navbar--border{
			 box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.10), 0 2rpx 8rpx 0 #ffffff;
			}
	.category {
			letter-spacing:2rpx;
			background: #f9f9f9;
			color: rgba(51,51,51,0.5);
		.category-wrapper {
			width: 100%;
			display: flex;
			flex-direction: column ;
			// position: fixed;
			// overflow: hidden;
			background: #f9f9f9;
			.left-wrapper {
				width: 180rpx;
				height: 100vh;
				flex: 0 0 180rpx;
				background-color: #fff;
				position: fixed;
				overflow: hidden;
				.left-content {
					.title-content {
						width: 100%;
						line-height: 37rpx;
						padding: 25rpx 0;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 26rpx;
						// cursor: pointer;
						&:last-child {
							border-bottom: 0;
						}
						&.onSelected {
							background-color: #f9f9f9;
							position: relative;
							color: #795C98;
							font-weight: 500;
							&::before {
								content: '';
								position: absolute;
								left: 0;
								top: 0;
								width: 4rpx;
								height: 100%;
								background: #795C98;
							}
						}
					}
				}
			}
			.right{
				flex: 1;
				box-sizing: border-box;
				overflow: hidden;
				position: relative;
				left: 180rpx;
				padding:  24rpx 24rpx 0 24rpx;
				overflow-x: hidden;
				overflow-y: scroll;
				.right-banner{
					width: 100%;
					height: 200rpx;
					background: #eee;
					border-radius: 16rpx;
				}
				.right-wrapper {
					height: 100%;
					background: #fff;
					border-radius: 16rpx 16rpx 0 0;
					overflow-x: hidden;
					overflow-y: scroll;
					.right-content {
					
						width: 100%;
						height: 100%;
						padding: 30rpx 24rpx 24rpx 24rpx;
						box-sizing: border-box;
						.banner-wrapper {
							padding: 0 20rpx;
							.swiper-content {
								width: 100%;
								height: 180rpx;
								margin-bottom: 20rpx;
								.swiper-item {
									.swiper-img {
										width: 100%;
										height: 180rpx;
									}
								}
							}
						}
						.product-wrapper {
							.category-item {
								.category-title {
									display: flex;
									justify-content: center;
									align-items: center;
									position: relative;
									font-size: 26rpx;
									color: #333333;
									margin-bottom: 60rpx;
									.title{
										background: #fff;
										text-align: center;
										padding: 0 20rpx;
										position: relative;
										z-index: 9;
										font-weight: 500;
									}
									&:after {
										position: absolute;
										left: 50%;
										top: 50%;
										transform: translateX(-50%);
										width:260rpx;
										height: 0;
										content: '';
										border-bottom: 1px solid  #d8d8d8;
										z-index: 1;
									}
									
								}
								.category-content {
									
									display: flex;
									flex-direction: row;
									flex-flow: wrap;
									.product-item {
										width: 33%;
										display: flex;
										flex-direction: column;
										justify-content: center;
										align-items: center;
										margin-bottom: 24rpx;
										.product-img {
											width: 142rpx;
											height: 142rpx;
											margin-bottom: 16rpx;
										}
										.product-title {
											font-size: 24rpx;
											color: rgba(51,51,51,0.50);
										}
									}
								}
							}
						}
					}
				}
			}
			
		}
	}
	.category-item{
		background: #fff;
	}
	.product-wrapper{
		border-radius: 16rpx;
	}
	/deep/ .uni-scroll-view{
		border-radius: 16rpx;
	}
	.search{
		background-color: #ffffff;
		position: relative;
		letter-spacing:2rpx;
		left: 16rpx;
		bottom: 4rpx;
		margin: 0 auto;
		display: flex;
		width: 480rpx;
		height: 60rpx;
		.input{
			position: relative;
			background: #F3F3F3;
			//border: 1rpx solid red;
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 26rpx;
			color: rgba(51,51,51,0.5);
			border-radius: 38rpx;
			text-align: center;
			.icon{
				position: absolute;
				top:2rpx;
				//border: 1rpx solid black;
				width:32rpx;
				height:32rpx;
				line-height: 32rpx;
				margin: 14rpx 0 0 24rpx;
				color: #333333;
				view{
					width: 100%;
					height: 100%;
					font-size: 32rpx;
				}
			}
		}
	}
</style>