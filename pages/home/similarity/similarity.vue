<template>
	<view class="container">
	  <nav-bar :title="title" @goBack="goBack"/>
		<!-- 类似商品 -->
		<view class="box">
			<view class="boxLeft">
				<image :src="imgObs + oldData.img" mode=""></image>
			</view>
			<view class="boxRight">
				<view class="rightName">
					{{oldData.name}}
				</view>
				<view class="rightProice">
					￥{{oldData.price}}
				</view>
			</view>
		</view>
		<view class="main">
			<view class="title">
				更多相似推荐
			</view>
			<!-- 更多推荐 -->
		  <goodscard :leftData="leftData" :rightData="rightData" :showSimi="showSimi" @goGoods="goGoods"/>
			<!-- 空白 -->
			<nodata :noText="noDataText" v-if="!goodsData.length"/>
		</view>
		<view>
			<uni-load-more :status="loadingType" v-if="pages > 1"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import { selectGoodsByCate } from '@/utils/network/home.js'
	import goodscard from '@/components/goods-card/goods-card.vue'
	import nodata from '@/components/no-data/no-data.vue'
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		components:{
			nodata,
			goodscard,
			navbar
		},
		data() {
			return {
				title:'找相似',
				noDataText: '暂无数据~',
				showSimi:false, // 是否显示找相似
				loadingType: 'loading', //加载更多状态
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				//分页
				current: 1,
				pages:1,
				pageSize:10,
		    oldData:{
					id:'', // 原商品id
					price:'',
					img:'',
					name:'',
					upId:'' // 原商品二级分类id
				},
				goodsData:[],
				leftData:[], // 左边商品
				rightData:[], //右边商品
				$token:''
			}
		},
		onLoad(options){
			let that = this
			const data=JSON.parse(JSON.stringify(options))
			// console.log("接收参数",data)
			if(data.name){
				that.oldData.name = data.name
			}
			if(data.price){
				that.oldData.price = data.price
			}
			if(data.img){
				that.oldData.img = data.img
			}
			if(data.id){
				that.oldData.id = data.id
			}
			if(data.upId){
				that.oldData.upId = data.upId
			}
			that.getData()
		},
		onShow() {
			this.$token = uni.getStorageSync('authorization')
		},
		// 触底刷新函数
		onReachBottom(){
		 if(this.current < this.pages){
			 this.current++
			 const params={
			 	pageSize:this.pageSize,
			 	pageNum:this.current,
			 	secondCategoryId:this.oldData.upId
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
		  }
		 if(this.current = this.pages) {
		 	this.loadingType='nomore'
		 	return
		  }
		 },
		methods: {
			getData(){
				const params={
					pageSize:this.pageSize,
					pageNum:this.current,
					secondCategoryId:this.oldData.upId
				}
				selectGoodsByCate(params).then(res => {
					this.goodsData = res.data.records
					this.pages=res.data.pages
					if(this.goodsData.length > 1){
						this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
						this.rightData = this.goodsData.filter((item,index) => index % 2 !==0)
					}else{
						this.leftData = this.goodsData.filter((item,index) => index % 2 ===0)
						this.rightData = []
					}
				})
			},
			//
			goBack(){
				uni.navigateBack({})
			},
			// 跳转商品详情
			goGoods(id){
				// console.log("跳转详情id:",e)
				uni.navigateTo({
				    url: '/pages/classify/classList?id=' + id
				});
			},	
		}
	}
</script>

<style lang="scss" scoped>
  .container{
		background: #f9f9f9;
		height: 100vh;
	  .box{
			//background: red;
		  z-index: 999;
		  position: fixed;
		  //top: var(--window-top);
		  display: flex;
			width: 702rpx;
		  height: 200rpx;
		  margin: 24rpx;
		  font-size: 30rpx;
		  background: #FFFFFF;
		  border-radius: 16rpx;
		  .boxLeft{ 
			  width: 150rpx;
			  height: 150rpx;
			  padding: 24rpx 24rpx 0 24rpx;
			  border-radius: 8rpx;
			  image{
				  width: 100%;
				  height: 100%;
				  border-radius: 8rpx;
			  }
		  }
		  .boxRight{
			  position: relative;
			  max-width: 500rpx;
			  height: 150rpx;
			  padding: 24rpx 0 0 0;
			  .rightName{
				  background: white;
				  width: 100%;
					font-size: 26rpx;
				  max-height: 84rpx;
				  overflow: hidden;
			  }
			  .rightProice{
				  position: absolute;
				  bottom: 0;
				  width: 100%;
				  height: 42rpx;
				  line-height: 42rpx;
				  color: #333333;
				  font-weight: 500;
			  }
		  }
	   }
		 .main{
			 z-index: 1;
			 position: relative;
			 margin-top: 248rpx;
			 background: #f9f9f9;
			 .title{
				 //background: #ccc;
			   height: 42rpx;
			   line-height: 42rpx;
			   text-align: center;
			   font-size: 30rpx;
			   color:#795C98;
				 font-weight: 500;
				 margin-bottom: 24rpx;
			 }					
		 }
	  
  }
</style>
