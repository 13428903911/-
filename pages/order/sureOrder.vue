<template>
	<view class="header">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar>
		    <view slot="left">
				<view class="search">
					<view class="iconfont" @click="back">&#xe618;</view>
					<text style="font-size: 34rpx;">确认订单</text>
				</view>
			</view>
		</uni-nav-bar>
		<view style="background: #f9f9f9;padding-bottom: 192rpx;">
			<view v-if="!formDatass.name" class="header-sure" @click="myurl(1)">
				<text class="sure-dz">暂无地址信息</text>
				<text class="sure-add">添加地址</text>
				<view style="clear: both;"></view>
			</view>
			<view v-else class="header-sure suer-flex" @click="myurl(1)">
				<view class="flex-l">
					<p>{{formDatass.name}} {{formDatass.phone}}</p>
					<p>{{formDatass.fullAddress}}</p>
				</view>
				<i class="iconfont">&#xe61a;</i>
			</view>
			<view v-for="(item,index) in orderDatas" :key="index">
				<view class="sure-center">
					<text class="sure-txt">{{item.stallName || ''}}</text>
					<view v-for="(items,index) in item.goodsInfos" :key="index">
						<view class="header-center">
							<image :src="imgObs+items.goodsUrl" mode=""></image>
							<view class="header-nr">
								<p class="header-tit">{{items.goodsName || ''}}</p>
								<text class="header-color">48小时发货</text>
							</view>
						</view>
						<view class="header-list" v-for="(is,index) in items.goodsSpecs" :key="index">
							<view class="header-jg">
								<text class="dj">颜色：</text>
								<text class="jq">{{is.colorName || ''}}</text>
							</view>
							<view class="header-jg">
								<text class="dj">尺寸：</text>
								<text class="jq">{{is.sizeName || ''}}</text>
							</view>
							<view class="header-jg">
								<text class="dj">单价：</text>
								<text class="jq jk">￥{{is.price || ''}}</text>
								<text class="sl">x{{is.amount || ''}}</text>
								<view style="clear: both;"></view>
							</view>
						</view>
					</view>
					<view class="bz" @click="changeRemark(item.stallId)">
						<text style="width: 115rpx;">备注：</text>
						<input style="width: 100%;" v-model="item.remark" maxlength="600" type="text" value="" @blur="blurRemark"/>
					</view>
				</view>
			</view>
			<!-- <view class="sure-bottom-top">
				<view class="bottom-right">
					<view class="bottom-yf">
						<text>运费：</text>
						<text class="je">￥0</text>
					</view>
				</view>
			</view> -->
			<view class="sure-bottom">
				<view class="bottom-right">
					<view class="bottom-yf">
						<text>应付金额（不含运费）：</text>
						<text class="je">￥{{totalPrice | money}}</text>
						<!-- <text class="je">￥{{moneysss | money}}</text> -->
					</view>
					<view v-if="!formDatass.name" class="bottom-btn" @click="open">
						提交订单
					</view>
					<view v-else class="bottom-btn" @click="checkstand">
						提交订单
					</view>
				</view>
			</view>
			<uni-popup ref="popup" type="dialog">
				<uni-popup-dialog type="success" title="提交订单" content="您还没有填写收货地址，请先填写收货地址" :duration="2000"
					:before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		createOrder,
		getDefaultConsInfo
	} from '@/utils/network/api.js'
	export default {
		filters:{
			// 历史搜索展示限制
			money(totalPrice){
				if(!totalPrice){
					return
				}
				if(totalPrice.toString().length>11){
					return totalPrice.slice(0,11)+'...'
				}else{
					return totalPrice
				}
			},
		},
		data() {
			return {
				// moneysss:10000000.00,
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				addressId: 0,
				orderSource: 'APPLETS',
				remark: '',
				storage_key: '',
				orderDatas: [],
				formDatass: {
					name: '',
					phone: '',
					address: '',
					consId: ''
				},
				totalPrice: '',
				active:0
			}
		},
		onShow() {
			const than = this
			than.consInfo()
		},
		onLoad(options) {
			const than = this // 注意this的指向
			if(options.active==='1'){
				than.active = parseInt(options.active)
			}
			uni.getStorage({
				key: 'SubmitOrders',
				success(res) {
					than.orderDatas = JSON.parse(JSON.stringify(res.data))
					// than.orderDatas.forEach(t => {
					// 	return than.$set(t, 'remark',null)
					// })
					// console.log('than.orderDatas',than.orderDatas)
					//算价格
					let list = []
					than.orderDatas.forEach(f => {
						f.goodsInfos.forEach(t => {
							// console.log(t.goodsSpecs)
							t.goodsSpecs.forEach(l => {
								list.push(l)
							})
						})
					})
					than.totalPrice = list.reduce((total, item) => {
						const skuTotal = parseFloat(item.amount) * parseFloat(item.price)
						return total + skuTotal
					}, 0)
					than.totalPrice = parseFloat(than.totalPrice).toFixed(2)
				}
			})
			
		},
		methods: { 
			// 添加备注
			changeRemark(id){
				// console.log('添加备注id',id)
			},
			blurRemark(e){
			  // console.log('添加备注',e.detail.value)
				console.log(this.orderDatas)
			},
			// 提交订单(确定下单)
			checkstand() {
				uni.removeStorageSync('SubmitOrders')
				uni.removeStorageSync('evt_key')
				const vm = this
				let params = {
					addressId: vm.formDatass.consId,
					orderInfo: [],
					orderSource: "APPLETS",
					// remark: vm.remark,
					orderType: '2'
				}
				const orderList = JSON.parse(JSON.stringify(vm.orderDatas))
				if (!orderList.length) {
					uni.showToast({
						title: '订单信息有误，请重新购买',
						icon: 'none',
						duration: 2000
					});
					return false
				}
				//本地模拟订单提交UI效果
				uni.showLoading({
					title:'正在提交订单...'
				})
				const arr = orderList.map(t => {
					const item = {
						stallId: t.stallId,
						remark:t.remark,
						orderGoods: []
					}
					item.orderGoods = t.goodsInfos.map(j => {
						const goods = {
							goodsImg: j.goodsUrl,
							orderDetail: []
						}
						goods.orderDetail = j.goodsSpecs.map(n => {
							const sku = {
								amount: n.amount,
								skuId: n.skuId,
							}
							return sku
						})
						return goods
					})
					return item
				})
				params.orderInfo = arr
				// console.log(params)
				setTimeout(()=>{
					createOrder(params).then(res => {
						uni.hideLoading();
						uni.redirectTo({
							// url: '/pages/order/checkstand?orderId=' + res.data + '&totalMoney=' + this.totalPrice
							url:'./myOrder'
						})
					},1000)
				})
			},
			//收货地址接口
			consInfo() {
				const that = this
				if(that.active === 0 ){
					getDefaultConsInfo().then(res => {
						that.formDatass = res.data	
						that.consId = that.formDatass.consId
					})
				}else{
					uni.getStorage({
						key: 'evt_key',
						success(res) {
							that.formDatass = JSON.parse(JSON.stringify(res.data))
						}
					})
				}
			},
			// 返回上一页
			back(){
				uni.navigateBack({})
				// uni.switchTab({
				// 	url: '../purchase/purchase'
				// })
			},
			//跳转添加地址
			myurl(e) {
				const than = this
				uni.removeStorageSync('SubmitOrders')
				uni.setStorageSync('SubmitOrders',than.orderDatas);
				uni.navigateTo({
					url: '/pages/me/myurl/myurl?orderTz=' + e
				})
			},
			//弹窗
			open() {
				this.$refs.popup.open()
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close() {
				this.$refs.popup.close()
			},
			/**
			 * 点击确认按钮触发跳转到地址信息
			 * @param {Object} done
			 * @param {Object} value
			 */
			confirm() {
				this.$refs.popup.close()
				uni.navigateTo({
					url: '/pages/me/myurl/myurl'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		background: #f9f9f9;
		color: #333333;
		letter-spacing: 2rpx;
		box-shadow: 0px 4rpx 8rpx -1px rgba(0, 0, 0, 0.10) inset;
		height: 100vh;

		.header-sure {
			margin: 24rpx 24rpx 24rpx;
			border-radius: 16rpx;
			background: #fff;
			padding: 24rpx;
			font-size: 30rpx;

			.sure-dz {
				vertical-align: sub;
			}

			.sure-add {
				width: 168rpx;
				height: 64rpx;
				background: #795C98;
				border-radius: 32rpx;
				display: inline-block;
				line-height: 64rpx;
				text-align: center;
				color: #fff;
				float: right;
			}
		}

		.suer-flex {
			display: flex;
			align-items: center;

			.flex-l {
				flex: 1;
			}

			.iconfont {
				font-size: 48rpx;
			}
		}

		.sure-center {
			border-radius: 16rpx;
			margin: 24rpx;
			background: #FFFFFF;

			.sure-txt {
				margin: 24rpx;
				display: inline-block;
				font-size: 30rpx;
			}

			.header-center {
				padding: 24rpx;
				display: flex;

				image {
					width: 150rpx;
					height: 150rpx;
					border-radius: 8rpx;
				}

				.header-nr {
					margin-left: 24rpx;
					width: 480rpx;

					.header-tit {
						font-size: 30rpx;
						text-align: justify;
						text-align-last: left;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.header-color {
						font-size: 26rpx;
						margin-top: 15px;
						display: inline-block;
						color: rgba(51, 51, 51, 0.50);
					}

					.header-dd {
						float: right;
						font-size: 30rpx;
						margin-top: 16rpx;

						.dd {
							padding: 0 24rpx;
							height: 64rpx;
							border-radius: 34rpx;
							display: inline-block;
							line-height: 64rpx;
							text-align: center;
							margin-right: 16rpx;
						}

						.fk {
							padding: 0 24rpx;
							height: 64rpx;
							opacity: 1;
							background: #ed2648;
							border-radius: 32rpx;
							display: inline-block;
							line-height: 64rpx;
							text-align: center;
							color: #fff;
						}
					}
				}
			}

			.header-list {
				margin: 0 24rpx 24rpx;
				padding-bottom: 12px;
				border-bottom: 1rpx solid #eeeeee;
				;

				.header-jg {
					font-size: 26rpx;
					margin-top: 8rpx;

					.dj {
						color: rgba(51, 51, 51, 0.50);
					}

					.jk {
						font-size: 30rpx;
					}

					.sl {
						float: right;
						color: #333333;
					}
				}
			}

			.bz {
				font-size: 30rpx;
				display: flex;
				padding: 0 24rpx 24rpx;
			}
		}

		.sure-bottom-top {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 108rpx;
			height: 85rpx;
			line-height: 85rpx;
			background: #fff;
			padding: 0 64rpx;
			font-size: 24rpx;

			.je {
				color: #333333;
				font-weight: 500;
				font-size: 26rpx;
			}
		}

		.sure-bottom {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 109rpx;
			line-height: 109rpx;
			font-size: 26rpx;
			background: rgba(255, 255, 255, 1);
			.bottom-right {
				text-align: right;

				.bottom-yf {
					display: inline-block;
					margin-right: 24rpx;

					.je {
						color: #333333;
						font-weight: 500;
					}
				}

				.bottom-btn {
					display: inline-block;
					padding: 0 36rpx;
					height: 110px;
					background: #795C98;
					color: #FFFFFF;
					font-size: 30rpx;
				}
			}
		}
	}

	/deep/ .uni-popup__success {
		color: #333333 !important;
		font-size: 34rpx;
	}

	/deep/ .uni-button-color {
		color: #333333;
		font-size: 34rpx;
	}
	.search{
		background-color: #ffffff;
		display: flex;
		width: 696rpx;
		position: relative;
		left: 0rpx;
		bottom: 0rpx;
		.iconfont{
			font-size: 52rpx;
		}
		text{
			margin: auto;
		}
	}
	.tabActive{
		color:#ED2648;
	}
</style>
