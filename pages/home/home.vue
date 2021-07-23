<template>
	<view class="container">
		<view class="go-top" v-if="showbackTop" @click="goTop">
			<view class="iconfont go-icon">&#xe61d;</view>
			<view class="go-txt">顶部</view>
		</view>
		<view class="fixed" :style="{height:bottom +'px'}">
			<cu-custom :isBack="true" bgColor="bg-shadeTop text-white">
				<block slot="content">
					<view class="search" :style="{width:width +'px',left:12 + 'px',top:top + 'px'}">
						<view class="input" @click="inputChange"
							:style="{height:height +'px',lineHeight:height +'px',fontSize: 13+'px'}">
							<view class="icon" :style="{left:12 +'px',fontSize:26 + 'rpx'}">
								<view class="iconfont" style="font-size: 34rpx;">&#xe630;</view>
							</view>
							搜索
						</view>
					</view>
				</block>
			</cu-custom>
		</view>

		<scroll-view class="scroll-view" :style="{height:windowHeight + 'px',top:bottom + 'px'}" scroll-y
			:scroll-top="scrollTop" @scroll="scrollChange" @scrolltolower='scrolltolower' :refresher-threshold="20"
			refresher-enabled="true" :refresher-triggered="triggered" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore">
			<view class="main">
				<!-- banner轮播 -->
				<view class="banner">
					<view class="banner-box">
						<swiper autoplay :circular="true" style="border-radius: 8px;overflow: hidden;" duration="400">
							<swiper-item v-for="(item,index) in swipers" :key="index">
								<image :src="imgObs + item" class="bannerImg" style="border-radius: 8px;overflow: hidden;"></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<!-- 风格 -->
				<view class="show">
					<view class="show-list" v-for="(item,index) in styleList" :key="item.id"
						@click="goStyle(item.id,item.name)">
						<view class="show-img">
							<image :src="imgObs + item.detail" lazy-load="true" mode="aspectFill"></image>
						</view>
						<view class="show-title">{{item.name}}</view>
					</view>
				</view>
				<!-- 商圈 -->
				<view class="card-box">
					<view class="card-title">
						<view class="card-icon">
							<image src="../../static/home/shop.png" mode=""></image>
						</view>
						<view class="card-txt">商圈</view>
					</view>
					<view class="shop-box">
						<view class="shop-list" v-for="(item,index) in shopList" :key="item.id"
							@click="goStall(item.id,item.areaName)">
							<image :src="imgObs + item.areaImg" lazy-load="true" mode="aspectFill"></image>
							<!-- <view class="shop-title">{{item.areaName}}</view> -->
						</view>
					</view>
				</view>
				<!-- 品牌上新 -->
				<view class="card-box" @click="clickIcon">
					<view class="card-title">
						<view class="card-icon">
							<image src="../../static/home/update.png" mode=""></image>
						</view>
						<view class="card-txt">品牌上新</view>
					</view>
					<view class="update-icon-box">
						<view class="update-icon-list" v-for="(item,index) in iconList" :key="item.id">
							<image :src="imgObs + item.imgUrl" lazy-load="true" mode="aspectFill"></image>
						</view>
					</view>
					<view class="update-img-box">
						<view class="update-img-list" v-for="(item,index) in imgList" :key="item.id">
							<image :src="imgObs + item.imgUrl" lazy-load="true" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<!-- 品牌特卖 -->
				<view class="card-box" style="margin-bottom: 38rpx;">
					<view class="card-title" @click="gospecialDetail">
						<view class="card-icon">
							<image src="../../static/home/special.svg" mode=""></image>
						</view>
						<view class="card-txt">品牌特卖</view>
					</view>
					<view class="special-box">
						<view class="special-list" v-for="(item,index) in specialList" :key="item.id"
							@click="gospecial(item.id)">
							<view class="special-img">
								<image :src="imgObs + item.fileUrl" lazy-load="true" mode="aspectFill"></image>
							</view>
							<view class="special-name">{{item.name}}</view>
							<view class="special-price">¥{{item.tradePrice}}</view>
						</view>
					</view>
				</view>
				<!-- tabs -->
				<view class="tabs">
					<view class="tabs-list" v-for="(item,index) in tabsList" :key="item.id"
						@click="tabsChange(item.id)">
						<view class="tabs-txt bold" :class="active === item.id ? 'active' : ''">{{item.value}}</view>
					</view>
				</view>
				<!-- 商品信息 -->
				<view class="goods">
					<goodscard :leftData="leftData" :rightData="rightData" @goGoods="goGoods" @goSimi="goSimi" />
					<!-- 空白 -->
					<nodata :noText="noDataText" :marginTop="marginTop" v-if="!goodslistData.length" />
					<!-- 底部到底提示 -->
					<view>
						<uni-load-more :status="loadingType" iconType="auto" v-if="pages > 1"></uni-load-more>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getGoods,
		selectGoodsByCate,
		areaList,
		carouselInfo,
		selectByIsSuperSale,
		IsNews,
		getStyle,
		Condition
	} from '@/utils/network/home.js'
	import nodata from '@/components/no-data/no-data.vue'
	import goodscard from '@/components/goods-card/goods-card.vue'
	let observer = null
	export default {
		components: {
			nodata,
			goodscard
		},
		data() {
			return {
				active: 1,
				showbackTop: false, // 回到顶部
				marginTop: '15%',
				noDataText: '暂无商品~',
				appear: true,
				height: uni.getMenuButtonBoundingClientRect().height,
				width: uni.getMenuButtonBoundingClientRect().left - 24,
				top: uni.getMenuButtonBoundingClientRect().top,
				bottom: uni.getMenuButtonBoundingClientRect().bottom + 6,
				scrrowHeight: uni.getMenuButtonBoundingClientRect().bottom + 10,
				scrollTop: 0,
				lastScrollY: 0,
				triggered: false,
				loadingType: 'loading', // 加载更多状态
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				$token: '',
				//分页
				current: 1,
				pages: 1,
				pageSize: 10,
				styleList: [], // 风格列表
				shopList: [], // 商圈
				specialList: [], // 特卖
				iconList: [], // 上新
				imgList: [], // 上新 img
				tabsList: [{
						id: 1,
						value: '今日上新'
					},
					{
						id: 2,
						value: '买手推荐'
					},
					{
						id: 3,
						value: '热卖爆款'
					},
					{
						id: 4,
						value: '回购榜'
					},
				],
				// 轮播
				swipers: [],
				goodslistData: [], // 根据分类id查询商品
				leftData: [], // 左边商品
				rightData: [], // 右边商品
				roluList: [],
				stallList: [],
				windowHeight: 0
			}
		},
		onReady() {
			observer = uni.createIntersectionObserver(this)
			observer.relativeTo('.scroll-view', ).observe('.list', (res) => {
				if (res.intersectionRatio > 0 && !this.appear) {
					this.appear = true;
				} else if (!res.intersectionRatio > 0 && this.appear) {
					this.appear = false;
				}
			})
		},
		onUnload() {
			if (observer) {
				observer.disconnect()
			}
		},
		onLoad() {
			//console.log("云档口token:", uni.getStorageSync('authorization'))
			console.log("中台地址:", this.imgObs)
			this.gerr()
			this.$token = uni.getStorageSync('authorization')
			this._freshing = false;
			this.scrollTop = this.lastScrollY
			this.$nextTick(function() {
				this.scrollTop = 0;
			})
			this.current = 1
			this.carousel()
			this.Style()
			this.getAreaList()
			this.selectSale()
			this.isNews()
			this.getData()
			this.getAuthorizeInfo()
		},
		// onReachBottom(){},
		methods: {
			gerr() {
				const that = this
				uni.getSystemInfo({
					success: function(res) {
						that.windowHeight = res.windowHeight - that.bottom
						console.log(that.windowHeight);
					}
				})
			},
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				this.triggered = true;
				setTimeout(() => {
					this.$token = uni.getStorageSync('authorization')
					this.scrollTop = this.lastScrollY
					this.$nextTick(function() {
						this.scrollTop = 0;
					})
					this.current = 1
					this.carousel()
					this.Style()
					this.getAreaList()
					this.selectSale()
					this.isNews()
					this.getData()
					this.getAuthorizeInfo()
					this.triggered = false;
					this._freshing = false;
				}, 500)
				// this.scrollTop = -1;
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			// 点击回到顶部
			goTop() {
				// this.$nextTick(function(){
				// 		uni.pageScrollTo({
				// 			scrollTop: 0,
				// 			duration : 300, 
				// 	})	
				// })
				setTimeout(() => {
					this.scrollTop = this.lastScrollY
					this.$nextTick(function() {
						// uni.pageScrollTo({
						// 	scrollTop: this.scrollTop,
						// 	duration: 300
						// });
						this.scrollTop = 0
					})
				}, 300)
				// this.onRefresh()
				// this.onRestore()
			},
			// 刷新高度
			scrollChange(e) {
				this.lastScrollY = e.detail.scrollTop;
				// console.log('滚动条距离顶部高度',this.lastScrollY)
				// console.log('屏幕高度：',this.ktxScreentHeight)
				if (this.lastScrollY > 1.5 * this.windowHeight) {
					this.showbackTop = true
				} else {
					this.showbackTop = false
				}
			},
			// scroll-view触底刷新函数
			scrolltolower() {
				const that = this
				if (that.current < that.pages) {
					that.current++
					const params = {
						pageSize: that.pageSize,
						pageNum: that.current,
						conditionId: this.active
					}
					Condition(params).then(res => {
						that.loadingType = 'loading'
						that.current = res.data.current
						that.goodslistData = [...that.goodslistData, ...res.data.records]
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
			// banner图
			carousel() {
				carouselInfo({
					type: 1
				}).then(res => {
					// console.log('banner',res.data.imgList)
					this.swipers = res.data.imgList
				})
			},
			// 风格
			Style() {
				getStyle().then(res => {
					// console.log("风格:",res.data)
					this.styleList = res.data
				})
			},
			// 获取商圈
			getAreaList() {
				const that = this
				areaList().then(res => {
					// console.log("获取商圈:",res.data)
					that.shopList = res.data
				})
			},
			goStyle(id, name) {
				// console.log(id, name)
				uni.navigateTo({
					url: '/pages/home/listPage/listPage?active=0&name=' + name + '&attrId=' + id
				});
			},
			// 特卖
			selectSale() {
				selectByIsSuperSale({
					pageSize: 10,
					pageNum: 1,
					isSuperSale: 1
				}).then(res => {
					// console.log("特卖:", res.data)
					this.specialList = res.data.list.records
				})
			},
			gospecial(val) {
				// console.log("特卖id:",val)
				uni.navigateTo({
					url: '/pages/classify/classList?id=' + val
				});
			},
			// 特卖详情页
			gospecialDetail() {
				uni.navigateTo({
					url: '/pages/home/special/special'
				});
			},
			// 上新
			isNews() {
				IsNews().then(res => {
					// console.log("上新:", res.data)
					this.iconList = res.data.supplist
					this.imgList = res.data.list
				})
			},
			clickIcon() {
				uni.navigateTo({
         url: '/pages/home/brand/brand'
				 });
			},
			// tabs
			tabsChange(val) {
				const that = this
				that.active = val
				that.current = 1
				that.getData()
			},
			// 底部商品
			getData() {
				const params = {
					pageSize: this.pageSize,
					pageNum: this.current,
					conditionId: this.active
				}
				Condition(params).then(res => {
					// console.log('底部商品:',res.data.records)
					this.goodslistData = res.data.records
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
			// 跳转搜索页面
			inputChange() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			// 跳转商品详情
			goGoods(id) {
				// console.log("跳转详情id:",e)
				uni.navigateTo({
					url: '/pages/classify/classList?id=' + id
				});
			},
			// 跳转商圈
			goStall(id, areaName) {
				uni.navigateTo({
					url: '/pages/home/shopping/shopping?sortType=' + id + '&name=' + areaName
				});
			},
			// handleUp() {
			// 	const vm = this
			// 	const num = vm.roluList.length === 5 ? vm.stallList.length : 5
			// 	vm.roluList = vm.stallList.filter((t, n) => {
			// 		return n < num
			// 	})
			// },
			// 找相似
			goSimi(tradePrice, fileUrl, id, name, secondCategoryId) {
				uni.navigateTo({
					url: '/pages/home/similarity/similarity?id=' + id + '&name=' + name + '&price=' + tradePrice +
						'&img=' + fileUrl + "&upId=" + secondCategoryId
				});
			},
			// 获取位置
			// 位置授权
			getAuthorizeInfo() {
				const that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success() { // 允许授权
						that.getLocationInfo();
					},
					fail() { // 拒绝授权
						that.openConfirm();
						console.log("你拒绝了授权，无法获得周边信息")
					}
				})
			},
			// 获取地理位置
			getLocationInfo() {
				const vm = this
				uni.getLocation({
					type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
					success(res) {
						if (res.errMsg === "getLocation:ok") {
							const gnote = {}
							gnote.longitude = res.longitude
							gnote.latitude = res.latitude
							uni.setStorageSync('Longitude', gnote)
						}
						// vm.getLocal(res.longitude, res.latitude)
					}
				});
			},
			// 再次获取授权
			// 当用户第一次拒绝后再次请求授权
			openConfirm() {
				uni.showModal({
					title: '请求授权当前位置',
					content: '需要获取您的地理位置，请确认授权',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting(); // 打开地图权限设置
						} else if (res.cancel) {
							uni.showToast({
								title: '你拒绝了授权，无法获得周边信息',
								icon: 'none',
								duration: 1000
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.active {
		color: #333;
		font-weight: 500;
		padding-bottom: 4rpx;
		// border-bottom: 4rpx solid #795c98;
	}
	.active::before {
		content: '';
		position: absolute;
		left: 5px;
		bottom: -4rpx;
		left: 20%;
		height: 6rpx;
		width: 60%;
		background-color: #795c98;
		// border-bottom: 4rpx solid #795c98;
	}

	.fixed {
		position: fixed;
		z-index: 999;
		width: 100%;
		// background-color: rgba(0, 0, 0, 0);
		background: #fff;
	}

	.container {
		background: #F9F9F9;
		height: 100vh;

		.search {
			// background-color: red;
			position: relative;

			.input {
				position: relative;
				background-color: #f3f3f3;
				// backdrop-filter: blur(20px);
				width: 100%;
				color: rgba(51, 51, 51, 0.5);
				border-radius: 38rpx;
				text-align: center;

				.icon {
					position: absolute;
					color: #333333;

					view {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.go-top {
			position: fixed;
			bottom: 44rpx;
			right: 48rpx;
			z-index: 99;
			height: 88rpx;
			width: 88rpx;
			border-radius: 50%;
			opacity: 0.8;
			background: #ffffff;
			border: 1rpx solid rgba(0, 0, 0, 0.25);
			background: #fff;
			text-align: center;

			.go-icon {
				margin-top: 8rpx;
				font-size: 36rpx;
				height: 32rpx;
				line-height: 32rpx;
			}

			.go-txt {
				font-size: 24rpx;
				height: 33rpx;
				line-height: 33rpx;
				color: rgba(0, 0, 0, 0.85);
			}
		}
		.scroll-view {
			min-height: 80vh;
			position: absolute;
		  left: 0;
			right: 0;
			bottom: 0;
			.main {
				.banner{
					background: #fff;
					.banner-box{
						height: 354rpx;
						margin: 0rpx 24rpx;
						padding-top:8rpx;
						border-radius: 8px;
						overflow: hidden;
						swiper {
							width: 100%;
							height: 100%;
							display: block;
							.bannerImg {
								display: block;
								max-width: 100%;
								width: 100%;
								height: 100%;
							}
						}
					}
				}
				

				.show {
					display: flex;
					flex-wrap: wrap;
					width: 100%;
					min-height: 100rpx;
					padding: 48rpx 6rpx 33rpx 6rpx;
					box-sizing: border-box;
					background: linear-gradient(182deg, #ffffff 46%, #f9f9f9 78%, #f9f9f9 78%);
					.show-list {
						padding: 15rpx 42rpx;
						// border: 1rpx solid red;
						.show-img {
							width: 100rpx;
							height: 100rpx;
							// border-radius: 50%;
							overflow: hidden;

							image {
								display: block;
								max-width: 100%;
								width: 100%;
								height: 100%;
							}
						}

						.show-title {
							margin-top: 10rpx;
							line-height: 36rpx;
							font-size: 25rpx;
							text-align: center;
						}
					}
				}

				.card-box {
					min-height: 200rpx;
					background: #fff;
					margin: 0 24rpx 28rpx 24rpx;
					padding: 24rpx;
					border-radius: 16rpx;

					.card-title {
						display: flex;

						.card-icon {
							width: 40rpx;
							height: 40rpx;

							image {
								display: block;
								max-width: 100%;
								width: 100%;
								height: 100%;
							}
						}

						.card-txt {
							padding-left: 5rpx;
							margin-bottom: 18rpx;
							font-size: 30rpx;
							line-height: 40rpx;
							font-weight: bold;
						}
					}

					// 商圈
					.shop-box {
						width: 100%;
						display: flex;
						flex-wrap: nowrap;
						overflow-x: auto;
						display: -webkit-box;

						.shop-list {
							position: relative;
							background: #eee;
							width: 260rpx;
							height: 162rpx;
							overflow: hidden;
							margin-right: 18rpx;
							border-radius: 8rpx;

							image {
								display: block;
								max-width: 100%;
								width: 100%;
								height: 100%;
							}

							.shop-title {
								width: 100%;
								position: absolute;
								bottom: 3rpx;
								left: 50%;
								transform: translateX(-50%);
								line-height: 40rpx;
								font-size: 28rpx;
								text-align: center;
								color: #fff;
								opacity: 0.4;
								background: #000000;
								border-radius: 0px 0px 8rpx 8rpx;
							}
						}
					}

					// 上新
					.update-icon-box {
						width: 100%;
						margin-bottom: 24rpx;
						display: flex;
						flex-wrap: nowrap;
						overflow-x: auto;
						display: -webkit-box;
						.update-icon-list {
							width: 114rpx;
							height: 114rpx;
							margin-right: 21rpx;
							border-radius: 8rpx;
							overflow: hidden;
							border: 1rpx solid rgba(216,215,215,.6);
							image {
								max-width: 100%;
								width: 100%;
								height: 100%;
								border-radius: 8rpx;
								display: flex;
								overflow: hidden;
								box-sizing: border-box;
							}
						}
					}

					.update-img-box {
						width: 100%;
						display: flex;
						flex-wrap: nowrap;
						overflow-x: auto;
						display: -webkit-box;

						.update-img-list {
							background: #e6e6e6;
							width: 216rpx;
							height: 288rpx;
							margin-right: 18rpx;
							border-radius: 8rpx;
							overflow: hidden;

							image {
								max-width: 100%;
								width: 100%;
								height: 100%;
								display: block;
							}
						}
					}

					// 特卖
					.special-box {
						width: 100%;
						display: flex;
						flex-wrap: nowrap;
						overflow-x: auto;
						display: -webkit-box;

						.special-list {
							width: 180rpx;
							margin-right: 18rpx;
							font-size: 24rpx;

							.special-img {
								background: #f7f7f7;
								width: 180rpx;
								height: 240rpx;
								border-radius: 7rpx;
								overflow: hidden;

								image {
									max-width: 100%;
									width: 100%;
									height: 100%;
									display: block;
								}
							}

							.special-name {
								width: 180rpx;
								padding-right: 6rpx;
								line-height: 33rpx;
								margin-top: 14rpx;
								// text-align: justify;
								// text-align-last: left;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								line-clamp: 1;
								-webkit-box-orient: vertical;
							}

							.special-price {
								line-height: 33rpx;
								margin-top: 8rpx;
								text-align: justify;
								text-align-last: left;
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

				.tabs {
					display: flex;
					justify-content: center;
	        margin-bottom: 38rpx;
					.tabs-list:not(:first-child) {
						border-left: 1rpx solid #d8d8d8;
					}

					.tabs-list {
						position: relative;
						line-height: 27rpx;
						padding: 0rpx 24rpx;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.5);
					}
				}

				.goods {
					min-height: 500rpx;
				}
			}
		}

	}
</style>
