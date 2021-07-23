<template>
	<view class="header">
		<view class="header-success">
			<view class="success-order">
				<i class="iconfont">&#xe62c;</i>
				<text>支付成功</text>
			</view>
			<view class="success-order orders">
				<text class="orders-fh" @click="homes">返回首页</text>
				<text class="orders-ck" @click="order">查看订单</text>
			</view>
		</view>
	<!-- 	<view v-else class="header-success">
			<view class="success-order">
				<i class="iconfont" style="color: #00B578;">&#xe62f;</i>
				<text>支付失败</text>
			</view>
			<view class="success-order orders">
				<text class="orders-fh" @click="cxzf">重新支付</text>
			</view>
		</view> -->
		<text class="cnxh">猜你喜欢</text>
		<view class="goods">
			<!-- 左边商品 -->
			<view class="goods-left">
				<view class="goodsList" v-for="(item,index) in leftData" :data-id="item.id" @click.stop="goGoods" :key="index">
					<view class="goodsImg"><image :src="imgObs + item.fileUrl" mode=""></image></view>
					<view class="goodsName">{{item.name}}</view>
					<view class="goodsPrice" v-if="$token">￥{{item.tradePrice}}</view>
					<view class="goodsPrice" v-else>登录查看价格</view>
					<view class="goodsNum">
						<view class="goodsNumOne">
							已售{{item.sale !== null ? item.sale : '0'}}件
						</view>
						<view class="goodsNumTwo" @click.stop="goSimi" :data-price="item.tradePrice" :data-img="item.fileUrl" :data-id="item.id" :data-name="item.name" :data-upid="item.secondCategoryId">
							找相似
						</view>
					</view>
				</view>
			</view>
			<!-- 右边商品 -->
			<view class="goods-right">
				<view class="goodsList" v-for="(item,index) in rightData" :data-id="item.id" @click.stop="goGoods" :key="index">
					<view class="goodsImg"><image :src="imgObs + item.fileUrl" mode=""></image></view>
					<view class="goodsName">{{item.name}}</view>
					<view class="goodsPrice" v-if="$token">￥{{item.tradePrice}}</view>
					<view class="goodsPrice" v-else>登录查看价格</view>
					<view class="goodsNum">
						<view class="goodsNumOne">
							已售{{item.sale !== null ? item.sale : '0'}}件
						</view>
						<view class="goodsNumTwo" @click.stop="goSimi" :data-price="item.tradePrice" :data-img="item.fileUrl" :data-id="item.id" :data-name="item.name" :data-upid="item.secondCategoryId">
							找相似
						</view>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-load-more :status="loadingType" iconType="auto" v-if="pages > 1"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {getGoods,selectGoodsByCate} from '@/utils/network/home.js'
	export default {
		data() {
			return {
				loadingType: 'loading', //加载更多状态
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				goodsLists:[],//分类数据
				goodslistData:[],//根据分类id查询商品
				leftData:[], // 左边商品
				rightData:[], //右边商品
				current: 1,
				pages:1,
				pageSize:10,
				id:'' ,// 分类id
				items:'',
				$token:'',
				orderId:'' // 订单id
			}
		},
		onShow() {
			this.$token = uni.getStorageSync('authorization')
		},
		onLoad(options) {
			this.items = options.item
			this.orderId = options.orderId
			this.getGoodsList()
		},
		// 触底刷新函数
		onReachBottom(){
		 if(this.current < this.pages){
				 this.current++
				 const params={
					// secondCategoryId: this.secondCategoryId,
					pageSize:this.pageSize,
					pageNum:this.current,
					// sortType:this.sortType || '',
					// sort:this.sortLab || ''
				 }
				 selectGoodsByCate(params).then(res=>{
						this.current=res.data.current
						this.goodslistData=[...this.goodslistData,...res.data.records]
						if(this.goodslistData.length > 1){
							this.leftData = this.goodslistData.filter((item,index) => index % 2 ===0)
							this.rightData = this.goodslistData.filter((item,index) => index % 2 !==0)
						}else{
							this.leftData = this.goodslistData.filter((item,index) => index % 2 ===0)
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
			// 获取二级商品分类
			// getGoosData(){
			// 	const vm = this
			// 	const params={
			// 		parentId:'1394214489592233986' //测试默认的一级分类id
			// 	}
			// 	getGoods(params).then(res=>{
			// 		let arr=[]
			// 		arr = res.data.map((t, n)=>{
			// 			return{
			// 				title: t.name,
			// 				id: t.id
			// 			}
			// 		})
			// 		this.id=arr[0].id
			// 		vm.goodsLists = arr
			// 		this.getGoodsList()
			// 	})
			// },
			// 根据分类ID查询商品
			getGoodsList(){
				const params={
					pageSize:this.pageSize,
					pageNum:this.current
					// secondCategoryId:this.id
				}
				selectGoodsByCate(params).then(res=>{
					this.goodslistData=res.data.records
					this.current = res.data.current
					this.pages=res.data.pages
					if(this.goodslistData.length > 1){
						this.leftData = this.goodslistData.filter((item,index) => index % 2 ===0)
						this.rightData = this.goodslistData.filter((item,index) => index % 2 !==0)
					}else{
						this.leftData = this.goodslistData.filter((item,index) => index % 2 ===0)
						this.rightData = []
					}
				})
			},
			// 跳转商品详情
			goGoods(e){
				uni.navigateTo({
				    url: '/pages/classify/classList?id=' + e.currentTarget.dataset.id
				});
			},
			// 找相似
			goSimi(e){
				 const name=e.currentTarget.dataset.name
				 const id=e.currentTarget.dataset.id
				 const price=e.currentTarget.dataset.price
				 const img= e.currentTarget.dataset.img
				 const upId= e.currentTarget.dataset.upid
				uni.navigateTo({
				    url: '/pages/home/similarity/similarity?id=' + id + '&name=' + name + '&price=' + price + '&img=' + img + "&upId=" + upId
				});
			},
			homes(){
				uni.switchTab({
						url: '/pages/home/home'
				})
			},
			// 查看订单
			order(){
					uni.navigateTo({
							// url: '/pages/order/myOrder'
							url: '/pages/order/orderDetails?activeIndex=22&id=' + this.orderId
					})
			},
			cxzf(){
				uni.navigateTo({
						url: '/pages/order/checkstand'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.header {
	background: #f9f9f9;
	padding-top: 24rpx;
	color: #333333;
	letter-spacing: 2rpx;
	box-shadow: 0px 4rpx 8rpx -1px rgba(0, 0, 0, 0.10) inset;
	padding-top: 24rpx;
	height: 100vh;
	.header-success {
		margin: 0px 24rpx 24rpx;
		border-radius: 16rpx;
		background: #fff;
		padding: 48rpx;
		font-size: 30rpx;
		.success-order{
			display: flex;
			justify-content: center;
			align-items: center;
			.iconfont{
				font-size: 64rpx;
				color: #00b7f4;
				margin-right: 16rpx;
			}
			text{
				font-size: 36rpx;
				font-weight: 600;
			}
		}
		.orders{
			margin-top: 48rpx;
			text{
				padding: 0 24rpx;
				height: 64rpx;
				line-height: 64rpx;
				opacity: 1;
				border: 2rpx solid rgba(51,51,51,0.26);
				border-radius: 34rpx;
				font-weight: 400;
				font-size: 30rpx;
			}
			.orders-fh{
				margin-right: 32rpx;
			}
		}
	}
	.cnxh{
		font-size: 30rpx;
		font-weight: 500;
		margin: 24rpx;
	}
	// 商品
	.goods{
	   background: #F9F9F9;
	   padding: 24rpx 16rpx 0rpx 16rpx;
	   column-count: 2;
	   column-gap: 0rpx;
		 display: flex;
	   .goodsList{
		   width: 343rpx;
		   margin:0rpx 8rpx;
		   margin-bottom: 24rpx;
		   background: #ffffff;
		   border-radius: 16rpx;
		   box-sizing: border-box;
		   break-inside: avoid;
		   .goodsImg{
				width: 343rpx;
				height: 343rpx;
				opacity: 1;
				background: #eeeeee;
				border-radius: 16rpx 16rpx 0px 0px;
					image{
						width: 100%;
						height: 100%;
						border-radius: 16rpx 16rpx 0px 0px;
					}
		   }
	   }
	   .goodsName{
			width: 295rpx;
			max-height: 84rpx;
			font-size: 30rpx;
			font-weight: 500;
			margin-top: 16rpx;
			margin-left: 24rpx;
			text-align: left;
			color: #333333;
			line-height: 42rpx;
			overflow: hidden;
	   }
	   .goodsPrice{
			width: 259rpx;
			height: 50rpx;
			margin-top: 24rpx;
			margin-left: 24rpx;
			font-size: 36rpx;
			font-weight: 500;
			text-align: left;
			color: #333;
			line-height: 50rpx;
	   }
	   .goodsNum{
			display: flex;
			justify-content: space-between;
			width: 295rpx;
			height: 37rpx;
			margin:16rpx 0rpx 0rpx 24rpx;
			padding-bottom: 24rpx;
		.goodsNumOne{
			// background: red;
			width: 205rpx;
			height: 37rpx;
			font-size: 26rpx;
			text-align: left;
			color: rgba(51,51,51,0.50)
		}
		.goodsNumTwo{
			width: 90rpx;
			height: 33rpx;
			margin-top: 2rpx;
			border: 1px solid #999999;
			border-radius: 9rpx;
			font-size: 24rpx;
			text-align: center;
			color: rgba(0,0,0,0.55);
			line-height: 33rpx;
		}
	  }
	}
}
</style>
