<template>
	<view class="container">
		<uni-nav-bar left-icon="back"  :title="topSearchValue" fixed statusBar color="rgba(0,0,0,0.85)" @clickLeft="goBack"></uni-nav-bar>
		<!--  -->
		 <view class="filter">
		 	<view class="filterBox2" :class="{ tabActive:tabsIndex === 0 }" @click="oldDefault(0)">
		 		默认
		 	</view>
		 	<view class="filterBox"  @click="number(1)" >
		 		<view  class="filterName" :class="{ tabActive:tabsIndex === 1 }">销量</view>
		 		<view class="filterPop">
		 			<view :class="{active: numberOrder === 1 && tabsIndex === 1}"  class="iconfont iconf" >&#xe61d;</view>
		 			<view :class="{active: numberOrder === 2 && tabsIndex === 1}"  class="iconfont iconf">&#xe615;</view>
		 		</view>
		 	</view>	
		 </view>
		 <!--  -->
		 <view class="stalls">
		 	<view class="stallsList" v-for="item in stallList" :key="item.suppId">
		 	    <!-- 店名 -->
		 	    <view class="stall-list-title" :data-id="item.suppId" @click="goStall">
		 	     <view class="stall-list-text">
		 	      <view>{{item.suppName}}</view>
		 	     </view>
		 	     <view class="stall-list-btn" >进店看看</view>
		 	    </view>
		 	    <!-- 列表 -->
		 	    <view class="stall-list-listing">
		 	     <view class="stall-list-details" v-for="k in item.goodsAppListVOList" :key="k.id" :data-id="k.id" @click="goodStore">
		 	      <view style="width: 207rpx; height: 207rpx;border-radius: 8rpx 8rpx 0px 0px;">
		 	       <image :src="imgObs + k.fileUrl" style="width: 100%; height:100%;border-radius: 8rpx 8rpx 0px 0px;background: rgba(238,238,238,1);"></image>
		 	      </view>
		 	      <view class="stall-list-text">
		 	       {{k.name}}
		 	      </view>
		 	      <view>
		 	       <text class="stall-list-price">￥ {{k.tradePrice}}</text>
		 	      </view>
		 	     </view>
		 	    </view>
		 	    <!-- 水平线 -->
		 	    <view class="stall-list-level"></view>
		 	    <view class="heatlist-address">
		 	     <view class="heatlist-icon">
		 	      <span class="iconfont">&#xe623;</span>
		 	      <text style="margin-left: 24rpx;">{{item.fullAddress}}</text>
		 	     </view>
		 	     <view style="padding-left: 24rpx;">{{item.distance || '0'}}km</view>
		 	    </view>
		 	 </view>
		 </view>
		 <!-- 空白 -->
		 <nodata :noText="noDataText" v-if="showShop === true"/>
	</view>
</template>

