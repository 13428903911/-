<template>
	<view class="container">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar>
		    <view slot="left">
				<view class="search">
					<view class="iconfont" @click="back">&#xe618;</view>
					<text style="padding-right: 12rpx;">{{parentName}}</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="main">
		<!-- 筛选 -->
			<view class="filter">
				<view class="filterList">
				  <view class="filterBox2" style="margin-left:12rpx ;" @click="oldDefault(0)">
					  <view :class="{tabActive: tabsIndex === 0}" class="filterName2">默认</view>
					</view>
					<view class="filterBox" @click="news(1)">
						<view :class="{tabActive: tabsIndex === 1}" class="filterName">上新</view>
						<view class="filterPop">
							<view :class="{ active:tabsIndex === 1 && newOrder===1}" class="iconfont iconf" style="margin-top: 16rpx;">&#xe61d;</view>
							<view :class="{ active:tabsIndex === 1 && newOrder===2}" class="iconfont iconf">&#xe615;</view>
						</view>
					</view>
					<view class="filterBox" @click="number(2)">
						<view :class="{ tabActive:tabsIndex === 2 }" class="filterName">销量</view>
						<view class="filterPop">
							<view :class="{ active:tabsIndex === 2 && numberOrder===1}" class="iconfont iconf" style="margin-top: 16rpx;">&#xe61d;</view>
							<view :class="{ active:tabsIndex === 2 && numberOrder===2}" class="iconfont iconf">&#xe615;</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="goods">
				<goodscard :leftData="leftData" :rightData="rightData" @goGoods="goGoods" @goSimi="goSimi"/>
			</view>
			<!-- 空白 -->
			<nodata :noText="noDataText"  v-if="!goodsData.length"/>
		</view>
		<view>
			<uni-load-more :status="loadingType" iconType="auto" v-if="pages > 1"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import { classified } from '@/utils/network/api.js'
	import nodata from '@/components/no-data/no-data.vue'
	import goodscard from '@/components/goods-card/goods-card.vue'
	export default {
		components:{
			nodata,
			goodscard
		},
		data() {
			return {
				noDataText: '暂无数据~',
				loadingType: 'loading', //加载更多状态
				//分页
				current: 1,
				pages:1,
				pageSize:10,
				sortLab:'', // 排序：asc为正序，desc为倒序
				sortType:'',// 排序字段 1为价格，2为销量， 3为上新
				tabsIndex:0, // 筛选默认选择
				newOrder:0,//上新筛选
				numberOrder:0,//销量筛选
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				searchValue:'',
				goodsData:[],// 商品列表
				leftData:[], // 左边商品
				rightData:[], //右边商品
				secondCategoryId:'',
				parentName:'',
				sort:'',
				userId:'',
				$token:''
			}
		},
	  onLoad(options) {
				this.secondCategoryId = options.id
				this.parentName = options.names
				this.getTableData()
		},
		onShow() {
			this.$token = uni.getStorageSync('authorization')
		},
		// 触底刷新函数
		onReachBottom(){
		 if(this.current < this.pages){
				 this.current++
				 const params={
					secondCategoryId: this.secondCategoryId,
					pageSize:this.pageSize,
					pageNum:this.current,
					sortType:this.sortType || '',
					sort:this.sortLab || ''
				 }
				 classified(params).then(res=>{
						this.current=res.data.current
						this.goodsData=[...this.goodsData,...res.data.records]
						if(this.goodsData.length > 1){
							this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
							this.rightData = this.goodsData.filter((item,index) => index % 2 !==0)
						}else{
							this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
							this.rightData = []
						}
				  })
					this.loadingType = 'loading'
		  }else {
				this.loadingType = 'nomore'
				return
			}
		},
		methods: {
			// 获取列表数据
			getTableData() {
				const params={
					secondCategoryId: this.secondCategoryId,
					pageSize:this.pageSize,
					pageNum:this.current,
					sortType:this.sortType || '',
					sort:this.sortLab || ''
				}
				classified(params).then(res => {
						this.goodsData = res.data.records
						this.pages = res.data.pages
						if(this.goodsData.length > 1){
							this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
							this.rightData = this.goodsData.filter((item,index) => index % 2 !==0)
						}else{
							this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
							this.rightData = []
						}
				})
			},
			// 返回上一页
			back(){
				uni.navigateBack({})
			},
			// 点击搜索
			focusChange(){
				uni.navigateTo({
				    url: '/pages/search/search'
				});
			},
			//跳转详情
			goGoods(id){
				uni.navigateTo({
				    url: '/pages/classify/classList?id='+ id
				});
			},
			// 找相似
			goSimi(tradePrice,fileUrl,id,name,secondCategoryId){
				uni.navigateTo({
				    url: '/pages/home/similarity/similarity?id=' + id + '&name=' + name + '&price=' + tradePrice + '&img=' + fileUrl + "&upId=" + secondCategoryId
				});
			},
			//跳转档口详情
			goStall(e){
				uni.navigateTo({
				    url: '/pages/home/stallDetail/stallDetail'
				});
			},
			// 默认
			oldDefault(e){
				let that = this
				that.tabsIndex = 0
				that.sortType = ''
				that.sortLab = ''
				that.getTableData()
			},
			// 上新筛选
			news(e){
				let that = this
				that.current = 1
				that.tabsIndex = 1
				that.newOrder = that.newOrder === 1 ? 2 : 1
				if(that.newOrder === 1){
					that.sortLab = 'asc'
				}else{
					that.sortLab = 'desc'
				}
				that.sortType = 3
				that.getTableData()
			},
			// 销量筛选
			number(e){
				let that = this
				that.current = 1
				that.tabsIndex = 2
				that.numberOrder = that.numberOrder === 1 ? 2 : 1
				if(that.numberOrder === 1){
					that.sortLab = 'asc'
				}else{
					that.sortLab = 'desc'
				}
				that.sortType = 2
				that.getTableData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container /deep/.uni-navbar--border{
		border: none;
		box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff; 
	}
   .container{
	   height: 100vh;
	   background: #f9f9f9;
	   .main{
		   position: relative;
		   z-index: 1;
			 background: #F9F9F9;
		   // tabs切换
		   .tabs{
		   		  position: relative;
		   		    //background: red;
		   			width: 100%;
		   			font-size: 30rpx;
		   			display: flex;
		   			.mzytabs{
		   				//background: green;
		   				width: 260rpx;
		   			}
		   }
		   // 商品
		   .goods{
				padding: 24rpx 0;
		   }
	   }   
   }
	.filter{
	  background: #FFFFFF;
	  height: 90rpx;
	  // margin:24rpx 24rpx 0 24rpx;
	  // border-radius: 16rpx;
	  display: flex;
	  position: relative;
	  .filterList{
		  //background: #ccc;
		  height: 90rpx;
		  border-radius: 16rpx;
		  display: flex;
		  .filterBox2{
			  height: 60rpx;
			  line-height: 60rpx;
			  padding: 0 12rpx;
			  margin: 15rpx 0;
			  font-size: 26rpx;
				color: rgba(51,51,51,0.5);
		  }
		  .filterBox{
		  	flex: 1;
		  	display: flex;
		  	height: 60rpx;
			  line-height: 60rpx;
		  	padding: 0 12rpx;
			  margin: 15rpx 0;
		  	font-size: 26rpx;
				color: rgba(51,51,51,0.5);
		  	.filterName{
		  		//background: yellow;
		  	}
		  	.filterPop{
		  		width: 30rpx;
		  		height: 14rpx;
		  		margin-left: 6rpx;
		  		.iconf{
		  			height: 16rpx;
		  			line-height: 16rpx;
		  			font-size: 20rpx;
		  			text-align: center;
						color: #cccccc;
		  			//border: 1rpx solid black;
		  		}
					.active{
						color: #795C98;
					}
		  		
		  	}
		  }
	  }
	}
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
		margin: auto;
	}
 }
 .tabActive{
 	color:#795C98;
 }
</style>
