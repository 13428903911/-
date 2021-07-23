<template>
	<view class="container">
		<!-- <uni-nav-bar left-icon="back"  title="档口详情" fixed statusBar color="rgba(0,0,0,0.85)" @clickLeft="goBack"></uni-nav-bar> -->
		<nav-bar :title="title" @goBack="goBack"/>
		<!--  -->
		<view class="top">
			<view class="stallMessage">
				<view class="stallImg">
					<!-- <image :src="imgObs + stallData.suppUrl" mode=""></image> -->
					<image src="@/static/stall-logo.png"></image>
				</view>
				<view class="stallTitle">
					<view class="stallName">
						<view class="name">
							{{stallData.fullName || ''}}
						</view>
						<view class="collect" :style="{color:stallData.isCollect == 1?'#795C98':'rgba(51,51,51,0.5)'}" @click="collectStatus">
								<view class="iconfont icon-font" v-if="stallData.isCollect === 1">
									&#xe60a;
								</view>
								<view class="iconfont icon-font" v-else>
									&#xe602;
								</view>
								<view class="icon-text">
									 {{stallData.isCollect === 1?'已收藏':'收藏'}}
								</view>
						</view>
					</view>
					<view class="address">
						<view class="iconfont">
							&#xe621;
						</view>
						<view class="addressName">
							{{stallData.fullAddress || ''}}
						</view>
					</view>
					<!-- <view class="stallPraise">
						<view>好评率</view>
						<view class="progress">
							<progress percent="90" activeColor="#ED2648" border-radius="8" font-size="12"  stroke-width="8" />
						</view>
						<view style="color: #ED2648;font-weight: 500;">90%</view>
					</view>
					<view class="stallBuyback">
						<view>回购率</view>
						<view class="progressS">
							<progress percent="90" activeColor="#ED2648" border-radius="8" font-size="12"  stroke-width="8" />
						</view>
						<view style="color: #ED2648;font-weight: 500;">90%</view>
					</view> -->
				</view>
			</view>
			
		</view>
	   <!-- 筛选 -->
	    <view class="filter">
		    <view class="filterList">
				  <view class="filterBox2" style="margin-left:12rpx ;" @click="oldDefault(0)">
					  <view :class="{ tabActive:tabsIndex === 0 }" class="filterName2">默认</view>
			  	</view>
		    	<view class="filterBox" @click="news(1)">
		    		<view :class="{ tabActive:tabsIndex === 1 }" class="filterName">上新</view>
		    		<view class="filterPop">
		    			<view :class="{ active:tabsIndex === 1 && newOrder===1}"  class="iconfont iconf" >&#xe61d;</view>
		    			<view :class="{ active:tabsIndex === 1 && newOrder===2}"  class="iconfont iconf">&#xe615;</view>
		    		</view>
		    	</view>
		    	<view class="filterBox" @click="number(2)">
		    		<view :class="{ active:tabsIndex === 2 }" class="filterName">销量</view>
		    		<view class="filterPop">
		    			<view :class="{ active:tabsIndex === 2 && numberOrder===1}" class="iconfont iconf" >&#xe61d;</view>
		    			<view :class="{ active:tabsIndex === 2 && numberOrder===2}" class="iconfont iconf">&#xe615;</view>
		    		</view>
		    	</view>
		    	<view class="filterBox" @click="price(3)">
		    		<view :class="{ tabActive:tabsIndex === 3 }" class="filterName">价格</view>
		    		<view class="filterPop">
		    			<view :class="{ active:tabsIndex === 3 && priceOrder===1}" class="iconfont iconf" >&#xe61d;</view>
		    			<view :class="{ active:tabsIndex === 3 && priceOrder===2}" class="iconfont iconf">&#xe615;</view>
		    		</view>
		    	</view>
		    </view>
			<view class="search iconfont" @click="stallSearch">
				&#xe630;
			</view>
	    </view>
		<!-- 档口商品列表 -->
		<view class="stallList">
			<goodscard :leftData="leftData" :rightData="rightData" :showSimi="showSimi" @goGoods="goGoods"/>
		</view>
		<!-- 空白 -->
		<nodata :noText="noDataText" v-if="!goodsData.length"/>
		<view>
			<uni-load-more :status="loadingType" v-if="pages > 1"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import { getGoodsBySuppId , getSupplierBySuppId , collectSupplier } from '@/utils/network/api.js'
	import nodata from '@/components/no-data/no-data.vue'
	import goodscard from '@/components/goods-card/goods-card.vue'
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		components:{
			nodata,
			goodscard,
			navbar
		},
		data() {
			return {
				title:'档口详情',
				showSimi:false,
				noDataText: '暂无数据~',
				$token:'',
				loadingType: 'loading', //加载更多状态
				//分页
				current: 1,
				pages:1, // 总页数
				pageSize:10,
				sortLab:'', // 排序：asc为正序，desc为倒序
				sortType:'',// 排序字段 1为价格，2为销量， 3为上新
				tabsIndex:0, // 筛选默认选择
				newOrder:0,//上新筛选
				numberOrder:0,//销量筛选
				priceOrder:0,//价格筛选
				imgObs: 'https://yswl-cloud-service.obs.cn-north-4.myhuaweicloud.com/', //图片地址obs
				suppId:'', // 档口id
				collect:1, //收藏
				goodsData:[],
				leftData:[], // 左边商品
				rightData:[], // 右边商品
				stallData:{}
			}
		},
		onShow() {
			this.$token = uni.getStorageSync('authorization')
		},
		onLoad(options) {
			if(options.id) {
				this.suppId=JSON.parse(JSON.stringify(options.id))
			}
			this.getstallDetail()
			this.getbydetail()
			
		},
		// 触底刷新函数
		onReachBottom(){
		 if(this.current < this.pages){
			 this.current++
			 const params={
			 	supplierId: this.suppId,
			 	pageSize:this.pageSize,
			 	pageNum:this.current,
			 	sortType:this.sortType || '',
			 	sort:this.sortLab || ''
			 }
			  getGoodsBySuppId(params).then(res=>{
			 	this.current=res.data.current
			 	this.goodsData = [...this.goodsData,...res.data.records]
				if(this.goodsData.length > 1){
					this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
					this.rightData = this.goodsData.filter((item,index) => index % 2 !==0)
				}else{
					this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
					this.rightData = []
				}
			  })
		  }
		 if(this.current = this.pages) {
		 	this.loadingType='nomore'
		 	return
		  }
			 
		 },
		methods: {
			// 返回上一页
			goBack(){
				uni.navigateBack({})
			},
			// 获取档口详情
			getstallDetail () {
				getSupplierBySuppId({suppId:this.suppId}).then(res=>{
					//console.log("获取档口详情:",res)
					 this.stallData = res.data
				})
			},
			// 获取档口内的商品
			getbydetail() {
				const params={
					supplierId: this.suppId,
					pageSize:this.pageSize,
					pageNum:this.current,
					sortType:this.sortType || '',
					sort:this.sortLab || ''
				}
				getGoodsBySuppId(params).then(res => {
					const { records=[] } = res.data
					 this.goodsData = records
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
			// 收藏档口
			collectStatus(){
				if(this.$token){
					collectSupplier({suppId:this.suppId}).then(res=>{
						//console.log("收藏档口",res.data)
						if(this.stallData.isCollect === 1){
							uni.showToast({
								title:"取消收藏成功",
								icon:"none"
							})
						}else{
							uni.showToast({
								title:"收藏成功",
								icon:"none"
							})
						}
						this.getstallDetail()
					})
				}else{
					uni.showToast({
					  title:"请先登录" ,
						icon:"none"
					})
				}
			},
			// 跳转详情
			goGoods(id){
				// console.log("跳转详情id:",e.currentTarget.dataset.id)
				uni.navigateTo({
				    url: '/pages/classify/classList?id=' + id
				});
			},
			// 搜索档口内的商品
			stallSearch(){
				uni.navigateTo({
				    url: '/pages/search/stallSearch/stallSearch?stallId=' + this.suppId
				});
			},
			// 默认
			oldDefault(e){
				let that = this
				that.current = 1
				that.tabsIndex = 0
				that.sortType = ''
				that.sortLab = ''
				that.getbydetail()
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
				that.getbydetail()
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
				that.getbydetail()
			},
			// 价格筛选
			price(e){
				let that = this
				that.current = 1
				that.tabsIndex = 3
				that.priceOrder = that.priceOrder === 1 ? 2 : 1
				if(that.priceOrder === 1){
					that.sortLab = 'asc'
				}else{
					that.sortLab = 'desc'
				}
				that.sortType = 1
				that.getbydetail()
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.tabActive{
		color:#795C98;
	}
	.container /deep/.uni-navbar--border{box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff; }
  .container /deep/ .uni-progress{height: 33rpx;}
  .container{
	  background: #f9f9f9;
		height: 100vh;
	  // 档口信息
	  .top{
		  margin: 24rpx 16rpx 0 16rpx;
		  background: #ffffff;
		  border-radius: 16rpx;
		  .stallMessage{
			  padding: 24rpx;
			  display: flex;
			  .stallImg{
				  width: 128rpx;
				  height: 128rpx;
					border: 1rpx solid rgba(51,51,51,0.26);
				  border-radius: 5rpx;
				  image{
					  width: 100%;
					  height: 100%;
					  border-radius: 5rpx;
				  }
			  }
			  .stallTitle{
				  width: 536rpx;
				  height: 136rpx;
				  margin-left: 24rpx;
				  .stallName{
					  position: relative;
					  width:100%;
					  height: 48rpx;
					  display: flex;
					  .name{
						  max-width: 340rpx;
						  height: 37rpx;
						  padding-top: 16rpx;
						  line-height: 37rpx;
						  font-size: 26rpx;
						  font-weight: 500;
						  color: #333333;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							line-clamp: 1;
							-webkit-box-orient: vertical;
					  }
					  .collect{
						  position: absolute;
						  right: 0;
							display: flex;
						  background: #F9F9F9;
							padding: 2rpx 24rpx;
						  height: 48rpx;
						  line-height: 48rpx;
						  text-align: center;
						  border-radius: 32rpx;
						  color: rgba(51,51,51,0.5);
							font-size: 26rpx;
						  .icon-font{
								margin-top: 8rpx;
								width: 32rpx;
								height: 32rpx;
								line-height: 32rpx;
								font-size: 32rpx;
								//background: red;
							}
							.icon-text{
								line-height: 48rpx;
								padding-left: 8rpx;
							}
					  }
				  }
					.address{
					  display: flex;
					  height: 33rpx;
					  line-height: 33rpx;
						padding-top: 24rpx;
					  font-size: 24rpx;
					  color: rgba(51,51,51,0.5);
					  .addressName{
						  max-width: 580rpx;
						  padding-left: 16rpx;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							line-clamp: 1;
							-webkit-box-orient: vertical;
					  }
					}
				  .stallPraise{
					 // background: blue;
					  display: flex;
					  width:100%;
					  height: 33rpx;
					  line-height: 33rpx;
					  margin-top: 6rpx;
					  font-size: 24rpx;
					  color: #333333;
					  .progress{
						  width: 200rpx;
						  height: 16rpx;
						  margin-top: 8.5rpx;
						  padding: 0 24rpx;
					   }
				  }
				  .stallBuyback{
					  //background: blue;
					  display: flex;
					  width:100%;
					  height: 33rpx;
					  line-height: 33rpx;
					  margin-top: 6rpx;
					  font-size: 24rpx;
					  color: #333333;
					  .progressS{
						  width: 200rpx;
						  height: 16rpx;
						  margin-top: 8.5rpx;
						  padding: 0 24rpx;
					   }
				  }
			  }
		  }
		  
	  }
	  // 筛选
	  .filter{
		  background: #FFFFFF;
		  height: 90rpx;
		  margin:24rpx 16rpx 0 16rpx;
		  border-radius: 16rpx;
		  display: flex;
			font-size: 26rpx;
		  position: relative;
			font-weight: 500;
		  .filterList{
			  //background: #ccc;
			  height: 90rpx;
			  border-radius: 16rpx;
			  display: flex;
			  .filterBox2{
					// background: #ccc;
				  height: 60rpx;
				  line-height: 60rpx;
					padding: 0 12rpx 0 24rpx;
				  margin: 15rpx 0;
				  font-weight: 500;
				  .active3{
				  	color: #795C98;
				  }
			  }
			  .filterBox{
					//background: #cccccc;
			  	flex: 1;
			  	display: flex;
			  	height: 60rpx;
				  line-height: 60rpx;
			  	padding: 0 16rpx;
				  margin: 15rpx 0;
			  	font-weight: 500;
			  	.active2{
			  		color: #795C98;
			  	}
			  	.filterName{
			  		//background: yellow;
			  	}
			  	.filterPop{
						//background: red;
			  		height: 36rpx;
			  		padding-left: 6rpx;
						padding-top: 17rpx;
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
		  .search{
			  position: absolute;
			  right: 32rpx;
			  top:21rpx;
			  width: 48rpx;
			  height: 48rpx;
			  font-size: 48rpx;
		  }
	  }
	  // 档口商品列表
	  .stallList{
			 background: #F9F9F9;
			 padding: 24rpx 0rpx 0rpx 0rpx;
	  }
  }
</style>
