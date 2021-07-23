<template>
	<view class="header contont">
		<view class="fixed" :style="{height:navHeight + 'px'}">
			<view class="top" :style="{height:height +'px',marginTop:top + 'px'}">
				<view class="icon-tab">
					<view class="iconfont icons" @click="back">&#xe618;</view>
					<view class="tab">
						品牌上新
					</view>
				</view>
			</view>
			<view class="card-box" style="height: 106px;padding: 22px 0 0 16px;">
				<view class="update-icon-box">
					<view class="update-icon-list" v-for="(item,index) in iconList" :key="item.suppId" @click="brand(item.suppId)">
						<view style="width: 68px;height: 68px;overflow: hidden;">
							<image :src="imgObs+item.suppUrl" mode="" :class="active === item.suppId ? 'activeBottom' : ''"></image>
						</view>
						<view class="update-box" v-if="active === item.suppId">				
								<image src="@/static/home/sanjiao.svg" mode="" :class="active === item.suppId ? 'triangle' : ''"></image>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view style="position: absolute;z-index: 9;left: 0;right: 0;padding-bottom: env(safe-area-inset-bottom);background: #f9f9f9;" :style="{top:swiperTop + 'px'}">
			<swiper class="card-swiper" :indicator-dots="false" :circular="true" :class="dotStyle?'square-dot':'round-dot'"
			 :autoplay="false" interval="5000" duration="500" @change="cardSwiper" indicator-color="rgba(0,0,0,0.12)"
			 indicator-active-color="#795c98">
				<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''" @click="goGoods(item.id)">
					<view class="swiper-item">
						<image :src="imgObs+item.fileUrl" mode="aspectFill" style="border-radius: 16rpx;"></image>
						<view class="text" style="padding-top: 24rpx;">
							<view class="title">
							{{item.name || ""}}
							</view>
							<view class="mory">
								￥{{item.tradePrice || "0"}}
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- 商品信息 -->
			<goodscard :leftData="leftData" :rightData="rightData" @goGoods="goGoods" @goSimi="goSimi" />
			<!-- 空白 -->
			<nodata :noText="noDataText" :marginTop="marginTop" v-if="!goodslistData.length" />
			<!-- 底部到底提示 -->
			<view>
				<uni-load-more :status="loadingType" iconType="auto" v-if="pages > 1"></uni-load-more>
			</view>
		</view>
	</view>
</template>

