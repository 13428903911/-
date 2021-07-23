<template>
	<view class="contont">
		<view class="sales-icket">
			<view class="market">
				<view class="work bold">待办事项</view>
				<view class="order-box" @click="jump('/pages/me/markets/sales_ticket/SalesTicket') ">
					<span class="order">销售单管理</span>
					<i class="iconfont">&#xe653;</i>
				</view>
			</view>
			<!-- 待发货/待提货/售后 -->
			<view class="Overhang" style="justify-content: space-between;padding: 18rpx 26rpx 0 40rpx;text-align: center;">
				<view @click="jump('/pages/me/markets/sales_ticket/SalesTicket?index='+2)" style="position: relative;">
					<uni-badge class="uni-badge-left-margin button" v-if="waitShipCount>0" :class="{ small: waitShipCount > 9 }" :text="waitShipCount" type="error" />
					<view class="round">
						<view class="iconfont" style="text-align: center;">&#xe64c;</view>
					</view>
					<view class="name shipments">待发货</view>
				</view>
				<view @click="jump('/pages/me/markets/sales_ticket/SalesTicket?index='+4)" style="position: relative;">
					<uni-badge class="uni-badge-left-margin button" v-if="shipped>0" :text="shipped" type="error" />
					<view class="round">
						<view class="iconfont" style="text-align: center;">&#xe646;</view>
					</view>
					<view class="name shipments">待提货</view>
				</view>
				<view @click="jump('/pages/me/markets/after_sale/AfterSale?index='+0)" style="position: relative;">
					<uni-badge class="uni-badge-left-margin button" v-if="finished>0" :text="finished" type="error" />
					<view class="round">
						<view class="iconfont" style="text-align: center;">&#xe64b;</view>
					</view>
					<view class="name shipments">售后</view>
				</view>
			</view>
		</view>
		<!-- 统计数据 -->
		<view class="sales-icket" style="box-shadow:none;">
			<view class="market">
				<view class="work bold">统计数据</view>
				<view class="order-box" @click="toggle('bottom')">
					<span class="order">{{today}}</span>
					<i class="iconfont">&#xe653;</i>
				</view>
			</view>
			<!-- 收入金额/订单数/云店访客 -->
			<view class="Overhang" style="justify-content: space-between;padding: 18rpx 24rpx 0 22rpx;">
				<view class="revenue">
					<view class="num">￥{{statisticalData.orderTotalMoney}}</view>
					<view class="shuju names">收入金额</view>
				</view>
				<view class="revenue">
					<view class="num">{{statisticalData.orderTotalCount}}</view>
					<view class="shuju names">订单数</view>
				</view>
				<view class="revenue">
					<view class="num">{{statisticalData.stallVisitorsCount}}</view>
					<view class="shuju names">云店访客</view>
				</view>
			</view>
		</view>
		<!-- 我的销售、上架 -->
		<view class="Overhangs">
			<view class="shelves" @click="jump('/pages/me/markets/goods/goods')">
				<view class="iconfont">&#xe64d;</view>
				<view class="shelves-x">销售中</view>
				<view class="shelves-num">{{statisticalData.groundingNum}}</view>
			</view>
			<view class="shelves" @click="jump('/pages/me/markets/goods/goods?id='+2)">
				<view class="iconfont">&#xe64a;</view>
				<view class="shelves-x">待上架</view>
				<view class="shelves-num">{{statisticalData.undercarriageNum}}</view>
			</view>
		</view>
		<!-- 我的商品 -->
		<view class="sales-icket" style="box-shadow:none">
			<view class="market" style="padding-bottom: 0rpx;border-bottom: none" @click="jump('/pages/me/markets/goods/AddGoods')">
				<view class="work">新增商品</view>
				<view class="order-box">
					<span class="order">点击立即添加</span>
					<i class="iconfont">&#xe653;</i>
				</view>
			</view>
		</view>
		<!-- 评论管理 -->
