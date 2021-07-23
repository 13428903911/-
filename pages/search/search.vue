<template>
	<view class="container">
		<!-- 搜索 -->
		<view  class="top-box" :style="{width:'100%',height:topheight + 'px'}">
			<view class="search" :style="{width:width + 'px',height:height + 'px',bottom:8 + 'px'}">
				<view class="goBack" :style="{height:height + 'px',lineHeight:height + 'px'}" @click="back">
					<span class="iconfont">&#xe618;</span>
				</view>
				<uni-search-bar :style="{width:widthSearch + 'px',height:height + 'px'}" placeholder="搜索" :radius="19" focus="true" cancelButton="none" v-model="searchValue" @blur="inputBlur" @input="inputChange" @confirm="confirmChange"></uni-search-bar>
			</view>
		</view>
		<!-- 搜索历史/热搜 -->
		<view class="main"  v-show='searchValue==""' :style="{top:topheight + 'px'}">
			 <view class="history">
				 <view class="historyName">
				 	<view class="historyTitle">
				 		历史记录
				 	</view>
					<view class="historyIcon" @click="claerhistory"><view class="iconfont" style="color:rgba(51,51,51,0.5) ;">&#xe60e;</view></view>
				 </view>
				 <!-- 清除浮动 -->
				 <view style="clear: both"></view>
				 <view class="historyDelete historyNone" v-if="!historyList.length>0">
				   <view class="none">
				 	   暂无搜索历史
				   </view>
				 </view>
				 <view class="historyDelete">
				 	<view class="historyList" v-for="(item,index) in historyList" :key="index" :data-id="item.id" @click="goHistory(item)">
						<view style="padding: 0 24rpx">
							{{item | searchL}}
						</view>
					</view>
				 </view>
			 	
			 </view>
			 <!-- <view class="hotBot">
				 <view class="hotBotName">
				 	<view class="hotBotTitle">
				 		搜索推荐
				 	</view>
				 </view>
				<view style="clear: both"></view>
				<view class="hotBotSearch">
					<view class="hotBotList historyList" v-for="(item,index) in historyList" :key="index" :data-id="item.id" @click="hotBotId">
						<view :class="{'iconfont':item.icon}" style="padding: 0 20rpx;">&#xe616;{{item.search | searchL}}</view>
					</view>
				</view>
			</view> -->
		</view>
		<!-- 模糊查询 -->
		<view class="fuzzySearch"  v-show='searchValue!==""' :style="{top:topheight + 'px'}">
			<view class="searchStall">
				<view class="stallIcon">
					<view class="iconfont">
						&#xe624;
					</view>
				</view>
				<view class="stallTltle" @click="goStall">
					搜索相关档口
				</view>
			</view>
			<view class="fuzzyData">
				<view class="fuzzyList" v-for="(item,index) in fuzzyData" :key="index" :data-id="item.id" :data-name="item.name" @click="fuzzyOpen">
				<!-- 	<view v-html="item.highLightName" class="search-view"></view> -->
				  <rich-text :nodes="item.highLightName" class="search-view"></rich-text>
				</view>
			</view>
			<!-- 空白 -->
			<nodata :noText="noDataText" v-if="!fuzzyData.length"/>
		</view>
	</view>
</template>

