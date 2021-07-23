<template>
	<view class="container">
		<!-- 搜索 -->
		<uni-nav-bar fixed statusBar>
		  <view slot="left">
				<view class="search">
					<view class="goBack" @click="back">
						<span class="iconfont">&#xe618;</span>
					</view>
					<uni-search-bar :style="{width:widthSearch + 'px',height:height + 'px'}" placeholder="搜索" :radius="19" focus="true" cancelButton="none" v-model="searchValue" @input="inputChange" @confirm="confirmChange" @clear="clearValue"></uni-search-bar>
				</view>
			</view>
		</uni-nav-bar>
		<view class="main">
			<!-- 筛选 -->
			<view class="filter-main" v-if='showGoods === true'>
				<view class="filter" >
					<view class="filterBox" @click="news(1)">
						<view :class="{ tabActive:tabsIndex === 1 }" class="filterName">上新</view>
						<view class="filterPop">
							<view :class="{active: newOrder === 1 && tabsIndex === 1}" @click="maxNwe" class="iconfont iconf" >&#xe61d;</view>
							<view :class="{active: newOrder === 2 && tabsIndex === 1}" @click="minNwe" class="iconfont iconf">&#xe615;</view>
						</view>
					</view>
					<view class="filterBox" @click="price(2)">
						<view :class="{ tabActive:tabsIndex === 2 }" class="filterName">价格</view>
						<view class="filterPop">
							<view :class="{active: priceOrder === 1 && tabsIndex === 2}" @click="maxPrice" class="iconfont iconf" >&#xe61d;</view>
							<view :class="{active: priceOrder === 2 && tabsIndex === 2}" @click="minPrice" class="iconfont iconf">&#xe615;</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="goods" v-if='showGoods === true'>
					<goodscard :leftData="leftData" :rightData="rightData" :showSimi="showSimi" @goGoods="goGoods"/>
					<!-- 空白 -->
					<nodata :noText="noDataText" v-if="!goodsList.length"/>
			</view>
			<!-- 模糊查询 -->
			<view class="fuzzySearch" v-if='showfuzzy===true'>
				<view class="fuzzyData">
					<view class="fuzzyList" v-for="(item,index) in fuzzyData" :key="index" :data-name="item.name" :data-supid="item.supplierId" @click="fuzzyOpen">
					<rich-text :nodes="item.highLightName"></rich-text>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-load-more :status="loadingType" v-if="pages > 1"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import { getGoodsBySuppId } from "@/utils/network/api.js"
	import { findByNameAndId } from '@/utils/network/home.js'
	import nodata from '@/components/no-data/no-data.vue'
	import goodscard from '@/components/goods-card/goods-card.vue'
	export default {
		// filters:{
		// 	fuzzyL(name){
		// 			if(!name){
		// 				return
		// 			}
		// 			if(name.length>20){
		// 				return name.slice(0,20)+'...'
		// 			}else{
		// 				return name
		// 			}
		// 		}
		// },
		components:{
			nodata,
			goodscard
		},
		data() {
			return {
				width :uni.getMenuButtonBoundingClientRect().left - 12,
				widthSearch :uni.getMenuButtonBoundingClientRect().left - 36,
				showSimi:false,
				noDataText: '暂无数据~',
				loadingType: 'loading', //加载更多状态
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				//分页
				current: 1,
				pages:1, // 总页数
				pageSize:10,
				sortLab:'', // 排序：asc为正序，desc为倒序
				sortType:'',// 排序字段 1为价格，2为销量，3为上新
				tabsIndex:0, // 筛选默认选择
				newOrder:0,// 上新筛选
				priceOrder:0,// 价格筛选
				searchValue:'',
				supplierId:'', // 供应商id
				goodsName: '', // 商品名称
				showfuzzy:false,
				showGoods:false,
				fuzzyData:[],
				goodsList:[],
				leftData:[], // 左边商品
				rightData:[], // 右边商品
			}
		},
		onLoad(options){
			let that = this
			that.supplierId = options.stallId
		},
		// 触底刷新函数
		onReachBottom(){
		 if(this.current < this.pages){
			 this.current++
			 const params = {
			 	supplierId:this.supplierId,
			 	goodsName:this.goodsName,
			 	pageNum:this.current,
			 	pageSize:this.pageSize,
				sortType:this.sortType || '',
				sort:this.sortLab || ''
			 }
			  getGoodsBySuppId(params).then(res=>{
			 	this.current=res.data.current
			 	this.goodsList = [...this.goodsList,...res.data.records]
				if(this.goodsList.length > 1){
					this.leftData = this.goodsList.filter((item,index) => index % 2 ===0)
					this.rightData = this.goodsList.filter((item,index) => index % 2 !==0)
				}else{
					this.leftData = this.goodsList.filter((item,index) => index % 2 ===0)
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
			// 模糊查询
			searchData(){
				const params = {
					supplierId:this.supplierId,
					name:this.searchValue,
				}
				findByNameAndId(params).then(res => {
					this.fuzzyData = res.data
					this.fuzzyData.forEach(item => {
						item.highLightName = item.highLightName.replace(/\<span/gi, '<span style="color:rgba(121,92,152,1)"')
					})
				})
			},
			// 商品列表
			getData(){
				const params = {
					supplierId:this.supplierId,
					goodsName:this.goodsName,
					pageNum:this.current,
					pageSize:this.pageSize,
					sortType:this.sortType || '',
					sort:this.sortLab || ''
				}
				getGoodsBySuppId(params).then(res => {
					this.goodsList = res.data.records
					this.pages = res.data.pages
					// console.log("getData:",this.fuzzyData)
					if(this.goodsList.length > 1){
						this.leftData = this.goodsList.filter((item,index) => index % 2 ===0)
						this.rightData = this.goodsList.filter((item,index) => index % 2 !==0)
					}else{
						this.leftData = this.goodsList.filter((item,index) => index % 2 ===0)
						this.rightData = []
					}
				})
			},
			//点击数据
			fuzzyOpen(e){
				//console.log("点击数据:",e.currentTarget.dataset)
				this.goodsName = e.currentTarget.dataset.name
				this.supplierId = e.currentTarget.dataset.supid
				this.pageSize = 10
				this.current = 1
				this.getData()
				this.showGoods=true
				this.showfuzzy=false
			},
			// 搜索
			inputChange(e){
				console.log("搜索",e)
				this.searchValue=e
				this.showfuzzy=true
				this.showGoods=false
				if(this.searchValue !== ''){
					this.searchData()
				}else{
					this.searchData()
					this.fuzzyData = []
					this.goodsList = []
				}
			},
			// 点击确认
			confirmChange(){
				const that=this
				if(that.searchValue && that.searchValue !== ''){
					that.goodsName = that.searchValue
					that.showfuzzy=false
					that.showGoods=true
					that.getData()
				}
			},
			//清除输入框
			clearValue(){
				this.showfuzzy=false
				this.showGoods=false
				this.fuzzyData = []
				this.goodsList = []
			},
			// 返回上一页
			back(){
				uni.navigateBack({})
			},
			// 跳转商品详情
			goGoods(id){
				// console.log("跳转详情id:",e)
				uni.navigateTo({
				    url: '/pages/classify/classList?id=' + id
				});
			},
			//上新筛选
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
				that.getData()
			},
			//价格筛选
			price(e){
				let that = this
				that.current = 1
				that.tabsIndex = 2
				that.priceOrder = that.priceOrder === 1 ? 2 : 1
				if(that.priceOrder === 1){
					that.sortLab = 'asc'
				}else{
					that.sortLab = 'desc'
				}
				that.sortType = 1
				that.getData()
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.tabActive{
		color:#795C98;
	}
	 .container /deep/.uni-navbar--border{box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff; }
   .container /deep/ .uni-searchbar__box{width: 444rpx;height: 60rpx;border: none;position: relative;left: 0rpx;bottom: 14rpx;}
   .container{
	   background: #f9f9f9;
	   height: 100vh;
		.search{
			//background: green;
			background-color: #ffffff;
			position: relative;
			bottom: 4rpx;
			display: flex;
			width: 100%;
			height: 60rpx;
			.goBack{
				//background: red;
				position: relative;
				top:6rpx;
				width: 48rpx;
				height: 48rpx;
				line-height: 48rpx;
				left: 0rpx;
				span{
					width: 100%;
					height: 100%;
					font-size: 48rpx;
				}
			}
		}
	   		
	   
	   .main{
		   
		   background: #f9f9f9;
		   //筛选
		   .filter-main{
			    background: #ffffff;
			   .filter{
				   height: 90rpx;
				   margin: 0 24rpx;
				   display: flex;
			   			 .filterBox{
			   			   	// flex: 1;
			   			   	display: flex;
			   			   	// height: 60rpx;
			   			   	line-height: 60rpx;
			   			   	padding: 0 12rpx;
			   			   	margin: 15rpx 0;
			   			   	font-size: 26rpx;
			   			   	font-weight: 500;
			   			   	.filterPop{
			   			   		width: 30rpx;
			   			   		height: 36rpx;
			   			   		margin-left: 6rpx;
										padding-top: 17rpx;
			   			   		.iconf{
			   			   			height: 15rpx;
			   			   			line-height: 15rpx;
			   			   			font-size: 20rpx;
			   			   			text-align: center;
											color: #eeeeee;
			   			   		}
			   			   		.active{
			   			   			color: #795C98;
			   			   		}
			   			   		
			   			   	}
			   		}
			   }
		   }
		   
		   //商品信息
		   .goods{
		   	// margin:0rpx 16rpx;
		   	margin-top: 24rpx;
		   }
		   // 模糊查询
		   .fuzzySearch{
				 //  background: #ccc;
					// padding:32rpx 32rpx;
					padding:0 32rpx;
		   		  .fuzzyData{
		   			  width: 100%;
		   			  font-size: 30rpx;
		   			  color: #333333;
		   			  .fuzzyList{
		   				  line-height: 80rpx;
		   				  border-bottom:1rpx solid #EEEEEE;
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