<script>
	import {getSuppsAndGoods, } from '@/utils/network/home.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {
				noDataText: '暂无数据~',
				loadingType: 'loading', // 加载更多状态
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				//分页
				current: 1,
				pages:1, // 总页数
				pageSize:10,
				sortLab:'', // 排序：asc为正序，desc为倒序
				sortType:'',// 排序字段 1为价格，2为销量， 3为上新
				tabsIndex:0, // 筛选默认选择
				numberOrder:0,// 销量筛选
				sortTypeId:'',// 首页跳转的商圈id
				stallList:[],
				topSearchValue:'',
				showShop:false
			}
		},
		onLoad(options) {
			  const that = this
				that.sortTypeId = JSON.parse(JSON.stringify(options.sortType)) 
				that.topSearchValue = JSON.parse(JSON.stringify(options.name)) + '商圈' // 顶部展示搜索值
				that.getstallList()
		},
		onReachBottom(){
			if(this.current < this.pages){
						 this.current++
						 const params={
						 	pageSize:this.pageSize,
						 	pageNum:this.current,
						 	search:this.search || '',
							fullName:this.stallName || '',
							areaId:this.sortTypeId || '',
							sortType:this.sortType || '',
						 }
						  getSuppsAndGoods(params).then(res=>{
							this.loadingType = 'loading'
						 	this.current=res.data.current
						 	this.stallList=[...this.stallList,...res.data.records]
							this.stallList.forEach(item => {
								if (item.distance) {
									if (item.distance > 100) {
										item.distance = parseInt(item.distance)
									}
									if (item.distance < 100) {
									item.distance =	parseFloat(item.distance).toFixed(1)
									}
								}else{
									item.distance = ''
								}
								
							})
						 })
			 }else{
				 this.loadingType = 'nomore'
				 return
			 }
			 // if(this.current = this.pages) {
			 // this.loadingType='nomore'
			 // return
			 // }
		},
		methods: {
			// 档口列表
			getstallList(){
				const that = this
				uni.showLoading({title: '加载中',duration: 1000});
				const perspective =	uni.getStorageSync('Longitude')
				const params={
					pageSize:that.pageSize,
					pageNum:that.current,
					areaId:that.sortTypeId,
					sort:that.sortLab || '',
					sortType:that.sortType || '',
					memLng: perspective.longitude || '', // 经度
					memLat: perspective.latitude || '' // 纬度
				}
				getSuppsAndGoods(params).then(res=>{
					// console.log("档口列表",res)
					that.stallList = res.data.records
					that.pages = res.data.pages
					that.stallList.forEach(item => {
						if (item.distance) {
							if (item.distance > 100) {
								item.distance = parseInt(item.distance)
							}
							if (item.distance < 100) {
							item.distance =	parseFloat(item.distance).toFixed(1)
							}
						}else{
							item.distance = ''
						}
						setTimeout(function () {
							const length = that.stallList.length
							that.shopStall = length !== 0 ? false : true
						}, 1000);
					})
					setTimeout(function () {uni.hideLoading();}, 1000);
				})
			},
			// 跳转档口详情
			goStall(e){
				console.log("跳转档口详情id:",e.currentTarget.dataset.id)
				uni.navigateTo({
				    url: '/pages/home/stallDetail/stallDetail?id='+ e.currentTarget.dataset.id
				});
			},
			// 跳转档口里的商品详情
			goodStore(e){
				uni.navigateTo({
				    url: '/pages/classify/classList?id='+ e.currentTarget.dataset.id
				});
			},
			 // 默认筛选
			 oldDefault(){
			 	let that = this
				that.current = 1
			 	that.tabsIndex = 0
			 	that.sortType = ''
			 	that.sortLab = ''
			 	that.getstallList()
			 },
			 // 销量筛选
			 number(e){
			 	let that = this
				that.current = 1
			 	that.tabsIndex = 1
			 	that.numberOrder = that.numberOrder === 1 ? 2 : 1
			 	if(that.numberOrder === 1){
			 		that.sortLab = 'asc'
			 	}else{
			 		that.sortLab = 'desc'
			 	}
			 	that.sortType = 2
			 	that.getstallList()
			 },
			 goBack(){
			 	uni.navigateBack({})
			 },
		}
	}
</script>

