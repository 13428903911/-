<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar shadow>
			<view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">云档口商品详情</text>
				</view>
			</view>
		</uni-nav-bar>
		
		<view class="add-goods-main">
			<!-- 商品标题 -->
			<view class="goods-title">
				<view>商品标题</view>
				<view class="textarea-num">{{formData.name}}</view>
			</view>
			
			<!-- 商品图片 -->
			<view class="goods-title">
				<view>商品图片</view>
				<!-- <scroll-view class="scroll-view_H" scroll-x="true"> -->
					<view class="file-picker">
						<view class="file-upload-img" v-for="(item,index) in goodsImgList" :key="index">
							<image :src="imgObs + item" class="img"></image>
						</view>
					</view>
			  <!-- </scroll-view> -->
			</view>
			
			<!-- 类目 -->
			<view class="goods-class">
				<view>类目</view>
				<view class="class-icon">
					<text>{{className}}</text>
				</view>
			</view>
			
			<!-- 运费 -->
			<view class="goods-class">
				<view>运费</view>
				<view class="class-icon">
					<text class="Pinkage">包邮</text>
				</view>
			</view>
			
			<!-- 规格 -->
			<view class="godds-spec">
				<view class="modeal-main">
					<view class="modeal-size">
						 <view class="size">规格</view>
						 <view class="check-input" :class="checkStaus ? 'disabled-status' : ''">
							 <checkbox-group @change="checkPrice">
								<checkbox class="check-box" value="radioStaus" ></checkbox>
							 </checkbox-group>
							 <text>统一零售价</text>
							 <input class="uni-input" :disabled="checkStaus" v-model="soldOut.tradePrice" @input="tradePriceChange" type="digit" placeholder="请填写销售价" placeholder-class/>
							 <text>元</text>
						</view>
					 </view>
					 <!-- sku列表 -->
					<view class="sku-list" v-for="(i,k) in formData.skuList" :key="i.id">
						<view class="sku-title bold">规格{{k+1}}</view>
						<!-- 尺码 -->
							<view class="sku-size">
								<view>
									<text>尺码:</text>
									<text class="sku-name">{{i.sizeName || ''}}</text>
								</view>
								<view class="retail-price" :class="!checkStaus ? 'selling-price' : ''">
									<text>销售价</text>
									<input class="uni-input" v-model="i.tradePrice" @input="goodsMarket(i.tradePrice,i.id)" :disabled="checkStaus ? false : true" type="digit" placeholder="请填写销售价" placeholder-class/>
									<text>元</text>
								</view>
							</view>
							<!-- 颜色 -->
							<view class="sku-size" style="padding:0">
								<view>
									<text>颜色:</text>
									<text class="sku-name">{{i.colorName || ''}}</text>
								</view>
								<view class="retail-price repertory">
									<text>库存:</text>
									<text class="sku-name">{{i.qty}}</text>
								</view>
							</view>
					</view>
					<view class="goods-repertory">
						<view>库存</view>
						<view>{{formData.qty}}件</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 按钮 -->
		<view class="btn-group">
			<button type="button" class="btn-primary" @click="StoresSelling">上架售卖</button>
		</view>
	</view>
