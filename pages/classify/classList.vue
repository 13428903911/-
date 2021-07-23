<template>
	<view class="container">
		<nav-bar :title="title" :shadow="shadow" @goBack="goBack" />
		<view class="carousel">
			<swiper autoplay :circular="true" duration="400" @change="changeSwiper">
				<swiper-item class="swiper-item" v-for="(item,index) in goodsData.fileList" :key="index">
					<view class="image-wrapper" @click="imgClick(index)">
						<!-- <video src="" controls></video> -->
						<image :src="imgObs+item.fileUrl" class="loaded" mode="scaleToFill" :draggable="false"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="indexNum" v-if="goodsData.fileList.length > 1">
				{{swiperIndex+1 +'/'+ goodsData.fileList.length}}
			</view>
		</view>
		<view style="position: relative;top:24rpx">
			<view class="introduce-section bt">
				<view class="price-box">
					<view>
						<text class="price-tip">¥</text>
						<text class="price">{{goodsData.tradePrice || 0}}</text>
					</view>
					<!-- <uni-fav :checked="checked" circle="true" @click="onClick"/> -->
					<view class="collect" :style="{color: goodsData.isCollect == 1 ? '#795C98' : 'rgba(51,51,51,0.5)'}"
						@click="onClick(goodsId)">
						<span class="iconfont icon-font" v-if="goodsData.isCollect == 1">
							&#xe60a;
						</span>
						<span class="iconfont icon-font" v-else>
							&#xe602;
						</span>
						<span class="icon-text" v-if="goodsData.isCollect == 1">
							已收藏
						</span>
						<span class="icon-text" v-else>
							收藏
						</span>
					</view>
				</view>
				<view class="bot-row">
					<text>已售卖{{goodsData.sale || 0}}件</text>
				</view>
				<text class="title">{{goodsData.name || ''}}</text>
			</view>
			<view class="c-list bt">
				<view class="c-row b-b" @click="open">
					<text class="tit">规格</text>
					<view class="con">
						<text class="selected-text">
							尺码/颜色
						</text>
					</view>
					<i style="font-size: 48rpx;color: rgba(51,51,51,0.5);" class="iconfont">&#xe61a;</i>
				</view>
			</view>
			<!-- 评价 -->
			<view class="eva-section bt" @click="addLook()">
				<view class="eva-section-img">
					<image src="../../static/stall-logo.png"></image>
				</view>
				<view class="eva-section-main">
					<view class="eva-section-main-name">{{goodsData.suppName || ''}}</view>
					<view class="eva-section-main-address"><span class="iconfont"
							style="padding-right: 16rpx;">&#xe623;</span>{{goodsData.suppAddress || ''}}</view>
				</view>
				<view class="eva-section-gostall">
					<i style="font-size: 48rpx;" class="iconfont">&#xe61a;</i>
				</view>
			</view>
			<view class="detail-desc">
				<view class="d-header">
					<text>详情介绍</text>
				</view>
				<view class="img-detail">
					<image v-for="(item,index) in goodsData.detailList" :key="item.id" :src="imgObs + item.fileUrl"
						mode="widthFix" @click="goImg(index)"></image>
				</view>
			</view>
		</view>
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<view class="page-bottom-cd" @click="goodOrder">
				<span class="iconfont" style="font-size: 48rpx;color: #C8C8C8;margin-right: 16rpx;"
					v-if="colorstatus===false" :style="{fontSize: '48rpx','margin-right': '16rpx'}">&#xe607;</span>
				<span class="iconfont" style="font-size: 48rpx;color: #C8C8C8;margin-right: 16rpx;" v-else
					:style="{color:'#795C98',fontSize: '48rpx','margin-right': '16rpx'}">&#xe637;</span>
				<text style="color: rgba(51,51,51,0.5);">进货单</text>
			</view>
			<view class="action-btn-group">
				<!-- @click="addShopping" addOrder-->
				<button class="action-btn-jh" plain="true" @click="addShopping">
					<view>加入进货单</view>
				</button>
				<button class="action-btn-nh" plain="true" @click="buyOrder">
					<view>直接拿货</view>
				</button>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<uni-popup ref="popup" type="bottom" background-color="#fff" @change="handlePopup" :animation="true">
			<view class="a-y">
				<view class="a-t">
					<image :src="imgObs + imgList[current]" style="background: #eeeeee;" mode="aspectFill"></image>
					<view class="right">
						<text class="right-text">{{goodsData.name}}</text>
					</view>
				</view>
				<!-- tabs选项卡 -->
				<view>
					<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
						activeColor="#795C98"></uni-segmented-control>
					<view class="content">
						<view v-for="(item, index) in selectList" :key="index" v-show="current === index">
							<view v-for="(sku, _index) in item.list" :key="_index" class="demo-uni-row">
								<view>
									<view class="demo-uni-col models" @tap="clickAttrName(sku)">{{sku.attrName}}</view>
									<view class="demo-uni-col money">￥{{sku.tradePrice}}</view>
								</view>
								<view class="demo-button">
									<i class="iconfont" @click="reduce(sku.skuId)">&#xe63a;</i>
									<input class="uni-input content" v-model="sku.num" type="number"
										@input="goodsDetail" />
									<i class="iconfont" @click="bindChange(sku.skuId)">&#xe63b;</i>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="total">
					<text>共 <text class="total-l">{{ total }}</text> 件，合计<text
							class="total-je bold">￥{{totalPrice}}</text> </text>
				</view>
			</view>
		</uni-popup>
		<!-- 提示跳登录 -->
		<uni-popup ref="classList" type="dialog">
			<uni-popup-dialog type="info" title="温馨提示" content="您还没有登录,是否跳转登录授权？" :duration="2000" :before-close="true"
				@close="$refs.classList.close()" @confirm="loginConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getselectByIdApp,
		getGoodsSku,
		getSupplierBySuppId,
		collectSku,
		addOrder
	} from '@/utils/network/api.js'
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		props: {
			navbar
		},
		data() {
			return {
				mode: 'long',
				currentss: 0,
				title: '商品详情',
				shadow: false,
				swiperIndex: 0,
				colorstatus: false, // 进货单状态
				formData: { // 购物车参数
					goodsId: '', // 商品id
					goods: [] // 商品数据
				},
				orderInfo: [], // 直接拿货需要缓存的数据
				orderData: { // 直接拿货需要缓存的数据
					goodsInfos: []
				},
				orderObj: { // 直接拿货需要缓存的数据里的对象
					goodsSpecs: []
				},
				suppBy: {}, // 档口详情
				suppId: '', // 档口id
				numbers: [],
				current: 0,
				items: [],
				total: 0, // 共计多少件
				totalPrice: 0, // 价格
				attrName: '', // 属性名
				$token: '', // token
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				properImg: '', // 属性图片
				propertyData: [], // 属性数据
				list: [], // 选项卡
				skuData: [],
				goodsData: {}, // 商品数据
				goodsId: '', // 商品id
				checked: false,
				favorite: true,
				shareList: [],
				active: 0,
				sliders: {
					width: "auto",
					height: 3,
					round: true
				},
				desc: '', // 商品详情
				tabsTitle: '',
				selectList: [],
				popupShow: false,
				imgList: [],
				videoVal:''
			}
		},
		onLoad(options) {
			this.goodsId = options.id
			// this.goodsId = '1413474992412766210'
			// this.suppId = options.suppId
		},
		onShow() {
			const that = this
			uni.removeStorageSync('SubmitOrders');
			that.gitGoodsDetail()
			that.$token = uni.getStorageSync('authorization')
			that.orderInfo = []
			that.orderData.goodsInfos = []
		},
		filters: {
			/**
			 * 处理富文本里的图片宽度自适应
			 * 1.去掉img标签里的style、width、height属性
			 * 2.img标签添加style属性：max-width:100%;height:auto
			 * 3.修改所有style里的width属性为max-width:100%
			 * 4.去掉<br/>标签
			 *
			 */
			// formatRichText (html) { //控制小程序中图片大小
			//     let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
			//         match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
			//         match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			//         match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			//         return match;
			//     });
			//     newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
			//         match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
			//         return match;
			//     });
			//     newContent = newContent.replace(/<br[^>]*\/>/gi, '');
			//     newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
			//     return newContent;
			// }	
		},
		methods: {
			goBack() {
				uni.navigateBack({})
			},
			changeSwiper(e) {
				// console.log(e.detail.current)
				this.swiperIndex = e.detail.current
			},
			imgClick(index) {
				let i = this.goodsData.fileList[index].fileUrl; //获取当前页面的轮播图数据
				let newArr = this.goodsData.fileList.map(item => {
					return this.imgObs + item.fileUrl
				})
				//uniapp预览轮播图
				uni.previewImage({
					current: index, //预览图片的下标
					urls: newArr //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			goImg(index) {
				console.log(index)
				let t = this.goodsData.detailList[index].fileUrl
				let newArr = this.goodsData.detailList.map(s => {
					return this.imgObs + s.fileUrl
				})
				uni.previewImage({
					current: index,
					urls: newArr
				})
			},
			// 收藏
			onClick(id) {
				if (this.$token) {
					collectSku({
						goodsId: id
					}).then(res => {
						if (this.goodsData.isCollect === 1) {
							uni.showToast({
								title: "取消收藏成功",
								icon: "none"
							})
						} else {
							uni.showToast({
								title: "收藏成功",
								icon: "none"
							})
						}
						this.gitGoodsDetail()
					})
				} else {
					this.$refs.classList.open()
				}
			},
			// 收藏弹窗里的确认
			loginConfirm() {
				uni.navigateTo({
					url: '/pages/arthorize/index'
				})
				this.$refs.classList.close()
			},
			// sku二级属性点击事件
			clickAttrName(e) {
				this.attrName = e.attrName
				this.close()
			},
			// 获取商品详情
			gitGoodsDetail() {
				getselectByIdApp({
					id: this.goodsId
				}).then(res => {
					this.goodsData = res.data
					const list = res.data.fileList
					const video = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
					const one = list[0].fileUrl.split('.')[0]
					let videoVal = ''
					videoVal = video.find(item => item === one)
					
					if(videoVal){
						return 'video';
					}
					console.log(videoVal)
				  console.log('one：',one)
					console.log('banner：',list)
					// if(list[0].fileUrl){}
				})
			},
			// 档口详情
			// getSupData() {
			// 	const vm = this
			// 	const id = vm.goodsData.supplierId
			// 	getSupplierBySuppId({ suppId: id }).then(res => {
			// 		vm.suppBy = res.data
			// 	})
			// },
			// 进店看看
			addLook() {
				uni.navigateTo({
					url: '/pages/home/stallDetail/stallDetail?id=' + this.goodsData.supplierId
				})
			},
			// 加入购物车调接口
			addShopping() {
				if (this.$token) {
					const vm = this
					if (vm.total === 0) {
						if (vm.popupShow === true) {
							uni.showToast({
								title: "请选择商品!",
								icon: 'none'
							})
							return false
						}
						vm.open()
						return false
					} else {
						vm.addShoppingTrolley()
					}
				} else {
					vm.$refs.classList.open()
				}
			},
			// 加入购物车的接口
			addShoppingTrolley() {
				const vm = this
				const arr = []
				// 获取修改后的sku数据
				vm.selectList.forEach(item => {
					item.list.forEach(x => {
						arr.push(x)
					})
				})
				const arrList = arr.filter(item => {
					if (item.num > 0) {
						return item
					}
				})
				// 将数组里的数量与skuid拿出来
				vm.formData.goods = arrList.map(s => ({
					amount: s.num,
					skuId: s.skuCode,
					sizeName: s.attrName
				}))
				vm.formData.goodsId = this.goodsId
				addOrder(vm.formData).then(res => {
					uni.showToast({
						title: "加入进货单成功!",
						icon: 'none'
					})
					vm.colorstatus = true
					// 成功后清零
					arr.forEach(j => {
						j.num = 0
					})
					vm.total = 0 // 数量清零
					vm.totalPrice = 0 // 价格清零
					vm.current = 0 // 选项卡默认0
					vm.close() // 关闭弹窗
				})
			},
			// 直接拿货存储数据-跳结算页
			buyOrder() {
				const vm = this
				const orderArr = []
				if (this.$token) {
					if (vm.total === 0) {
						if (vm.popupShow) {
							uni.showToast({
								title: "请选择商品!",
								icon: 'none'
							})
							return false
						}
						vm.open()
						return false
					}
					vm.orderData.stallId = vm.goodsData.supplierId // 赋值档口id
					vm.orderData.stallName = vm.suppBy.fullName // 档口名称
					vm.orderObj.goodId = vm.goodsId // 赋值商品id
					vm.orderObj.goodsName = vm.goodsData.name // 商品名称
					vm.orderObj.goodsUrl = vm.goodsData.fileList[0].fileUrl // 商品图片
					vm.orderObj.goodsNo = vm.goodsData.goodsNo
					vm.selectList.forEach(item => {
						item.list.forEach(x => {
							orderArr.push(x)
						})
					})
					// 先将有数量的数据过滤出来
					// 将数组里的数量与skuid拿出来
					const list1 = orderArr.filter(item => {
						if (item.num > 0) {
							return item
						}
					})
					vm.orderObj.goodsSpecs = list1.map(s => ({
						amount: s.num,
						skuId: s.skuCode,
						colorName: s.name,
						price: s.tradePrice,
						sizeName: s.attrName
					}))
					vm.orderData.goodsInfos.push(vm.orderObj)
					vm.orderInfo.push(vm.orderData)
					// 清缓存
					uni.removeStorageSync('SubmitOrders');
					// 缓存数据
					uni.setStorageSync('SubmitOrders', vm.orderInfo)
					// 缓存成功后清楚数量
					orderArr.forEach(j => {
						j.num = 0
					})
					vm.total = 0 // 数量清零
					vm.totalPrice = 0 // 价格清零
					vm.current = 0 // 选项卡默认0
					// uni.redirectTo({
					// 	url:"../order/sureOrder"
					// })
					uni.navigateTo({
						url: "../order/sureOrder"
					})
				} else {
					this.$refs.classList.open()
				}
			},
			handlePopup(val) {
				const vm = this
				const {
					show
				} = val
				vm.popupShow = show
				// console.log(val)
			},
			// 关闭弹窗
			close() {
				const vm = this
				vm.$refs.popup.close()
			},
			open() {
				const vm = this
				vm.$refs.popup.open('top')
				vm.popupShow = true
				vm.getSkuDelet()
				// console.log(vm.popupShow )
			},
			// 跳进货单
			goodOrder() {
				wx.reLaunch({
					url: "../purchase/purchase?active=1"
				})
			},
			// // 加入进货单
			// addOrder() {
			// 	this.$refs.popup.open('top')
			// },
			// 直接拿货
			// orderPicking() {
			// 	this.open()
			// },
			// 获取sku详情
			getSkuDelet() {
				const vm = this
				getGoodsSku({
					id: this.goodsId
				}).then(res => {
					const {
						data = []
					} = res
					vm.items = data.map(t => t.attrValueGroup)
					vm.selectList = data
					vm.selectList.forEach(t => {
						const arr = t.list
						vm.imgList.push(t.list[0].imgUrl)
						arr.forEach(j => {
							j.num = 0
						})
					})

					// console.log("获取sku图片", vm.imgList)
				})
			},
			// 减减事件
			reduce(skuid) {
				const arr = []
				this.selectList.forEach(t => {
					t.list.forEach(j => {
						arr.push(j)
					})
				})
				arr.forEach(f => {
					if (skuid == f.skuId) {
						f.num--
						if (f.num < 0) {
							f.num = 0
						}
					}
				})
				// 减减计算数量
				this.total = arr.reduce((total, item) => {
					const a = item.num
					return total + a
				}, 0)
				// 减减计算价格
				this.totalPrice = arr.reduce((total, t) => {
					const s = t.num * t.tradePrice
					return total + s
				}, 0)
				this.totalPrice = parseFloat(this.totalPrice).toFixed(2)
			},
			// 价格input框事件
			goodsDetail() {
				const arr = []
				this.selectList.forEach(t => {
					t.list.forEach(j => {
						arr.push(j)
					})
				})
				// 加加计算数量
				this.total = arr.reduce((total, item) => {
					const a = item.num
					return total + parseInt(a) || 0
				}, 0)
				// 加加计算价格
				this.totalPrice = arr.reduce((total, t) => {
					const s = t.num * t.tradePrice
					return total + s
				}, 0)
				this.totalPrice = parseFloat(this.totalPrice).toFixed(2)

			},
			// 数字框事件
			bindChange(skuid) {
				const arr = []
				this.selectList.forEach(t => {
					t.list.forEach(j => {
						arr.push(j)
					})
				})
				arr.forEach(f => {
					if (skuid == f.skuId) {
						f.num++
					}
				})
				// 加加计算数量
				this.total = arr.reduce((total, item) => {
					const a = item.num
					return total + a
				}, 0)
				// 加加计算价格
				this.totalPrice = arr.reduce((total, t) => {
					const s = t.num * t.tradePrice
					return total + s
				}, 0)
				this.totalPrice = parseFloat(this.totalPrice).toFixed(2)
			},
			// 选项卡事件
			onClickItem(val, item) {
				this.current = val.currentIndex
			}
		}

	}
</script>

<style lang='scss' scoped>
	.activeClass {
		width: 40rpx;
		background: red;
	}

	.container {
		background: #f9f9f9;
		letter-spacing: 2rpx;
		color: #333333;
		padding-bottom: 124rpx;
	}

	.carousel {
		height: 722rpx;
		position: relative;

		swiper {
			height: 100%;
		}

		.indexNum {
			position: absolute;
			right: 24rpx;
			bottom: 24rpx;
			border-radius: 34rpx;
			background: rgba(51, 51, 51, .3);
			color: #fff;
			font-size: 24rpx;
			text-align: center;
			width: 96rpx;
			height: 48rpx;
			line-height: 48rpx;
			/* padding: 6rpx 24rpx; */
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
			position: relative;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750rpx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.bt {
		margin: 0px 24rpx;
		border-radius: 16rpx;
	}

	.introduce-section {
		background: #fff;
		padding: 20rpx;
		/* position: relative;
		top: 24rpx; */
		z-index: 1;

		.title {
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			font-size: 24rpx;
			color: #333333;
			line-height: 30rpx;
			padding-bottom: 12rpx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			height: 50rpx;
			/* line-height: 64rpx; */
			font-size: 26rpx;
			color: #333333;
		}

		.price-tip {
			font-size: 36rpx;
		}

		.price {
			font-size: 36rpx;
			font-weight: 500;
			line-height: 50rpx;
		}

		.m-price {
			margin: 0 20rpx;
			color: #795C98;
			font-size: 30rpx;
		}

		.m-price span {
			vertical-align: top;
			margin-top: -1.2px;
			display: inline-block;
		}

		.coupon-tip {
			align-items: center;
			padding: 4rpx 10rpx;
			background: #795C98;
			font-size: 24rpx;
			color: #fff;
			border-radius: 6rpx;
			line-height: 1;
			transform: translateY(-4rpx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			height: 33rpx;
			line-height: 33rpx;
			color: #909399;
			padding: 16rpx 0 24rpx 0;

			text {
				flex: 1;
			}
		}
	}

	.c-list {
		font-size: 24rpx;
		color: #606266;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 22rpx 24rpx;
			margin-top: 24rpx;
		}

		.tit {
			width: 85rpx;
			color: rgba(51, 51, 51, 0.50);
		}

		.con {
			flex: 1;
			color: #303133;

			.selected-text {
				margin-right: 10rpx;
			}
		}

	}

	/* 评价 */
	.eva-section {
		display: flex;
		padding: 20rpx 24rpx;
		background: #fff;
		margin-top: 24rpx;

		.eva-section-img {
			width: 88rpx;
			height: 88rpx;
			border: 1px solid rgba(51, 51, 51, 0.26);
			border-radius: 5rpx;
			margin-right: 24rpx;

			image {
				display: block;
				max-width: 100%;
				width: 100%;
				height: 100%;
			}
		}

		.eva-section-main {
			width: 440rpx;
			height: 88rpx;

			.eva-section-main-name {
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
				width: 100%;
				height: 37rpx;
				line-height: 37rpx;
				color: #333333;
				font-size: 26rpx;
				font-weight: 500;
			}

			.eva-section-main-address {
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
				width: 100%;
				height: 33rpx;
				line-height: 33rpx;
				font-size: 24rpx;
				color: rgba(51, 51, 51, 0.5);
				padding-top: 18rpx;
			}

		}

		.eva-section-gostall {
			width: 106rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: right;
			color: rgba(51, 51, 51, 0.5);
		}
	}

	.section {
		display: flex;

		image {
			width: 136rpx;
			height: 136rpx;
		}
	}

	/deep/ .uni-tag--default {
		color: #333;
		font-size: 12px;
		text-align: center;
		width: 60px;
		height: 20px;
		line-height: 20px;
		padding: 0;
		display: inline-block;
	}

	/*  详情 */
	.detail-desc {
		/* background: #ccc; */
		margin-top: 16rpx;
		padding: 0rpx 24rpx 60rpx 24rpx;

		.img-detail {
			border-radius: 16rpx;

			image {
				display: block;
				/* max-width: 100%; */
				width: 100%;
			}

		}

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			font-size: 28rpx + 2rpx;
			color: rgba(51, 51, 51, 0.5);
			position: relative;
			background: #f9f9f9;
			margin-bottom: 10rpx;

			text {
				padding: 0 20rpx;
				background: #f9f9f9;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300rpx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.a-y {
		border-radius: 16px 16px 0px 0px;
		background-color: #fff;
		padding: 0 32rpx;
	}

	.a-t {
		display: flex;
		margin-bottom: 16rpx;

		image {
			width: 170rpx;
			height: 170rpx;
			flex-shrink: 0;
			margin-top: -40rpx;
			border-radius: 8rpx;
			;
		}

		.right {
			display: flex;
			flex-direction: column;
			padding-left: 24rpx;
			font-size: 24rpx + 2rpx;
			color: #606266;
			line-height: 42rpx;
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0rpx;
		bottom: 0rpx;
		right: 0rpx;
		z-index: 115;
		display: flex;
		/* justify-content: center;
		align-items: center; */
		height: 100rpx;
		line-height: 100rpx;
		padding: 0 32rpx;
		background: rgba(255, 255, 255, 1);
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.page-bottom-cd {
			/* background: #cccccc; */
			display: flex;
			font-size: 26rpx;
			color: #333333;
			width: 50%;

			.page-bottom-cd-main {
				width: 50%;
				height: 100%;
				padding-right: 24rpx;
				/* background: red; */
				text-align: center;

				.cdicon {
					/* background: yellow; */
					height: 60rpx;
					line-height: 60rpx;
					font-size: 52rpx;
				}

				.cdtext {
					/* background: black; */
					height: 40rpx;
					line-height: 40rpx;
					font-size: 24rpx;
				}
			}
		}
	}

	/deep/ uni-swiper .uni-swiper-dot-active:active {
		width: 22rpx;
		height: 22rpx;
		background: red;
	}

	/deep/ .uni-fav {
		width: 140rpx;
	}

	/deep/ uni-rich-text:nth-child(1) div {
		margin: 0 24rpx;
	}

	.action-btn-group {
		display: flex;
		margin-top: 18rpx;
	}

	.action-btn-group button {
		width: 220rpx;
		height: 64rpx;
		line-height: 64rpx;
		opacity: 1;
		border: 2rpx solid #795C98;
		border-radius: 34rpx;
		font-size: 30rpx;
	}

	.action-btn-group .action-btn-jh {
		height: 64rpx;
		margin-right: 24rpx;
		color: #795C98;

		view {
			line-height: 60rpx;
		}
	}

	.action-btn-group .action-btn-nh {
		background: #795C98;
		color: #ffffff;
		width: 190rpx;
		height: 64rpx;

		view {
			line-height: 60rpx;
		}
	}

	.section-tag /deep/ .uni-tag.data-v-1516016e {
		width: 120rpx;
		height: 40rpx !important;
		background: #f9f9f9 !important;
		border-radius: 32rpx !important;
		display: inline-block;
		line-height: 40rpx !important;
		padding: 0 5rpx !important;

		text {
			font-size: 24rpx !important;
		}
	}

	.section-hp {
		font-size: 24rpx;
		display: flex;
		margin-top: 16rpx;

		text {
			margin-right: 24rpx;
		}
	}

	.progress-box {
		color: red;
		width: 300rpx;

		progress {
			width: 300rpx;
		}
	}

	.right-text {
		overflow: hidden;
		-webkit-line-clamp: 3;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		margin-top: 21rpx;
		/* height: 74rpx; */
		font-size: 26rpx;
		font-weight: 500;
		text-align: left;
		color: #333333;
		line-height: 37rpx;
	}

	.tabs {
		.tabs-mzy {
			height: 37rpx;
			opacity: 1;
			font-size: 26rpx;
			font-weight: 400;
			text-align: left;
			color: #795C98;
			line-height: 37rpx;
		}
	}

	.models {
		font-size: 26rpx;
		font-weight: 400;
		color: #333333;
		border-radius: 4px;
	}

	.money {
		font-size: 24rpx;
		color: rgba(51, 51, 51, 0.50);
		font-weight: 400;
	}

	.inventory {
		font-size: 26rpx;
		color: rgba(51, 51, 51, 0.50);
	}

	.demo-uni-row {
		border-bottom: 1rpx solid #EEEEEE;
		padding-bottom: 24rpx;
		margin-top: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.money {
			margin-top: 8rpx;
		}

		.demo-button {
			width: 172rpx;
			height: 48rpx;
			/* line-height: 48rpx; */
			border-radius: 4rpx;
			/* padding-left: 0; */
			/* padding-right: 0; */
			background: #f9f9f9;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #333333;

			.iconfont {
				margin: 8rpx;
			}

			.content {
				padding: 0 15rpx;
				width: 100rpx;
				text-align: center;
				font-size: 26rpx;
				font-weight: 400;
			}
		}
	}

	.demo-button::after {
		border: none;
	}

	/deep/ .uni-row {
		border-bottom: 1px solid #eeeeee;
		height: 133rpx !important;
		-webkit-display: flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: space-between;
	}

	/deep/ .uni-col-10 {
		margin-left: 24rpx;
	}

	.total {
		text-align: right;
		font-size: 26rpx;
		padding: 32rpx 0;
	}

	.total-l {
		color: rgba(51, 51, 51, .5);
		margin: 0 8rpx;
	}

	.total-je {
		color: #333333;
		margin-left: 8rpx;
		font-size: 34rpx;
	}

	.heatlist-address {
		padding-top: 24rpx;
		font-size: 24rpx;
		margin-bottom: 10rpx;
		color: rgba(51, 51, 51, 0.50);
		// line-height: 33px;
		display: flex;
		justify-content: space-between;

		.heatlist-icon {
			display: flex;
			align-items: center;
		}
	}

	.page-bottoms {
		display: flex;
		/* justify-content: center;
		align-items: center; */
		height: 100rpx;
		line-height: 100rpx;
		background: rgba(255, 255, 255, .9);

		.page-bottom-cd {
			font-size: 30rpx;
			color: #333333;
			width: 50%;

			image {
				width: 48rpx;
				height: 48rpx;
				vertical-align: sub;
				margin-right: 16rpx;
			}
		}
	}

	/deep/ .uni-swiper-dots-horizontal {
		bottom: 45px !important;
	}

	/* // 选项卡样式 */
	/deep/ .segmented-control__item {
		width: 22%;
		padding: 24rpx 0;
		margin-right: 32rpx;
		-webkit-flex: none !important;
		flex: none !important;
	}

	/deep/ .segmented-control {

		/* justify-content: space-around !important; */
		/* border-bottom: 1rpx solid #eeeeee !important; */
	}

	/* 收藏样式 */
	.collect {
		background: #F9F9F9;
		padding: 6rpx 24rpx;
		border-radius: 32rpx;

		.icon-font {}

		.icon-text {}
	}

	.a-y.data-v-ea6111b8 {
		/* margin-bottom: 100rpx; */
	}

	/deep/ .vue-ref {
		bottom: 100rpx !important;
	}

	/* 购物车颜色 */
	.altve {
		color: #795C98;
	}

	.container /deep/ .uni-numbox__minus {
		height: 48rpx;
		border: none;
	}

	.container /deep/ .uni-numbox__value {
		height: 48rpx;
		border: none;
		background-color: #f8f8f8;
		line-height: 52rpx;
	}

	.container /deep/ .uni-numbox__plus {
		height: 48rpx;
		border: none;
	}

	.container /deep/ .uni-numbox {
		width: 172rpx;
		height: 48rpx;
		margin-top: 2rpx;
	}
</style>
