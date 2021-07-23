<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar>
		  <view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">商品列表</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="search-tab">
			<uni-search-bar 
				@cancel="searchCancel" 
				@input="searchInput" 
				bgColor="#f3f3f3" 
				placeholder="搜索商品" 
				:radius="38"
				 v-model="fromData.goodsName"
				placeholder-class
			>
			</uni-search-bar>
			<!-- <view class="search-input">
				<input class="uni-input" placeholder="搜索商品" placeholder-class/>
			</view> -->
			<!-- tabs选项卡 -->
			<!-- <view class="tabs">
				<ms-tabs class="tabs-mzy" :list="list" v-model="active" itemColor='#795C98' lineColor='#795C98' @input="handleChange"/>
			</view> -->
		</view>
			<!-- 全部 -->
			<view class="goods-mains" v-if="orderData.length">
				<view class="header-title" v-for="(item,index) in orderData" :key="item.id" :data-id='item.id' @click.stop="orderDetails">
					<view class="header-text">
						<view class="pick-order">
							<view class="pick-up" v-if="item.source === 1">
								<view >云档口</view>
							</view>
							<view class="pick-up other" v-else>
								<view >其它</view>
							</view>
							<!-- <view class="pick-up" v-if="item.source === 1">云档口</view>
							<view class="pick-up other" v-else>其它</view> -->
							<view><text>商品编号:</text><text class="order">{{item.id}}</text></view>
						</view>
					</view>
					<view class="header-center">
						<view class="list-img">
							<image :src="imgObs+item.fileUrl" mode=""></image>
						</view>
						<view class="header-nr">
							<p class="header-tit">{{item.name}}</p>
							<view>
								<view class="Specification">
									<view><text class="repertory">库存</text><text>999</text></view>
									<view>累计已售{{item.sale}}</view>
								</view>
								<view class="price-amount">
									<text>销售价:</text>
									<text class="price bold">￥{{item.tradePrice}}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 按钮 -->
					<view class="btn-group">
						<view  v-if="item.isShelves == 1">
							<button type="button" class="btn-primary" @click.stop="setGoods(item.id,item.source)">编辑</button>
							<button type="button" class="btn-normal" @click.stop="clickSoldOut(item.id,item.list)">下架</button>
						</view>
						<view  v-else-if="item.isShelves == 0">
							<view v-if="item.source == 2">
								<button type="button" class="btn-primary" @click.stop="setGoods(item.id,item.source)">编辑</button>
								<button type="button" class="btn-normal" @click.stop="deleteGoods(item.id)">删除</button>
							</view>
							<button v-else type="button" class="btn-primary" @click.stop="setGoods(item.id,item.source)">编辑</button>
						</view>
						<view v-else>
							<button type="button" class="btn-primary" @click.stop="grounding(item.id,item.list)">上架</button>
						</view>
					</view>
					<!-- <view class="btn-group">
						<view  v-if="item.isShelves == 1">
							<button type="button" class="btn-primary" @click.stop="setGoods(item.id,item.source)">编辑</button>
							<button type="button" class="btn-normal" @click.stop="clickSoldOut(item.id,item.list)">下架</button>
						</view>
						<view  v-else>
							<view v-if="item.source == 2">
								<button type="button" class="btn-primary">编辑</button>
								<button type="button" class="btn-normal" @click.stop="deleteGoods(item.id)">删除</button>
							</view>
							<button type="button" v-else class="btn-primary" @click.stop="grounding(item.id,item.list)">上架</button>
						</view>
					</view> -->
				</view>
			</view>
			<!-- 暂无数据 -->
			<nodata :noText="noDataText" v-else/>
		
		<!-- 规格-模态层弹窗 -->
		  <uni-popup ref="popup"  type="bottom" border-radius="16rpx">
		   <view class="modal">
				 <view class="modal-header">
					 <view @click="$refs.popup.close()">取消</view>
					 <view>云档口商品上架</view>
					 <view class="save" @click="skuSave">保存</view>
				 </view>
				 <view class="modeal-main">
					 <view class="modeal-size">
						 <view class="size">规格</view>
						 <view class="check-input" :class="checkStaus ? 'disabled-status' : ''">
							 <checkbox-group @change="checkPrice">
								<checkbox class="check-box" value="radioStaus" ></checkbox>
							 </checkbox-group>
							 <text>统一零售价</text>
							 <input class="uni-input" :disabled="checkStaus" v-model="soldOut.tradePrice" type="digit" placeholder="请填写销售价" placeholder-class/>
							 <text>元</text>
						</view>
					 </view>
					 <!-- sku列表 -->
					<view class="sku-list" v-for="(i,k) in skuList" :key="i.id">
						<view class="sku-title bold">规格{{k+1}}</view>
						<!-- 尺码 -->
							<view class="sku-size">
								<view>
									<text>尺码:</text>
									<text class="sku-name">{{i.sizeName}}</text>
								</view>
								<view class="retail-price" :class="!checkStaus ? 'selling-price' : ''">
									<text>销售价</text>
									<input class="uni-input" v-model="i.tradePrice" :disabled="checkStaus ? false : true" type="digit" placeholder="请填写销售价" placeholder-class/>
									<text>元</text>
								</view>
							</view>
							<!-- 颜色 -->
							<view class="sku-size" style="padding:0">
								<view>
									<text>颜色:</text>
									<text class="sku-name">{{i.colorName}}</text>
								</view>
								<view class="retail-price repertory">
									<text>库存:</text>
									<text class="sku-name">{{i.qty}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
		  </uni-popup>
			<uni-load-more style="padding-bottom: 70rpx;" v-if="orderData.length > 10 || orderData.length == 10" :status="loadingType" iconType="auto"></uni-load-more>
	</view>
</template>

<script>
	import {	getGoodsList,setSkuPrice,setBatchSkuPrice,deleteByGoodsId } from '@/utils/network/aftermarket.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {
				noDataText: '暂无数据~',
				loadingType: 'loading', // 加载更多状态
				batchSoldOut: { //批量上架参数
					goodsId: '',
					isShelves: 1,
					list: []
				},
				soldOut: {
					id:'', //skuId,复数时用英文逗号隔开
					tradePrice:'', //价格
					isShelves:'' ,//上下架状态
					goodsId:'' // 商品id
				}, // 上架参数
				checkStaus: true, // 多选框状态
				fromData: {
					goodsName: '', // 商品名字
					// isShelves: 1,
					// source: '',
					selectType:1,
					pageNum: 1,
					pageSize: 10
				},
				skuList:[],// sku数据
				loadingType: 'loading', // 加载更多状态
				//分页
				current: 1,
				orderStatus: '',
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				list: [{title: '上架销售中', value:1}, {	title: '已下架',value:0}, {	title: '云档口待上架',source:1}],
				active: 0,
				orderData: []
			}
		},
		// 上拉加载
		onReachBottom() {
			const vm = this
			vm.fromData.pageNum++
			getGoodsList(vm.fromData).then(res => {
				vm.orderData = [...vm.orderData, ...res.data.records]
			})
			if(vm.fromData.pageNum > vm.current) {
				vm.loadingType='nomore'
				return
			}
		 },
		methods:{
			// 搜索框取消事件
			searchCancel() {
				uni.navigateTo({
					url: './goods'
				})
			},
			// 搜索input事件
			searchInput(e) {
				const vm = this
				vm.getGoods()
			},
			// 跳转编辑
			setGoods(id,source) {
				if(source == 1) {
					uni.navigateTo({
						url: './stallGoodsDetail?goodsId='+id
					})
				}else{
					uni.navigateTo({
						url:'./AddGoods?goodsId='+id
					})
				}
			},
			// 下架
			clickSoldOut(id,list) {
				const vm = this
				const skuId = list.map(item => item.id).join(',')
				setSkuPrice({
					id:skuId,
					isShelves: 0,
					goodsId: id
				}).then(res => {
					uni.showToast({title: "下架成功!", icon:'none'})
					vm.fromData.pageNum = 1
					vm.getGoods()
					vm.$refs.popup.close()
				})
			},
			// SKU保存
			skuSave() {
				const vm = this
				console.log("上架数据:",vm.skuList)
				if (!vm.checkStaus) { // 统一零售价上架
					setSkuPrice(vm.soldOut).then(res => {
						//  清空数据
						vm.soldOut.isShelves = ''
						vm.soldOut.id = ''
						vm.soldOut.tradePrice = ''
						uni.showToast({title: "上架成功!", icon:'none'})
						vm.getGoods()
						vm.$refs.popup.close()
					})
				}else{ // 批量上架
					vm.batchSoldOut.list = vm.skuList.map(item => ({id: item.id, tradePrice: item.tradePrice, isShelves: 1}))
					setBatchSkuPrice(vm.batchSoldOut).then(res => {
						uni.showToast({title: "上架成功!", icon:'none'})
						vm.batchSoldOut.list = []
						vm.getGoods()
						vm.$refs.popup.close()
					})
				}
			},
			// 多选框事件
			checkPrice(e) {
				const vm = this
				if(e.detail.value.length){
					vm.checkStaus = false
				}else{
					vm.checkStaus = true
				}
			},
			// 获取商品列表数据
			getGoods() {
				const vm = this
				wx.showLoading({
				   title: '加载中'
				})
				getGoodsList(vm.fromData).then(res => {
					wx.hideLoading()
					vm.orderData = res.data.records
					vm.current = res.data.pages
				}).catch(() => {
					this.onAbort()
					wx.hideLoading()
				})
			},
			// 删除商品
			deleteGoods(goodsId) {
				const vm = this
				uni.showModal({
				    title: '删除商品',
				    content: '此操作将永久删除选中商品,是否继续?',
				    success: function (res) {
				        if (res.confirm) {
				           deleteByGoodsId({id:goodsId}).then(data => {
										vm.fromData.pageNum = 1
				           	vm.getGoods()
				           	uni.showToast({title: "删除成功!", icon:'none'})
				           })
				        } else if (res.cancel) {}
				    }
				})
			},
			// 上架
			grounding(id,list){
				const vm = this
				list.forEach(i => {
					i.tradePrice = ''
				})
				vm.skuList = list
				vm.soldOut.id = list.map(item => item.id).join(',')
				vm.soldOut.isShelves = 1
				vm.soldOut.goodsId = id
				vm.batchSoldOut.goodsId = id
				this.$refs.popup.open()
			},
			//Tab选项卡
			handleChange(index, tab) {
				const vm = this
				vm.fromData.isShelves = tab.value
				delete vm.fromData.source
				if (index === 2) {
					vm.fromData.source = 1
					vm.fromData.isShelves = 0
				}
				vm.getGoods()
			},
			// 返回上一页
			clickBack() {
				uni.redirectTo({
					url:'./goods'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	// 修改暂无数据高度
	/deep/ .no-data-conter{
		margin-top:60% !important;
	}
	// 修改tab样式
	/deep/ .uni-navbar--border{
		border: none !important;
	}
	.contont{
		height: 100vh;
		background-color: #f9f9f9;
		.search{
			background-color: #ffffff;
			display: flex;
			width: 696rpx;
			position: relative;
			left: 0rpx;
			bottom: 0rpx;
			.iconfont{
				font-size: 48rpx;
			}
			text{
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: rgba(0,0,0,0.85);
				line-height: 48rpx;
				margin: auto;
			}
		}
		/deep/ .uni-searchbar__box-icon-search{
			.iconfont{
				color: rgba(51,51,51,0.50) !important;
			}
		}
		/deep/ .tabBlock .tab__item-title {
			font-weight: 400 !important;
		}
		.search-tab{
			width: 100%;
			position: fixed;
			z-index: 999;
			background-color: #FFFFFF;
			/deep/ .uni-searchbar__box{
				border: none;
			}
			/deep/ .input-placeholder{
				color:rgba(51,51,51,0.26) !important;
			}
			/deep/ .uni-searchbar__text-placeholder{
				color:rgba(51,51,51,0.26) !important;
			}
			// .search-input{
			// 	padding: 24rpx;
			// 	background-color: #ffff;
			// 	.uni-input{
			// 		padding-left: 24rpx;
			// 		height: 60rpx;
			// 		opacity: 1;
			// 		text-align: center;
			// 		background: #f3f3f3;
			// 		border-radius: 38rpx;
			// 		background-size:32rpx 32rpx;
			// 		background-image: url(../../../../static/me/icon_system_search.png);
			// 		background-repeat: no-repeat;
			// 		background-position:left;
			// 		background-position-x:24rpx;
			// 		/deep/ .input-placeholder{
			// 			font-size: 26rpx;
			// 			font-weight: 400;
			// 			// text-align: center;
			// 			color: rgba(51,51,51,0.50);
			// 		}
			// 	}
			// }
			// 选项卡样式
			// .tabs {
			// 	font-size: 30rpx;
			// 	color: #333333;
			// 	background-color: #FFFFFF;
			// 	box-shadow: 0 3px 10px -5px #ccc inset;
			// 	/deep/.tabBlock .tab__item-title {
			// 		margin: 0 50rpx;
			// 	}
			// 	/deep/ .tab {
			// 		height: 84rpx !important;
			// 	}
			// 	/deep/ .tab__item {
			// 		line-height: 84rpx !important;
			// 	}
			// }
		}
		// 商品数据
		.goods-mains{
			margin-top: 95rpx;
			padding:24rpx;
			.header-title {
				margin-bottom: 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				padding: 24rpx;
				.pick-order{
					font-size: 26rpx;
					padding-bottom: 24rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.pick-up{
					width: 30px;
					height: 14px;
					font-size: 20rpx;
					font-weight: 400;
					color: #795c98;
					border: 1px solid #795c98;
					border-radius: 7rpx;
					margin-right: 16rpx;
					text-align: center;
					line-height: 15px;
					}
					.other{
						width: 56rpx !important;
						color: #F8788E !important;
						border: 1px solid #f8788e !important;
					}
					.order{
						padding-left: 8rpx;
					}
				}
				
				.header-center {
					padding: 24rpx 0;
					border-top: 2rpx solid #EEEEEE;
					border-bottom: 2rpx solid #eeeeee;
					display: flex;
					.list-img{
						width: 166rpx;
						height: 166rpx;
						overflow: hidden;
						border-radius: 8rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
					.header-nr {
						margin-left: 24rpx;
						width: 480rpx;
				
						.header-tit {
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
							font-size: 26rpx;
							font-weight: 400;
							height: 72rpx;
							line-height: 36rpx;
						}
						.Specification{
							display: flex;
							justify-content: space-between;
							height: 36rpx;
							opacity: 1;
							font-size: 26rpx;
							font-weight: 400;
							color: rgba(51,51,51,0.50);
							line-height: 36rpx;
							margin: 8rpx 0;
							.repertory{
								margin-right: 8rpx;
							}
						}
						.price-amount{
							height: 42rpx;
							opacity: 1;
							font-size: 30rpx;
							font-weight: 400;
							text-align: left;
							color: #333333;
							line-height: 42rpx;
							display: flex;
							.price{
								width: 76%;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								line-clamp: 1;
								-webkit-box-orient: vertical;
								margin-left: 16rpx;
								font-weight: 500;
							}
						}
					}
				}
				// 按钮样式
				.btn-group {
					margin-top: 24rpx;
					overflow: hidden;
					button {
						float: right;
						padding: 11rpx 24rpx;
						border-radius: 60rpx;
						font-size: 30rpx;
						color: #fff;
						line-height: 42rpx;
					}
					.btn-normal {
						float: left;
						color: #333333;
						background-color: #fff;
						box-shadow: 0 0 0 2rpx rgba(51,51,51,0.5) inset;
					}
					.btn-primary {
						background-color: #795c98;
					}
				}
			}
		}
		// 模态框样式
		.modal{
		  border-radius: 16rpx 16rpx 0rpx 0rpx;
		  background: #FFFFFF;
			.modal-header{
				padding: 32rpx 24rpx;
				border-bottom: 2rpx solid #eeeeee;
				display: flex;
				justify-content: space-between;
				height: 50rpx;
				opacity: 1;
				font-size: 36rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				text-align: left;
				color: #333333;
				line-height: 50rpx;
				.save{
					color: #795c98;
				}
			}
			.modeal-main{
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
				padding: 24rpx 48rpx 48rpx 48rpx;
				.disabled-status{
					color: rgba(51,51,51,0.26);
					/deep/ .input-placeholder{
						color:rgba(51,51,51,0.26) !important;
					}
				}
				.modeal-size{
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-bottom: 19rpx;
					.size{
						font-size: 30rpx;
						font-weight: 500;
					}
				}
				// input样式
				.uni-input{
					width: 214rpx;
					height: 52rpx;
					border: 2rpx solid #eeeeee;
					border-radius: 6rpx;
					margin: 0 16rpx;
					text-align: center;
					/deep/ .input-placeholder{
						line-height: 52rpx;
						color: rgba(51,51,51,0.50);
						font-size: 26rpx;
						font-weight: 400;
					}
				}
				.sku-list{
					padding-top: 24rpx;
					.sku-title{
						font-weight: 500;
					}
					.sku-name{
						margin-left: 16rpx;
					}
					.sku-size{
						padding: 16rpx 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.selling-price{
							color: rgba(51,51,51,0.26);
							/deep/ .input-placeholder{
								color:rgba(51,51,51,0.26) !important;
							}
						}
						.retail-price{
							display: flex;
							align-items: center;
						}
						.repertory{
							color: rgba(51,51,51,0.50);
						}
					}
				}
				.check-input{
					display: flex;
					align-items: center;
					// 多选框样式
					checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked{
						width: 32rpx;
						height: 32rpx;
						background:#795c98;
						border: 1rpx solid #795c98;
						border-radius: 50%;
						color: #FFFFFF;
					}
					checkbox /deep/ .wx-checkbox-input{
						width: 32rpx;
						height: 32rpx;
						border: 1rpx solid #eeeeee;
						border-radius: 50%;
					}
					// √样式
					checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked::before{
						width: 25rpx;
						height: 25rpx;  
						line-height: 25rpx;
						text-align: center;
						font-size: 25rpx;
						color: #fff;
						background: transparent;
						transform: translate(-50%, -50%) scale(1);
						-webkit-transform: translate(-50%, -50%) scale(1);
					}
				}
			}
		}
	}
</style>