<script>
	import { goodsByIsNews, goodsMainDetailByIsNewsImg, selectSuppGoodsDetailByIsNews } from '@/utils/network/api.js'
	import goodscard from '@/components/goods-card/goods-card.vue'
	export default {
		components: {
			goodscard
		},
		data() {
			return {
				loadingType: 'loading', // 加载更多状态
				noDataText: '暂无商品~',
				marginTop: '15%',
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				height :uni.getMenuButtonBoundingClientRect().height,
				width :uni.getMenuButtonBoundingClientRect().left - 24,
				top:uni.getMenuButtonBoundingClientRect().top,
				tops:uni.getMenuButtonBoundingClientRect().bottom,
				navHeight:uni.getMenuButtonBoundingClientRect().bottom + 106,
				swiperTop:uni.getMenuButtonBoundingClientRect().bottom + 106,
				iconList:[],
				val: [],
				swiperList: [],
				cardCur: 0,
				active:null,
				//分页
				current: 1,
				pages: 1,
				pageSize: 10,
				supplist:[],
				leftData: [], // 左边商品
				rightData: [], // 右边商品
				goodslistData: [],
				dotStyle: false,
			}
		},
		onLoad() {
			this.TowerSwiper('swiperList');
			this.goodsByIsNew()
		},
		onReachBottom(){
			const that = this
			if (that.current < that.pages) {
				that.current++
				const params = {
					pageSize: that.pageSize,
					pageNum: that.current,
					supplierId: that.active
				}
				selectSuppGoodsDetailByIsNews(params).then( res=> {
					const {data = {}} = res
					that.loadingType = 'loading'
					that.current = data.current
					that.goodslistData = [...that.goodslistData, ...data.records]
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
			// 返回上一页
			back(){
				uni.navigateBack({})
			},
			
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			// 初始化towerSwiper
			TowerSwiper(name) {
				let list = this[name];
				for (let i = 0; i < list.length; i++) {
					list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
					list[i].mLeft = i - parseInt(list.length / 2)
				}
				this.swiperList = list
			},
			// 详情接口
			goodsByIsNew() {
				const that = this
				goodsByIsNews().then(res => {
					const {data = {}} = res
					this.iconList = data
					this.active = data[0].suppId
					goodsMainDetailByIsNewsImg({
						supplierId: this.active,
					}).then( res=> {
						const {data = {}} = res
						this.swiperList = data
						// console.log(this.swiperList)
					})
					this.goodsList()
				})
			},
			// 点击详情获取轮播数据
			brand(id){
				this.active = id
				goodsMainDetailByIsNewsImg({
					supplierId: id
				}).then( res=> {
					const {data = {}} = res
					this.swiperList = data
				})
				this.goodsList()
			},
			// 商品列表
			goodsList(){
				selectSuppGoodsDetailByIsNews({
					supplierId: this.active
				}).then( res=> {
					const {data = {}} = res
					this.goodslistData = data.records
					this.current = data.current
					this.pages = data.pages
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
			// 跳转商品详情
			goGoods(id) {
				uni.navigateTo({
					url: '/pages/classify/classList?id=' + id
				});
			},
			// 找相似
			goSimi(tradePrice, fileUrl, id, name, secondCategoryId) {
				uni.navigateTo({
					url: '/pages/home/similarity/similarity?id=' + id + '&name=' + name + '&price=' + tradePrice +
						'&img=' + fileUrl + "&upId=" + secondCategoryId
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.fixed {
	position: fixed;
	z-index: 99;
	width: 100%;
	background: linear-gradient(180deg,rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.56) 100%);
	background-color: #FFFFFF;
}
.activeBottom{
	// border-bottom: 1rpx solid red;
}
.activeBottom::before{
	content: '';
	position: absolute;
	bottom: 3px;
	left: 29%;
	height: 2px;
	width: 42%;
	border-radius:5px;
	background-color: #795c98;
}
.header{
	height: 100vh;
	background: #f9f9f9;
	.top{
		position: relative;
		.icon-tab{
			display: flex;
			height: 32px;
			line-height: 32px;
			.icons{
				padding-left: 24rpx;
				font-size: 48rpx;
				position: absolute;
				color: #FFFFFF;
			}
			.tab{
				font-size: 34rpx;
				font-family: PingFangSC, PingFangSC-Medium;
				font-weight: 500;
				color: #ffffff;
				line-height: 64rpx;
				width: 136rpx;
				height: 64rpx;
				border-radius: 16rpx;
				margin: auto;
			}
		}
	}
	.card-box{
		// background: red;
		// 上新
		.update-icon-box{
			width: 100%;
			display: flex;
			flex-wrap: nowrap;
			overflow-x: auto;
			display: -webkit-box;
			.update-icon-list{
				// height: 84px;
				margin-right: 8px;
				position: relative;
				overflow: hidden;
				image{
					max-width: 100%;
					width: 100%;
					height: 100%;
					border-radius: 4px;
					display: block;
					box-sizing: border-box;
					background: #fff;
				}
				.update-box{
					width: 100%;
					height: 16px;
					image{
						max-width: 100%;
						width: 100%;
						height: 100%;
						display: block;
						background: none;
					}
					// 三角形
					.triangle{
						position: absolute;
						bottom:-1rpx;
						left: 50%;
						transform: translateX(-50%);
						width: 12px;
						height: 8px;
						// width: 0;
						// height: 0;
						// border-left: 6px solid transparent;
						// border-right: 6px solid transparent;
						// border-bottom: 8px solid #f9f9f9;
						// box-sizing: border-box;
						// position: absolute;
						// bottom:0;
						// left: 50%;
						// transform: translateX(-50%);
						}
				}
			}
		}
		
	}
	// 轮播图样式
	.card-swiper swiper-item{
		width: 420rpx!important;
		border-radius: 16rpx!important;
		margin: 0 24rpx!important;
		padding: 0!important;
		left: 119rpx;
	}
	.card-swiper swiper-item .swiper-item{
		height: 560rpx!important;
		overflow: inherit!important;
		background: #eeeeee!important;
		border-radius: 16rpx!important;
	}
	.card-swiper {
	  height: 665rpx!important;
	}
	.card-swiper{
		margin: 24rpx;
		border-radius: 16rpx;
		padding: 24rpx 0;
		background: #FFFFFF;
	}
	.title{
		font-size: 24rpx;
		line-height: 1.5;
		text-align: center;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		padding: 0 22rpx 0 24rpx;
	}
	.mory{
		font-size: 34rpx;
		font-family: PingFangSC, PingFangSC-Medium;
		font-weight: 500;
		text-align: center;
		margin-top: 8rpx;
	}
	.text{
		display: none;
	}
	.cur .text{
		display: block;
	}
}
</style>
