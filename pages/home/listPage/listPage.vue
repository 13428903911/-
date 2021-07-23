<template>
	<view class="container">
		<!-- 搜索 -->
		<uni-nav-bar fixed statusBar>
			<view slot="left">
				<view class="search" :style="{height:height + 'px',width:width + 'px'}">
					<view class="goBack" @click="back" :style="{height:height + 'px',lineHeight:height + 'px'}">
						<view class="iconfont" :style="{fontSize:24 + 'px'}">
							&#xe618;
						</view>
					</view>
					<view class="input" @click="focusChange" :style="{height:height + 'px',lineHeight:height + 'px'}">
						<view class="icon" :style="{height:height + 'px',lineHeight:height + 'px',marginLeft:12 + 'px' }"><view class="iconfont">&#xe630;</view></view>
						<view class="searchValue" :style="{fontSize:13 + 'px',marginLeft:30 + 'px'}">{{topSearchValue}}</view>
					</view>
				</view>
		</view>
		</uni-nav-bar>
		<view class="main">
			<!-- tabs选项卡 -->
			<view class="tabs">
				<view class="mzytabs">
					<ms-tabs :list="carinfos" v-model="active" itemColor='#795C98' lineColor='#795C98' @input="handleChange"></ms-tabs>
				</view>
				<!-- 筛选 -->
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
					<view class="filterBox"  @click="price(2)" v-if="active === 0">
						<view  class="filterName" :class="{ tabActive:tabsIndex === 2 }">价格</view>
						<view class="filterPop">
							<view :class="{active: priceOrder === 1 && tabsIndex === 2}"  class="iconfont iconf" >&#xe61d;</view>
							<view :class="{active: priceOrder === 2 && tabsIndex === 2}"  class="iconfont iconf">&#xe615;</view>
						</view>
					</view>
					<!-- <view class="filterBox"  @click="luck(3)" v-if="active === 1">
						<view  class="filterName" style="width: 80rpx;" :class="{ tabActive:tabsIndex === 3 }">好评率</view>
						<view class="filterPop">
							<view :class="{active: luckOrder === 1 && tabsIndex === 3}"  class="iconfont iconf" >&#xe61d;</view>
							<view :class="{active: luckOrder === 2 && tabsIndex === 3}"  class="iconfont iconf">&#xe615;</view>
						</view>
					</view> -->
			  </view>
			</view>
			<!-- 商品 -->
			<view class="goods" v-if="active === 0">
				<goodscard :leftData="leftData" :rightData="rightData" @goGoods="goGoods" @goSimi="goSimi"/>
			</view>
			<!-- 档口 -->
			<view class="stalls" v-if="active === 1">
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
				       <image :src="imgObs + k.fileUrl" style="width: 100%; height:100%;border-radius: 8rpx 8rpx 0px 0px;"></image>
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
				     <view style="padding-left: 24rpx;">{{item.distance}}km</view>
				    </view>
				 </view>
			</view>
			<!-- 空白 -->
			<nodata :noText="noDataText" v-if="showGoods === true && active === 0"/>
			<nodata :noText="noDataText2" v-if="showStall === true && active === 1"/>
			<view>
				<uni-load-more :status="loadingType" v-if="pages > 1"></uni-load-more>
			</view>
		</view>
	</view>
</template>

