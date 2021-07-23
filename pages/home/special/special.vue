<template>
	<view class="container">
		<!--  -->
		<nav-bar :title="title" @goBack="goBack"/>
		<view class="main">
			<view class="top-img">
				<image :src="imgObs + topImg" lazy-load="true" mode="aspectFill"></image>
			</view>
			<view class="title">
				<text>为您推荐</text>
			</view>
			<view class="title-two">
				<text>RECOMMEND FOR YOU</text>
			</view>
			<!-- 商品信息 -->
			<goodscard :leftData="leftData" :rightData="rightData" @goGoods="goGoods" @goSimi="goSimi" />
			<!-- 空白 -->
			<nodata :noText="noDataText" :marginTop="marginTop" v-if="!goodslistData.length" />
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/nav-bar/nav-bar.vue'
	import goodscard from '@/components/goods-card/goods-card.vue'
	import nodata from '@/components/no-data/no-data.vue'
	import { selectByIsSuperSale } from '@/utils/network/home.js'
	export default {
		components:{
			navbar,
			goodscard,
			nodata
		},
		data() {
			return {
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				noDataText:'暂无商品~',
				title:'品牌特卖',
				loadingType: 'loading', // 加载更多状态
				//分页
				current: 1,
				pages: 1,
				pageSize: 10,
				topImg:'',
				goodslistData:[],
				leftData: [], // 左边商品
				rightData: [], // 右边商品
			}
		},
		onLoad() {
			this.selectSale()
		},
		// 触底刷新
		onReachBottom(){
			const that = this
			if (that.current < that.pages) {
				that.current++
				const params = {
					pageSize:that.pageSize,
					pageNum:that.current,
					isSuperSale:1,
				}
				selectByIsSuperSale(params).then(res => {
					// console.log("特卖:",res.data.records)
					that.goodslistData = res.data.records
					that.current = res.data.current
					if (that.goodslistData.length > 1) {
						that.leftData = that.goodslistData.filter((item, index) => index % 2 === 0)
						that.rightData = that.goodslistData.filter((item, index) => index % 2 !== 0)
					} else {
						that.leftData = that.goodslistData.filter((item, index) => index % 2 === 0)
						that.rightData = []
					}
				})
			} else {
				that.loadingType = 'nomore'
				return
			}
		},
		methods: {
			goBack(){
				uni.navigateBack({})
			},
			// 特卖
			selectSale(){
				const params = {
					pageSize:this.pageSize,
					pageNum:this.current,
					isSuperSale:1,
				}
				selectByIsSuperSale(params).then(res => {
					// console.log("特卖:",res.data.records)
					this.topImg = res.data.fileUrl
					this.goodslistData = res.data.list.records
					this.current = res.data.current
					this.pages = res.data.pages
					if (this.goodslistData.length > 1) {
						this.leftData = this.goodslistData.filter((item, index) => index % 2 === 0)
						this.rightData = this.goodslistData.filter((item, index) => index % 2 !== 0)
					} else {
						this.leftData = this.goodslistData.filter((item, index) => index % 2 === 0)
						this.rightData = []
					}
				}).catch(() => {
					this.isLoadMore = false
				})
			},
			// 找相似
			goSimi(tradePrice, fileUrl, id, name, secondCategoryId) {
				uni.navigateTo({
					url: '/pages/home/similarity/similarity?id=' + id + '&name=' + name + '&price=' + tradePrice +
						'&img=' + fileUrl + "&upId=" + secondCategoryId
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #f9f9f9;
	height: 100vh;
	.main{
		padding: 24rpx 0;
		.top-img{
			margin: 0 24rpx 24rpx 24rpx;
			height: 330rpx;
			border-radius: 16rpx;
			overflow: hidden;
			background: #eee;
			image{
				max-width: 100%;
				height: 100%;
				width: 100%;
				display: block;
			}
		}
		.title{
			position: relative;
			z-index: 1;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			line-height: 42rpx;
			text{
				padding: 0 10rpx;
				background: #f9f9f9;
				z-index: 1;
			}
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 210rpx;
				height: 0;
				content: '';
				border-bottom: 1rpx solid #000000;
			}
		}
		.title-two{
			line-height: 32rpx;
			font-size: 24rpx;
			text-align: center;
			color: rgba(0,0,0,0.24);
			margin-bottom: 24rpx;
		}
	}
}
</style>