<!-- 		<view class="sales-icket" style="box-shadow:none" @click="jump('/pages/me/myrating/myrating')">
			<view class="market" style="padding-bottom: 0rpx;border-bottom: none">
				<view class="work">评论管理</view>
				<view class="order-box">
					<uni-icons type="arrowright" size="16" color="rgba(51,51,51,0.50);"></uni-icons>
				</view>
			</view>
		</view> -->
		<!-- 我的设置 -->
		<view class="sales-icket" style="box-shadow:none">
			<view class="market" style="padding-bottom: 0rpx;border-bottom: none" @click="jump('/pages/me/setup/setup')">
				<view class="work">我的设置</view>
				<view class="order-box">
					<i class="iconfont">&#xe653;</i>
				</view>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<uni-popup ref="popup"  type="bottom" border-radius="16rpx" @change="change"  @touchmove.stop.prevent="moveHandle">
		 <view class="modal">
			<view class="modal-date" v-for="(item,index) in list" :key="index" @click="handlePopup(index,item.title,item.code)">
			 {{item.title}}
			</view>
			<view class="line"></view>
			<view class="modal-cancel" @click="close">取消</view>
		 </view>
		</uni-popup>
	</view>
</template>

<script>
	import {getStatistics} from '@/utils/network/aftermarket.js'
	export default{
		data(){
			return{
				formData: {
					period:'', // 时间类型不传默认TODAY今天
					statisticsType: ''
				},
				statisticalData: { // 统计数据 
					waitShipCount: 0,
	        shipped: 0,
	        finished: 0,
	        orderTotalMoney: 0,
	        orderTotalCount: 0,
	        groundingNum: 0,
	        undercarriageNum: 0,
					stallVisitorsCount:0,
				},
				waitShipCount: '',
				shipped: '',
				finished: '',
				today: '今日',
				list: [
					{ code:"MONTH", title: '本月' }, { code:"WEEK", title: '本周'  }, {code:"RECENT7DAYS", title: '近7天' }, 
					{ code:"DAY_BEFORE_YESTERDAY", title: '前天' }, { code:"YESTERDAY", title: '昨天' }, { code:"TODAY", title: '今日' }]
			}
		},
		created() {
			const vm = this
			vm.getStatisticsData()
		},
		methods:{
			// 禁止弹窗蒙层滚动
			moveHandle(){ 
				return false
			},
			// 获取统计数据
			getStatisticsData() {
				const vm = this
				getStatistics(vm.formData).then(res => {
					const { data = {} } = res
					vm.waitShipCount = data.waitShipCount
					vm.shipped = data.shipped
					vm.finished = data.finished
					vm.statisticalData.orderTotalCount = data.orderTotalCount
					vm.statisticalData.waitShipCount = data.waitShipCount
					vm.statisticalData.shipped = data.shipped
					vm.statisticalData.finished = data.finished
					vm.statisticalData.orderTotalMoney = data.orderTotalMoney
					vm.statisticalData.groundingNum = data.groundingNum
					vm.statisticalData.undercarriageNum = data.undercarriageNum
					vm.statisticalData.stallVisitorsCount = data.stallVisitorsCount
				})
			},
			// 跳页面方法
			jump(path) {
				const vm = this
				uni.navigateTo({
					 url: path
				})
			},
			 // 点击弹窗里面的内容触发的事件
			 handlePopup(val,item,code) {
				uni.showTabBar()
				const vm = this
				vm.today = item
				vm.formData.period = code
				vm.getStatisticsData()
				vm.$refs.popup.close()
			 },
			 change(e){
				 if(e.show){
					uni.hideTabBar()
				 }else{
					uni.showTabBar()
				 }
				},
			 // 点击显示弹窗
			 toggle(type) {
				uni.hideTabBar()
				this.$refs.popup.open()
			 },
			 //取消按钮事件
			 close(){
				 this.$refs.popup.close();
				 uni.showTabBar()
			 },
		}
	}
</script>

