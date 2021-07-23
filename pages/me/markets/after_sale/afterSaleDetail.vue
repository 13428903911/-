<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar shadow>
			<view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">退款详情</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="detail-stautus">
			<view class="detail-img">
				<image class="imsges" src="../../../../static/me/bg_shape.png"></image>
			</view>
			<view class="title-text bold">{{orderData.afterSaleType.description || ''}}{{orderData.afterSaleStatus.userMsg || ''}}</view>
		</view>
		<!-- 商品信息 -->
		<view style="margin-bottom:124rpx;">
			<view class="header-title"
				@click.stop="orderDetails">
				<view class="header-text">
					<view>商品信息</view>
					<view class="pending">{{orderData.afterSaleStatus.userMsg || ''}}</view>
				</view>
				<view class="header-center" v-for="(i,index) in orderData.goodsList" :key="index">
					<view class="list-img">
						<image :src="imgObs+i.goodsPhoto" mode=""></image>
					</view>
					<view class="header-nr">
						<p class="header-tit">{{i.goodsName || ''}}</p>
						<view>
							<view class="Specification">
								<text>{{i.goodsSpecs || ''}}</text>
								<!-- <text style="margin-left: 10rpx;">L码</text> -->
							</view>
							<view class="price-amount">
								<text class="price">￥{{i.goodsPrice ||''}}/件</text>
								<text class="amount">x{{i.goodsNum || ''}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="close">
					<view class="close-goods">
						<view>退款金额<text class="total-price">￥{{orderData.goodsMoney || ''}}</text></view>
					</view>
				</view>
			</view>
			<!-- 售后信息 -->
			<view class="order-information">
				<view class="order-information-title">售后信息</view>
				<view class="logistics-information">
					<text>退款原因:</text><text class="content">{{orderData.refundReason || ''}}</text>
				</view>
				<view class="logistics-information">
					<text>收货人:</text><text class="name">{{orderData.relationName || ''}}</text>
				</view>
				<view class="logistics-information">
					<text>联系电话:</text><text class="content">{{orderData.shopAdrTelephone || ''}}</text>
				</view>
				<view class="logistics-information">
					<text>退款类型:</text><text class="content">{{orderData.afterSaleType.description || ''}}</text>
				</view>
				<view class="logistics-information" v-if="orderData.afterSaleStatus.name == 'RETURNED'">
					<text>退款方式:</text><text class="content">{{orderData.afterSaleMethod.description || ''}}</text>
				</view>
				<view class="logistics-information">
					<text>售后单号:</text><text class="content">{{orderData.afterSaleId}}</text>
				</view>
				<view class="logistics-information">
					<text>申请时间:</text><text class="content">{{orderData.placeTime}}</text>
				</view>
				<view class="logistics-information" style="margin-bottom: 0;">
					<text>退款备注:</text><text class="content remark">{{orderData.remark || ''}}</text>
				</view>
				<view class="logistics-information" style="margin-bottom: 0;"  v-if="orderData.afterSaleStatus.name == 'REFUND_CLOSED'">
					<text>关闭时间:</text><text class="content remark">{{orderData.finishTime || ''}}</text>
				</view>
			</view>
			<!-- 基础信息 -->
	<!-- 		<view class="order-information">
				<view class="order-information-title">基础信息</view>
				<view class="logistics-information">
					<text>订单编号:</text><text class="content">{{orderData.orderId || ""}}</text>
				</view>
				<view class="logistics-information">
					<text>下单时间:</text><text class="content">{{orderData.createTime || ""}}</text>
				</view>
				<view class="logistics-information">
					<text>支付方式:</text><text class="content">{{orderData.payMethod.description || ''}}</text>
				</view>
				<view class="logistics-information">
					<text>支付时间:</text><text class="content">{{orderData.payTime || ''}}</text>
				</view>
				<view class="logistics-information" style="margin-bottom: 0;">
					<text>交易单号:</text><text class="content">{{orderData.tradeNum || ''}}</text>
				</view>
			</view> -->
			<!-- 同意退货/拒绝退货 -->
			<view class="btn-group" v-if="orderData.afterSaleStatus.name == 'WAIT_HANDLE' || orderData.afterSaleStatus.name == 'RETURNED'">
				<view v-if="orderData.afterSaleStatus.name !== 'WAIT_HANDLE'">
					<button type="button" style="float: left;margin-left: 24rpx;" class="btn-normal" @click.stop="queryLogistics">查看物流</button>
					<button type="button" class="btn-primary" @click.stop="handleAgree" style="margin-right: 24rpx;">同意退款</button>
					<!--  -->
				</view>
				<view v-else>
					<view v-if="orderData.afterSaleType.name== 'REFUND'">
						<button type="button" class="btn-primary" @click.stop="handleAgree" style="margin-right: 24rpx;">同意退款</button>
						<button type="button" class="btn-normal" @click.stop="refuseSalesReturn">拒绝退款</button>
					</view>
					<view v-else>
						<button type="button" class="btn-primary" @click.stop="agreeRefund" style="margin-right: 24rpx;">同意退货</button>
						<button type="button" class="btn-normal" @click.stop="refuseReimburse">拒绝退货</button>
					</view>
				</view>
			
			</view>
			<!-- 同意与拒绝退货弹窗 -->
			<uni-popup ref="popup" type="center" :animation="false" @change="popupChange">
				<view class="popup-contont">
					<view class="popup-title-content">
						<view class="title">{{ afterSaleParam.title }}</view>
						<input v-if="afterSaleParam.inputStatus" v-model="afterSaleForm.rejectReason" class="uni-input" focus placeholder="填写拒绝原因"
							placeholder-class />
						<view class="content">{{afterSaleParam.value}}</view>
					</view>
					<view class="btn-cancel-affirm">
						<view @click="$refs.popup.close()">取消</view>
						<view class="Agree-return" @click="affirmPopup">{{ afterSaleParam.affirm }}</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
	</view>
</template>

<script>
	import {getSelectDetailp,salesReturn,salesReject,consentReimburse} from '@/utils/network/aftermarket.js'
	export default {
		data() {
			return {
				afterSaleId: '',
				afterSaleParam: {},
				afterSaleStatus: 1,
				afterSaleList: [
					{ id:1, title: '拒绝退货', affirm: '确定', inputStatus: true },
					{ id:2, title: '确认同意退货？', affirm: '同意退货', inputStatus: false, value: '同意退货后，允许买家将货物寄回，收到退回货物后，可允许退款'},
					{ id:3, title: '拒绝退款', affirm: '确定', inputStatus: true },
					{ id:4, title: '确认同意退款？', affirm: '同意退款', inputStatus: false, value: '点击"同意退款后"，款项将原路返回付款帐号，请谨慎操作，此操作不可逆!'}
				],
				addressId: '', // 地址id
				afterSaleForm: {
					afterSaleId: '', // 售后单Id
					rejectReason: '' // 拒绝原因
				},
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				orderData: {},
			}
		},
		onLoad(options) {
			const vm = this
			vm.afterSaleId = options.id
			if (options.addressId) {
				vm.addressId = options.addressId
				vm.afterSaleStatus = 2
				vm.circulation(vm.afterSaleStatus)
				vm.afterSaleId = uni.getStorageSync('AfterSaleId')
				this.$refs.popup.open()
			}
			vm.getAfterSale(vm.afterSaleId)
		},
		methods: {
			// 模态框change事件
			popupChange(e) {
				const vm = this
				if (!e.show) {
					vm.afterSaleForm.rejectReason = ''
					uni.removeStorageSync('AfterSaleId')
				}
			},
			// 获取售后详情
			getAfterSale(id) {
				const vm = this
				getSelectDetailp({afterSaleId:id}).then(res => {
					vm.orderData = res.data
				})
			},
			// 确认弹窗
			affirmPopup(){
				const vm = this
				if (vm.afterSaleParam.id === 4) {
					consentReimburse({afterSaleId: vm.orderData.afterSaleId}).then(res => {
						uni.showToast({title: "已同意退款!", icon:'none'})
						vm.$refs.popup.close()
						uni.navigateTo({ url: './AfterSale' })
					})
				}
				if (vm.afterSaleParam.id === 3) {
					salesReject(vm.afterSaleForm).then(res => {
						uni.showToast({title: "已拒绝退款!", icon:'none'})
						vm.$refs.popup.close()
						uni.navigateTo({ url: './AfterSale' })
					})
				}
				if (vm.afterSaleParam.id === 1) {
					salesReject(vm.afterSaleForm).then(res => {
						uni.showToast({title: "已拒绝退货!", icon:'none'})
						vm.$refs.popup.close()
						uni.navigateTo({ url: './AfterSale' })
					})
				}
				if (vm.afterSaleParam.id === 2) {
					salesReturn({
						afterSaleId: vm.orderData.afterSaleId,
						addressId: vm.addressId
					}).then(res => {
						uni.showToast({title: "已同意退货!", icon:'none'})
						vm.$refs.popup.close()
						uni.navigateTo({ url: './AfterSale' })
					})
				}
			},
			// 拒绝退款
			refuseSalesReturn() {
				const vm = this
				vm.afterSaleStatus = 3
				vm.afterSaleForm.afterSaleId = vm.orderData.afterSaleId
				vm.circulation(vm.afterSaleStatus)
				this.$refs.popup.open()
			},
			// 同意退款
			handleAgree() {
				const vm = this
				vm.afterSaleStatus = 4
				vm.circulation(vm.afterSaleStatus)
				this.$refs.popup.open()
			},
			// 拒绝退货
			refuseReimburse() {
				const vm = this
				vm.afterSaleStatus = 1
				vm.afterSaleForm.afterSaleId = vm.orderData.afterSaleId
				vm.circulation(vm.afterSaleStatus)
				this.$refs.popup.open()
			},
			//  同意退货
			agreeRefund() {
				const vm = this
				uni.setStorageSync('AfterSaleId', vm.afterSaleId)
				uni.navigateTo({
				  url: '/pages/me/myurl/myurl?orderId='+ vm.orderData.orderId
				})
			},
			// 查看物流
			queryLogistics() {
				const vm = this
				uni.navigateTo({
				  url: './logistics?waybillNumber='+ vm.orderData.waybillNumber+"&phoneNumber="+vm.orderData.shopAdrTelephone
				})
			},
			// 循环弹窗数据
			circulation(id) {
				const vm = this
				vm.afterSaleList.forEach(item => {
					if (id === item.id) {
						vm.afterSaleParam = item
						console.log("弹窗数据:",vm.afterSaleParam)
					}
				})
			},
			// 返回上一页
			clickBack() {
				uni.navigateTo({
					url:'./AfterSale'
				})
			}
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
		text-align: justify;

		// text-align-last: left;
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
		.detail-stautus{
			position: relative;
			margin-top: 24rpx;
			.detail-img{
				width: 702rpx;
				height: 140rpx;
				margin: auto;
				.imsges{
					width: 100%;
					height: 100%;
				}
			}
			.title-text{
				color: #ffffff;
				font-size: 30rpx;
				position: absolute;
				top:0;
				left: 0;
				right: 0;
				bottom: 0;
				text-align: center;
				line-height: 140rpx;
			}
		}
		
		// 商品样式
		.header-title {
			margin: 24rpx;
			background: #ffffff;
			border-radius: 16rpx;
			padding: 24rpx;

			.header-text {
				height: 40rpx;
				opacity: 1;
				font-size: 28rpx;
				font-weight: 400;
				text-align: left;
				line-height: 40rpx;
				padding-bottom: 24rpx;
				display: flex;
				justify-content: space-between;

				.pending {
					font-weight: 500;
					color: #795c98;
				}
			}

			.header-center {
				padding: 24rpx 0;
				border-top: 2rpx solid #EEEEEE;
				border-bottom: 2rpx solid #eeeeee;
				display: flex;

				.list-img {
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

					.Specification {
						height: 36rpx;
						opacity: 1;
						font-size: 26rpx;
						font-weight: 400;
						text-align: left;
						color: rgba(51, 51, 51, 0.50);
						line-height: 36rpx;
						margin: 8rpx 0;
					}

					.price-amount {
						height: 42rpx;
						opacity: 1;
						font-size: 30rpx;
						font-weight: 400;
						text-align: left;
						color: #333333;
						line-height: 42rpx;
						display: flex;
						justify-content: space-between;
					}
				}
			}

			// 商品总计-合计
			.close {
				.close-goods {
					padding-top: 24rpx;
					text-align: right;
					opacity: 1;
					font-size: 26rpx;
					font-weight: 400;
					text-align: right;
					color: #333333;
					line-height: 37rpx;

					.count {
						color: rgba(51, 51, 51, 0.50);
						padding: 0 8rpx;
					}

					.total-price {
						height: 48rpx;
						opacity: 1;
						font-size: 34rpx;
						font-weight: 500;
						font-family: PingFangSC, PingFangSC-Medium;
						text-align: right;
						color: #333333;
						line-height: 48rpx;
						padding-left: 8rpx;
					}
				}
			}
		}

		// 订单样式
		.order-information {
			margin: 0 24rpx 24rpx 24rpx;
			padding: 24rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;

			.order-information-title {
				font-size: 30rpx;
				font-weight: 400;
				height: 42rpx;
				padding-bottom: 24rpx;
			}

			.logistics-information {
				font-size: 26rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 0.50);
				display: flex;
				margin-bottom: 24rpx;

				.content {
					color: #333333;
					margin-left: 56rpx;
				}

				.name {
					color: #333333;
					margin-left: 82rpx;
				}

				.remark {
					width: 487rpx;
					height: 74rpx;
					opacity: 1;
					text-align: left;
					line-height: 37rpx;
					overflow: hidden;
					// text-align: justify;
					// text-align-last: left;
				}
			}
		}

		// 按钮样式
		.btn-group {
			width: 100%;
			position: fixed;
			bottom: 0;
			padding: 18rpx 0;
			border-top: 2rpx solid #eeeeee;
			background-color: #ffff;
			overflow: hidden;

			button {
				float: right;
				padding: 11rpx 24rpx;
				border-radius: 60rpx;
				font-size: 30rpx;
				color: #fff;
				line-height: 42rpx;
				margin-left: 16rpx;
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

		// 弹窗样式
		.popup-contont {
			width: 540rpx;
			background: #ffffff;
			border-radius: 16rpx;

			.popup-title-content {
				padding: 48rpx;
				// text-align: center;

				.uni-input {
					height: 52rpx;
					margin-top: 24rpx;
					background: #f9f9f9;
					border-radius: 8rpx;
					padding-left: 16rpx;
					/deep/ .input-placeholder {
						text-align: left;
						
						color: rgba(51, 51, 51, 0.50);
						font-size: 26rpx;
						font-weight: 400;
					}
				}

				.title {
					height: 48rpx;
					opacity: 1;
					font-size: 34rpx;
					font-weight: 500;
					text-align: center;
					color: #333333;
					line-height: 48rpx;
				}

				.content {
					margin-top: 8rpx;
					opacity: 1;
					font-size: 26rpx;
					font-weight: 400;
					text-align: center;
					color: #333333;
					line-height: 37rpx;
					text-align: justify;
					text-align-last: center;
				}
			}

			.btn-cancel-affirm {
				height: 86rpx;
				border-top: 2rpx solid #eeee;
				display: flex;
				align-items: center;

				view {
					width: 50%;
					text-align: center;
					font-size: 34rpx;
					color: #333333;
				}

				.Agree-return {
					height: 84rpx;
					border-left: 2rpx solid #eeee;
					line-height: 84rpx;
					font-weight: 500;
					color: #795c98;
				}
			}
		}
	}
</style>