</template>
<script>
	import { getDoodsDetail,setSkuPrice,setBatchSkuPrice  } from '@/utils/network/aftermarket.js'
	export default {
		data() {
			return {
				checkStaus: true, // 多选框状态
				goodsId: '',
				className: '', // 分类名称
				formData: { // 商品新增与编辑
					id: '', // 商品id（没有时不传（为添加），有时要传（为修改））
					qty: '', // 库存
					name: '', // 商品名称
					firstCategoryId: '', // 一级分类id
					secondCategoryId: '', // 二级分类id
					source: 2, // 商品来源（1为云档口商品，2为门店商品）
					imgUrl: '', // 商品封面图，取商品图片第一张
					isFreeShip: 1, // 是否包邮（1包邮，0不包邮）
					goodsDetail: '', // 商品详情文字信息（小程序使用）
					goodsImgUrl: '', // 商品详情图片（小程序使用）
					isShelves: 1, // 是否上架：1上架，0下架
					deleteIds: '', // 删除skuId集合（英文逗号隔开）
					fileList:[], // 商品图片
					skuList: [] // 新增sku的数据
				}, 
				goodsImgList:[],
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				uploadUrl: '',
				soldOut: { // 统一零售价参数
					tradePrice: '', // 统一零售价
					id: '', // skuId,复数时用英文逗号隔开
					isShelves: 1, // 上下架状态
					goodsId: '' // 商品id
				},
				soldOutList: { // 批量上架
					goodsId: '', // 商品id
					isShelves: 1, // 上下架状态
					list: []
				}
			}
		},
		onLoad(options) {
			const vm = this
			if (options.goodsId) {
				vm.goodsId = options.goodsId // 跳转过来的商品id
				vm.getGoodsDetail(options.goodsId) // 调获取商品详情方法
			}
		},
		methods: {
			// 统一零售价input框chagne事件
			tradePriceChange(e) {
				const vm = this
				vm.formData.skuList.forEach(item => {
					vm.$nextTick(() => {
						vm.soldOut.tradePrice = (e.detail.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
						item.tradePrice = vm.soldOut.tradePrice
					})
					
				})
			},
			// 销售价input事件
			goodsMarket(price,id) {
				const vm = this
				vm.formData.skuList.forEach(item => {
					if (id == item.id) {
						vm.$nextTick(() => {
							item.tradePrice = (price.match(/^\d*(\.?\d{0,2})/g)[0]) || null
						})
					}
				})
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
			// 获取商品详情
			getGoodsDetail(id) {
				const vm = this
				getDoodsDetail({ id }).then(res => {
					// 回显数据
					const {data = {}} = res
					vm.soldOut.goodsId = data.id
					vm.soldOutList.goodsId = data.id
					vm.formData.name = data.name // 商品名字
					vm.formData.fileList = data.fileList // 商品图片赋值
					vm.goodsImgList = data.fileList.map(item => item.fileUrl) // 回显商品图片
					vm.className = data.firstCategoryName // 回显分类名称
					vm.formData.skuList = data.skuList // sku赋值
					vm.formData.qty = data.qty // 库存
					vm.soldOut.id =  data.skuList.map(item => item.id).join(',') // skuid赋值
				})
			},
			// 上架售卖-新增商品
			StoresSelling() {
				const vm = this
				if (!vm.checkStaus) { // 统一零售价上架
					setSkuPrice(vm.soldOut).then(res => {
						uni.showToast({title: "上架成功!", icon:'none'})
						uni.navigateTo({ url: './goods'})
					})
				}else{
					vm.soldOutList.list = vm.formData.skuList.map(item => ({id:item.id, tradePrice: item.tradePrice, isShelves:1 }))
					setBatchSkuPrice(vm.soldOutList).then(res => {
						uni.showToast({title: "上架成功!", icon:'none'})
						uni.navigateTo({ url: './goods'})
					})
				}
			},
			clickBack() {
				uni.navigateBack({})
			},
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.contont {
		font-weight: 400;
		.search {
			background-color: #ffffff;
			display: flex;
			width: 696rpx;
			position: relative;
			left: 0rpx;
			bottom: 0rpx;

			.iconfont {
				font-size: 48rpx;
			}

			text {
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: rgba(0, 0, 0, 0.85);
				line-height: 48rpx;
				margin: auto;
			}
		}

		.add-goods-main {
			padding: 24rpx 24rpx 85rpx 24rpx;
			font-size: 30rpx;
			.goods-title {
				padding: 24rpx 24rpx 0rpx 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				margin-bottom: 16rpx;

				.textarea-num {
					padding: 24rpx 0;
					font-size: 26rpx;
					font-weight: 400;
					// 多行输入框
					.uni-textarea {
						width: 100%;
						margin-top: 24rpx;
						padding: 24rpx;
						height: 219rpx;
						background: #f9f9f9;
						border-radius: 4rpx;
						box-sizing: border-box;

						/deep/ .placeholder {
							font-size: 26rpx;
							font-weight: 400;
							color: rgba(51, 51, 51, 0.26);
						}
					}

					.num {
						font-size: 26rpx;
						font-weight: 400;
						text-align: right;
						position: relative;
						left: -60rpx;
						bottom: 61rpx;
					}
				}

			}

			// 类目
			.goods-class {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 27rpx 24rpx;
				font-size: 30rpx;
				font-weight: 400;
				background: #ffffff;
				border-radius: 16rpx;
				margin-bottom: 16rpx;

				.class-icon {
					display: flex;
					align-items: center;

					.Pinkage {
						font-size: 30rpx;
						font-weight: 400;
						text-align: right;
						color: rgba(51, 51, 51, 0.26);
					}

					.iconfont {
						margin-left: 24rpx;
						font-size: 48rpx;
						color: #9e9e9e;
					}
				}
			}
	
	
	
		}
	}
	// 规格样式
	.godds-spec {
		padding: 24rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		.modeal-main{
			font-size: 26rpx;
			font-weight: 400;
			color: #333333;
			// padding: 24rpx 48rpx 48rpx 48rpx;
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
					font-weight: 400;
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
					// margin-left: 20rpx;
				}
			}
			.sku-list{
				padding-top: 24rpx;
				.sku-title{
					font-weight: 500;
					font-family: PingFangSC, PingFangSC-Medium;
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
			.goods-repertory{
				font-size: 30rpx;
				margin-top:68rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
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
	.file-picker::-webkit-scrollbar {
		display: none; 
	}
	// // 图片上传样式
	.file-picker {
		padding: 24rpx 0;
		overflow-x: auto;
		display: -webkit-box; 
		-webkit-overflow-scrolling: touch;
		.file-upload{
			width: 150rpx;
			height: 150rpx;
			margin-right: 16rpx;
			opacity: 1;
			background: #f9f9f9;
			border: 1rpx solid #eeeeee;
			border-radius: 5rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			span {
				color: #C6C6C6;
				font-size: 44rpx;
				text-align: center;
				margin-bottom: 10rpx;
			}
			.title {
				font-size: 24rpx;
				font-weight: 400;
				text-align: center;
				color: #333333;
			}
		}
		.file-upload-img{
			width: 150rpx;
			height: 150rpx;
			margin-right: 16rpx;
			opacity: 1;
			background: radial-gradient(rgba(255,255,255,0.50), rgba(202,202,202,0.50));
			border-radius: 4rpx;
			.img{
				width: 100%;
				height: 100%;
				// position: absolute;
			}
			.icons{
				position: relative;
				top: -164rpx;
				right: -111rpx;
			}
		}
	}

	// 按钮样式
	.btn-group {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 9;
		background-color: #FFFFFF;
		padding: 18rpx 0;
		overflow: hidden;
		border-top:2rpx solid #eeeeee;
		button {
			float: right;
			padding: 11rpx 24rpx;
			border-radius: 60rpx;
			font-size: 30rpx;
			color: #fff;
			line-height: 42rpx;
			margin-right: 24rpx;
		}

		.btn-normal {
			// padding: 8rpx 22rpx;
			color: #333333;
			background-color: #fff;
			box-shadow: 0 0 0 2rpx rgba(51, 51, 51, 0.5) inset;
		}

		.btn-primary {
			background-color: #795c98;
		}
	}
</style>