<style lang="scss" scoped>
	.contont{
		font-size: 30rpx;
		// 待办事项样式
		.sales-icket{
			margin-bottom: 24rpx;
			padding: 27rpx 32rpx 32rpx 32rpx;
			opacity: 1;
			background: #ffffff;
			border-radius: 16rpx;
			box-shadow: 0rpx 28rpx 40rpx -20rpx rgba(121,92,152,0.18); 
			.market{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.work{
					height: 52rpx;
					opacity: 1;
					text-align: left;
					color: #333333;
					line-height: 52rpx;
				}
				.order-box{
					display: flex;
					align-items: center;
					.order{
						padding-top: 3rpx;
						font-size: 24rpx;
						text-align: right;
						color: rgba(0,0,0,0.24);
						line-height: 32rpx;
					}
					.iconfont{
						font-size: 40rpx;
						color: rgba(0,0,0,0.24);
					}
				}
			}
			// 待提货、发货、售后
			.Overhang{
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding-top: 18rpx;
				.round{
					width: 72rpx;
					height: 72rpx;
					line-height: 72rpx;
					background: #f9f9f9;
					border-radius: 50%;
					.iconfont{
						font-size: 40rpx;
					}
				}
				.revenue{
					font-weight: 400;
					text-align: center;
					position: relative;
				}
				.icon-add{
					width: 64rpx;
					height: 64rpx;
					opacity: 1;
					background: #f9f9f9;
					border: 1rpx solid #eeeeee;
					border-radius: 5rpx;
					margin: auto;
					.iconfont{
						line-height: 64rpx;
						text-align: center;
						font-size: 48rpx;
						color: #D2D2D2;
					}
				}
				.add-name{
					font-size: 24rpx;
					font-weight: 400;
					text-align: center;
					color: #333333;
					line-height: 33rpx;
				}
				.name{
					padding-top: 16rpx;
				}
				.shipments{
					font-size: 24rpx;
					font-weight: 400;
				}
				.button{
					width: 32rpx;
					height: 32rpx;
					line-height: 32rpx;
					background: #ed2648;
					border-radius: 18rpx;
					position: absolute;
					text-align: center;
					left: 60rpx;
					top: 0rpx;
					font-size: 20rpx;
					color: #FFFFFF;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: "!!!"
				}
			}
		}
	}
	.shuju{
		text-align: center;
		font-size: 24rpx;
		color: rgba(0,0,0,0.40);
	}
	.names{
		margin-top: 8rpx;
	}
	.num{
		font-size: 30rpx;
		font-family: PingFangSC, PingFangSC-Medium;
		font-weight: 500;
	}
	// 销售中、待上架样式
	.Overhangs{
		display: flex;
		margin-bottom: 24rpx;
		flex-wrap: wrap;
		justify-content: space-between;
		.shelves{
			padding: 32rpx;
			background: #fff;
			width: 341rpx;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			.iconfont{
				font-size: 40rpx;
			}
			.shelves-x{
				margin-left: 16rpx;
				font-size: 26rpx;
			}
			.shelves-num{
				margin-left: 24rpx;
				font-size: 30rpx;
				font-family: PingFangSC, PingFangSC-Medium;
				font-weight: 500;
			}
		}
	}
	// 模态框样式
	.modal{
	  border-radius: 16rpx 16rpx 0rpx 0rpx;
	  background: #FFFFFF;
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
	  .modal-date{
	   text-align: center;
	   padding: 32rpx;
	   font-size: 36rpx;
	   border-bottom: 1rpx solid #eee;
	  }
	  .line{
	   width: 750rpx;
	   height: 16rpx;
	   opacity: 1;
	   background: #f5f5f5;
	  }
	  .modal-cancel{
	   text-align: center;
	   padding: 32rpx;
	   font-size: 36rpx;
		 color: #795C98;
	  }
	 }
	 .small{
		 font-size: 24rpx;
	 }
	 // /deep/ .uni-popup__wrapper-box.data-v-7c43d41b {
		// padding-bottom: constant(safe-area-inset-bottom)!important;
	 //   padding: none !important;
	 //  }
</style>