<style lang="scss" scoped>
	.container /deep/.uni-navbar--border{
		box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(0,0,0,0.08), 0rpx 2rpx 8rpx 0rpx #ffffff; 
	}
	.container /deep/ .uni-nav-bar-text{
		padding-left: 12rpx;
	}
	.tabActive{
		color:#795C98;
	}
  .container{
		background: #f9f9f9;
		height: 100vh;
		 .filter{
			 position: fixed;
			 width: 100%;
			 z-index: 9999;
			 background: #ffffff;
			 display: flex;
			 padding: 20rpx 32rpx;
			 box-shadow: 0 3px 6px -5px #ccc inset;
			 .filterBox{
			 	flex: 1;
			 	display: flex;
			 	height: 100%;
				font-size: 26rpx;
			 	font-weight: 500;
			 	.filterPop{
			 		line-height: 37rpx;
					padding-top: 3rpx;
			 		.iconf{
			 			width: 30rpx;
			 			line-height: 16rpx;
			 			font-size: 20rpx;
			 			text-align: center;
			 			color: #cccccc;
			 		}
			 		.active{
			 			color: #795C98;
			 		}
			 	}
			 }
			 .filterBox2{
			 	padding-right: 32rpx;
				font-size: 26rpx;
				font-weight: 500;
			 }
		 }
		 .stalls{
			position: relative;
			top:70rpx;
		  padding:8rpx 24rpx;
		  background: #F9F9F9;
			
		 	 .stallsList{
		 		 margin: 16rpx 0;
		 		 padding:24rpx;
		 		 background: #FFFFFF;
		 		 border-radius: 16rpx;
		 		 .stall-list-title{
		 		  display: flex;
		 		  justify-content: space-between;
		 		  align-items: center;
		 		  .stall-list-text{
		 		   font-size: 26rpx;
		 		   display: flex;
		 		  }
		 		  .stall-list-btn{
		 		   padding: 0 24rpx;
		 		   height: 40rpx;
		 			 line-height: 40rpx;
		 			 text-align: center;
		 			 color: #795C98;
		 			 font-size: 24rpx;
		 			 font-weight: 400;
		 		   border: 1rpx solid #795C98;
		 		   border-radius: 33rpx;
		 		  }
		 		 }
		 		 .stall-list-listing{
		 		  display: flex;
		 		  //padding:24rpx 0rpx;
					padding: 24rpx 0 8rpx 0;
		 		  .stall-list-details{
		 		   width: 207rpx;
		 		   // height: 300rpx;
		 		   margin-right: 17rpx;
		 		   opacity: 1;
		 		   //background: #f9f9f9;
		 		   border-radius: 8rpx;
		 		   .stall-list-text{
		 		    margin: 8rpx;
		 		    font-size: 24rpx;
		 		    text-align: justify;
		 		    text-align-last: left;
		 		    color: #333333;
		 		    line-height: 33rpx;
		 				text-overflow: -o-ellipsis-lastline;
		 				overflow: hidden;
		 				text-overflow: ellipsis;
		 				display: -webkit-box;
		 				-webkit-line-clamp: 1;
		 				line-clamp: 1;
		 				-webkit-box-orient: vertical;
		 		   }
		 		   .stall-list-price{
		 		    margin-left: 8rpx;
		 		    font-size: 24rpx;
		 		    font-weight: 500;
		 		    text-align: left;
		 		    color: #333333;
		 		    line-height: 33rpx;
		 		   }
		 		  }
		 		 }
		 		 .stall-list-level{
		 		  width: 654rpx;
		 		  height: 1rpx;
		 		  opacity: 1;
		 		  border-top: 1rpx solid #eeeeee;
		 		 }
		 		 .heatlist-address{
		 		 //background: red;
		 		 //height: 60rpx;
		 		  padding-top: 24rpx;
		 		  font-size: 24rpx;
		 		  color: rgba(51,51,51,0.50);
		 		  // line-height: 33px;
		 		  display: flex;
		 		  justify-content: space-between;
		 		  .heatlist-icon{
		 				 //background: green;
		 				 //height:60rpx;
		 				 //line-height: 60rpx;
		 				 max-width: 460rpx;
		 				 text-overflow: -o-ellipsis-lastline;
		 				 overflow: hidden;
		 				 text-overflow: ellipsis;
		 				 display: -webkit-box;
		 				 -webkit-line-clamp: 1;
		 				 line-clamp: 1;
		 				 -webkit-box-orient: vertical;
		 		  }
		 		 }
		 	 }
		 }
	}
</style>