<script>
	import { selectGoodsByCate, getSuppsAndGoods, } from '@/utils/network/home.js'
	import goodscard from '@/components/goods-card/goods-card.vue'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{
			nodata,
			goodscard
		},
		data() {
			return {
				noDataText: '暂无商品~',
				noDataText2: '暂无档口~',
				height :uni.getMenuButtonBoundingClientRect().height,
				width :uni.getMenuButtonBoundingClientRect().left - 20,
				loadingType: 'loading', // 加载更多状态
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				topSearchValue:'', //顶部搜索名称
				goodsName:'', // 按照商品名称查询
				stallName:'', // 搜索的档口名称
				search:'', // 搜索分类id
				//分页
				current: 1,
				pages:1, // 总页数
				pageSize:10,
				sortLab:'', // 排序：asc为正序，desc为倒序
				sortType:'',// 排序字段 1为价格，2为销量， 3为上新
				sortTypeId:'',// 首页跳转的商圈id
				numberOrder:0,// 销量筛选
				priceOrder:0,// 价格筛选
				luckOrder:0, // 好评率筛选
				active:0,// tabs默认选择
				tabsIndex:0, // 筛选默认选择
				carinfos:[{ title: '商品', value: 1 }, { title: '档口',  value: 2}],
				goodsData:[],// 商品列表
				leftData:[], // 左边商品
				rightData:[], //右边商品
				stallList: [],// 档口列表
				$token:'',
				attrId:null, // 首页风格id
				selectType:null, // 查询类型：1为可进行风格或场合查询，使用此字段时，可使用attrId进行风格和场合的商品查询
				showGoods:false, // 判断商品初始展示
				showStall:false
			}
		},
		onLoad(options){
			const that=this
			// 接收路由传参
			// 直接enter进入
			if(options.name){
				that.goodsName = JSON.parse(JSON.stringify(options.name))// 商品名称
				that.stallName = JSON.parse(JSON.stringify(options.name))// 档口名称
				that.topSearchValue = JSON.parse(JSON.stringify(options.name))// 顶部展示搜索值
			}
			// 首页风格
			if(options.attrId){
				that.attrId = options.attrId
				that.selectType = 1
				that.goodsName = ''
			}
			// 首页卡片进入
			if(options.sortType && options.name){
				that.sortTypeId = JSON.parse(JSON.stringify(options.sortType)) // 一期根据定死id分类
				that.topSearchValue = JSON.parse(JSON.stringify(options.name)) // 顶部展示搜索值
				that.stallName = '' // 从首页进入时不能传档口名称查询
			}
			// 搜索分类进入
			if(options.id){
				that.search = JSON.parse(JSON.stringify(options.id)) // 分类id & 商品id
			}
			if(options.active){
				const type = JSON.parse(JSON.stringify(options.active))
				that.active =  parseInt(type) // 转换active为数字类型
			}
			if (that.active === 0) {
				// console.log('搜索商品')
				this.getfuzzyList()
			} else {
				// console.log('搜索档口')
				this.getstallList()
			}
		},
		onShow() {
			this.$token = uni.getStorageSync('authorization')
		},
		// 触底刷新函数
		onReachBottom(){
			if(this.active === 0){
				if(this.current < this.pages){
							 this.current++
							 const params={
							 	pageSize:this.pageSize,
							 	pageNum:this.current,
								goodsName:this.goodsName || '',
							 	search:this.search || '',
							 	sortType:this.sortType || '',
							 	sort:this.sortLab || '',
								selectType:this.selectType,
								attrId:this.attrId
							 }
							  selectGoodsByCate(params).then(res=>{
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
				 }else{
					 	this.loadingType = 'nomore'
					 	return
				 }
				
			}else{
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
			} 
		 },
		methods: {
			tabClick(e){
				console.log("number",e)
			},
			// 商品列表
			getfuzzyList(){
				const that = this
				uni.showLoading({title: '加载中',duration: 1000});
				const params={
					pageSize:that.pageSize,
					pageNum:that.current,
					goodsName:that.goodsName || '',
					search:that.search,
					sortType:that.sortType || '',
					sort:that.sortLab || '',
					selectType:that.selectType,
					attrId:that.attrId
				}
				selectGoodsByCate(params).then(res=>{
					that.goodsData = res.data.records
					that.pages = res.data.pages
					if(that.goodsData.length > 1){
						that.leftData = that.goodsData.filter((item,index) => index % 2 ===0)
						that.rightData = that.goodsData.filter((item,index) => index % 2 !==0)
					}else{
						that.leftData = that.goodsData.filter((item,index) => index % 2 ===0)
						that.rightData = []
					}
					setTimeout(function () {
						const length = that.goodsData.length
						that.showGoods = length !== 0 ? false : true
					}, 1000);
				})
				setTimeout(function () {uni.hideLoading()}, 1000);
			},
			// 档口列表
			getstallList(){
				const that = this
				uni.showLoading({title: '加载中',duration: 1000});
				// 获取经纬度
				const perspective =	uni.getStorageSync('Longitude')
				const params={
					pageSize:that.pageSize,
					pageNum:that.current,
					search:that.search || '',
					fullName:that.stallName || '',
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
					})
					setTimeout(function () {
						const length = that.stallList.length
						that.showStall = length !== 0 ? false : true
					}, 1000);
				})
				setTimeout(function () {uni.hideLoading();}, 1000);
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
			// 跳转商品详情
			goGoods(id){
				//console.log("跳转详情id:",e.currentTarget.dataset.id)
				uni.navigateTo({
				    url: '/pages/classify/classList?id='+ id
				});
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
			//找相似
			goSimi(tradePrice,fileUrl,id,name,secondCategoryId){
				uni.navigateTo({
				    url: '/pages/home/similarity/similarity?id=' + id + '&name=' + name + '&price=' + tradePrice + '&img=' + fileUrl + "&upId=" + secondCategoryId
				});
			},
			// tabs切换
			handleChange(index,tab){
				const that=this
				that.active = index
				that.tabsIndex = 0
				that.numberOrder = 0 // 销量筛选
				that.priceOrder = 0 // 价格筛选
				that.sortLab = '' // 排序：asc为正序，desc为倒序
				that.sortType = '' // 排序字段 1为价格，2为销量,3为上新
				that.pageSize = 10
				that.current = 1
				if(that.active === 0){
					that.showGoods = false
					that.getfuzzyList()
				}else{
					that.showStall = false
					that.getstallList()
				}
			},
			// 默认筛选
			oldDefault(){
				let that = this
				that.current = 1
				that.tabsIndex = 0
				that.sortType = ''
				that.sortLab = ''
				if(that.active === 0){
					that.getfuzzyList()
				}else{
					that.getstallList()
				}
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
				if(that.active === 0){
					that.getfuzzyList()
				}else{
					that.getstallList()
				}
			},
			// 价格筛选
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
				if(that.active === 0){
					that.getfuzzyList()
				}else{
					that.getstallList()
				}
			},
			// 好评率
			luck(e){
				let that = this
				that.current = 1
				that.tabsIndex = 3
				that.luckOrder = that.luckOrder === 1 ? 2 : 1
				if(that.luckOrder === 1){
					that.sortLab = 'asc'
				}else{
					that.sortLab = 'desc'
				}
				that.sortType = 3
				if(that.active === 0){
					that.getfuzzyList()
				}else{
					that.getstallList()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabActive{
		color:#795C98;
	}
   .container /deep/ .uni-navbar__header{width: 100%;font-size: 34rpx;z-index: 1;}
	 .container /deep/.uni-navbar--border{
		 // box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff;
		 border: none;
		}
   .container{
	   height: 100vh;
	   background: #f9f9f9;
	   // 搜索
		.search{
			//background: #ccc;
			background: #FFFFFF;
			position: relative;
			bottom:6rpx;
			display: flex;
			.goBack{
				//background: red;
				position: relative;
				view{
					padding: 0 16rpx 0 8rpx;
				}
			}
			.input{
				display: flex;
				background: #F3F3F3;
			  width: 100%;
				font-size: 26rpx;
				color: rgba(51,51,51,1);
				border-radius: 38rpx;
				text-align: center;
				.icon{
					position: absolute;
					
					view{
						width:100%;
						height:100%;
					}
				}
				.searchValue{
					//background: red;
					position: relative;
				
					
					text-align: left;
					overflow: hidden;
				}
			}
		}
		
	   .main{
		   // tabs切换
			 background: #f9f9f9;
		   .tabs{
					 position: fixed;
					 z-index: 999;
					 background: #ffffff;
					 padding-top: 12rpx ;
					 width: 100%;
					 height: 60rpx;
		   		 font-size: 30rpx;
		   		 display: flex;
					 box-shadow: 0 3px 10px -5px #ccc inset;
		   			.mzytabs{
		   				// background: green;
		   				width: 200rpx;
		   			}
		   			.filter{
						  display: flex;
		   				position: absolute;
		   				right: 24rpx;
							font-size: 26rpx;
		   				//width: 360rpx;
		   				height: 60rpx;
						  line-height: 60rpx;
							.filterBox2{
								padding-right: 16rpx;
							  font-weight: 500;
							}
						.filterBox{
							flex: 1;
							display: flex;
							height: 100%;
							padding: 0 12rpx;
							font-weight: 500;
							.filterPop{
								height: 36rpx;
								margin-top: 17rpx;
								.iconf{
									width: 30rpx;
									height: 16rpx;
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
						
		   			}
		   }
		   // 商品
		   .goods{
				 background: #F9F9F9;
				 // padding: 96rpx 16rpx 0rpx 16rpx;
				 padding-top: 96rpx;
		   }
		   // 档口
		    .stalls{
		     padding:80rpx 24rpx 0 24rpx;
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
		   			  padding:24rpx 0rpx;
		   			  .stall-list-details{
		   			   width: 207rpx;
		   			   height: 330rpx;
		   			   margin-right: 17rpx;
		   			   opacity: 1;
		   			   background: #f9f9f9;
		   			   border-radius: 8rpx;
		   			   .stall-list-text{
		   			    margin: 8rpx;
		   			    font-size: 24rpx;
		   			    text-align: left;
		   			    color: #333333;
		   			    line-height: 33rpx;
								align-items: center;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								line-clamp: 2;
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
	   
	   
   }
</style>