<script>
	import {selectGoodsByCate , selectByName } from '@/utils/network/home.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{
			nodata,
		},
		filters:{
			// 历史搜索展示限制
			searchL(search){
				if(!search){
					return
				}
				if(search.length>4){
					return search.slice(0,4)+'...'
				}else{
					return search
				}
			},
		},
		data() {
			return {
				noDataText: '未找到相关产品',
				classIndex: '', // 分类跳过来传的数字
				topheight :uni.getMenuButtonBoundingClientRect().bottom + 8,
			  height :uni.getMenuButtonBoundingClientRect().height,
				top :uni.getMenuButtonBoundingClientRect().top,
				width :uni.getMenuButtonBoundingClientRect().left - 12,
				widthSearch :uni.getMenuButtonBoundingClientRect().left - 36,
				//分页
				current: 1,
				pages:1,
				pageSize:10,
				searchValue:'',//搜索框的值
				historyList:[],
				// historyList:[{id:1,search:"搜索1",icon:"1"},{id:2,search:"搜索2",},{id:3,search:"搜索3搜索3搜索3搜索3搜索3"},{id:4,search:"搜索4"}],
				fuzzyData:[],
				timeout:null
			}
		},
		onShow() {
			this.getSearch()
		},
		onLoad(options){
			const vm = this
			if(options.classIndex) {
				vm.classIndex = options.classIndex
			}
		},
		methods: {
			//模糊查询列表
			getfuzzyList(){
				const params={
					// pageSize:this.pageSize,
					// pageNum:this.current,
					name:this.searchValue
				}
				selectByName(params).then(res=>{
					// console.log("查询分类",res)
					this.fuzzyData=res.data
					this.fuzzyData.forEach(item => {
						item.highLightName = item.highLightName.replace(/\<span/gi, '<span style="color:rgba(121,92,152,1)"')
					})
				})
			},
			// 返回上一页
			back(){
				const vm = this
				if (vm.classIndex) { // 跳分类
					uni.reLaunch({
					   url: '/pages/classify/classify'
					})
				}else{
					uni.reLaunch({ // 跳首页
					   url: '/pages/home/home'
					})
				}
			},
			// 获取本地储存的搜索历史
			getSearch(){
				const that = this
				uni.getStorage({
					key:"historyList",
					success:function(res){
						// console.log("获取本地储存的搜索历史",res.data)
						that.historyList = res.data
					}
				})
			},
			// 搜索框失去焦点
			inputBlur(e){
				const that = this
				const searchV = e.value.replace(/\s*/g, "");
				const historyList = JSON.parse(JSON.stringify(that.historyList))
				if(searchV !== ''){
					historyList.unshift(searchV)
				}
				const list = that.deweight(historyList)
				if(list.length > 5){
					list.length = 5
				}
				uni.setStorageSync("historyList",list)
			},
			// 去重
			deweight(a){
				return [...new Set(a)]
			},
			// 清空搜索历史
			claerhistory(){
				uni.removeStorageSync('historyList')
				this.historyList = []
			},
			//点击历史搜索
			goHistory(e){
				// console.log("历史搜索:",e)
				uni.navigateTo({
						url: '/pages/home/listPage/listPage?name='+ e
				});
			},
			// 搜索
			 inputChange(e){
				const vm = this
				vm.searchValue=e.replace(/\s*/g, "")
				if(vm.searchValue && vm.searchValue !== ''){
				 clearTimeout(vm.timeout);
					vm.timeout = setTimeout(() => {
					 vm.getfuzzyList()
				 }, 500);
        }
			},
			// 点击确认
			confirmChange(){
				const that=this
				if(that.searchValue && that.searchValue !== ''){
					uni.navigateTo({
					    url: '/pages/home/listPage/listPage?active=0&name=' + that.searchValue
					});
				}else{
					uni.showToast({
					  title:"搜索内容不能为空" ,
						icon:"none"
					})
				}
			},
			//点击搜索推荐
			hotBotId(e){
				console.log("搜索推荐id:",e.currentTarget.dataset.id)
				uni.navigateTo({
				    url: '/pages/home/listPage/listPage?id='+ e.currentTarget.dataset.id
				});
			},
			//跳转详情
			fuzzyOpen(e){
				console.log("跳转详情:",e.currentTarget.dataset.id)
				uni.navigateTo({
				    url: '/pages/home/listPage/listPage?active=0&name=' + e.currentTarget.dataset.name + '&id=' + e.currentTarget.dataset.id
				});
			},
			// 搜索相关档口
			goStall(){
				if(this.searchValue && this.searchValue !== ''){
					uni.navigateTo({
					    url: '/pages/home/listPage/listPage?active=1&name=' + this.searchValue
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-view /deep/ text {
			font-style: normal;
			color: #ED2648;
	}
	// .container /deep/.uni-navbar--border{box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff; }
  .container{
	  height: 100vh;
		background: #ffffff;
		//box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.10), 0px 2px 8px 0px #ffffff; 
		.top-box{
			position: fixed;
			z-index: 999;
			background: #fff;
			box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.08), 0px 2rpx 8rpx 0px #ffffff;
			.search{
				position: absolute;
				left: 0;
				display: flex;
				.goBack{
					float: left;
					margin: 0 18rpx;
					span{
						width: 100%;
						height: 100%;
						font-size: 48rpx;
					}
				}
				/deep/ .uni-searchbar__box{border: none;height: 60rpx;position: absolute;bottom: 0;left: 0;right: 0;top: 0;}
			}
		} 		
	  // 搜索历史&热搜
	  .main{
			position: relative;
		  padding:32rpx 32rpx;
		  color: #333333;
		  .history{
			  width: 100%;
			  .historyName{
				  .historyTitle{
						  height: 48rpx;
						  line-height: 48rpx;
						  font-size: 34rpx;
						  text-align: left;
						  font-weight: bold;
						  float: left;
				  }
				  .historyIcon{
						  width: 48rpx;
						  height: 48rpx;
						  float: right;
				  			view{
								width: 100%;
								height: 100%;
							    font-size: 48rpx;
				  				}
				  }  
			  }
			  .historyNone{
				  display: flex;
				  justify-content: center;
				  align-items: center;
				  min-height: 200rpx;
				  text-align: center;
				  line-height: 200rpx;
				  color: rgba(51,51,51,0.26);
				  .none{
						font-size: 30rpx;
					}
			  }
			  .historyDelete{
			  		//background: #dd5b6d;
						max-height: 260rpx;
						padding: 20rpx 0rpx;
						display: flex;
						flex-wrap: wrap;
						align-content: flex-start;
					.historyList{
						margin: 16rpx 16rpx;
						height: 64rpx;
						min-width: 138rpx;
						max-width: 300rpx;
						overflow: hidden;
						line-height: 64rpx;
						font-size: 30rpx;
						text-align: center;
						background: #f9f9f9;
						border-radius: 36rpx;
					}
			  }
			 
		  }
		  .hotBot{
			   width: 100%;
			  .hotBotName{
				  .hotBotTitle{
					  height: 48rpx;
					  line-height: 48rpx;
					  font-size: 34rpx;
					  text-align: left;
					  color: #333333;
					  font-weight: bold;
					  float: left;
				  }
			  }
			  .hotBotSearch{
				  max-height: 260rpx;
				  padding: 20rpx 0rpx;
				  display: flex;
				  flex-wrap: wrap;
				  align-content: flex-start;
				  .hotBotList{
					  margin: 16rpx 16rpx;
					  height: 64rpx;
					  min-width: 158rpx;
					  max-width: 300rpx;
					  overflow: hidden;
					  line-height: 64rpx;
					  font-size: 30rpx;
					  text-align: center;
					  background: #ffffff;
					  border-radius: 32rpx;
				  }
			  }
		  }
	  }
	  // 模糊查询
	  .fuzzySearch{
			position: relative;
		  padding:32rpx 32rpx;
		  .searchStall{
			 width: 100%;
			 height: 48rpx;
			 display: flex;
			 flex-wrap: wrap;
			 .stallIcon{
				 //background: green;
				 width: 48rpx;
				 height: 48rpx;
				 view{
				 	width: 100%;
				 	height: 100%;
				  color: #2582FF;
				 	font-size: 48rpx;
				 }
			 }
			 .stallTltle{
				 height: 48rpx;
				 line-height: 48rpx;
				 padding-left: 30rpx;
				 color: #2582FF;
				 font-size: 30rpx;
			 }
		  }
		  .fuzzyData{
			  width: 100%;
			  font-size: 30rpx;
			  color: #333333;
			  .fuzzyList{
					width: 100%;
				  height: 103rpx;
				  line-height: 103rpx;
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
</style>
