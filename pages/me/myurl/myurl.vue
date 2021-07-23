<template>
	<view class="myurl-contion">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar>
		   <view slot="left">
				<view class="search">
					<view class="iconfont" @click="back">&#xe618;</view>
					<text style="font-size: 34rpx;">添加地址</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="main">
		<view class="myurl-wap">
			<view class="myurl-main" v-for="(item, index) in urlData" :key="index"  :class="(index + 1) % urlData.length == 0 ?'altve':''">
				<view @click.stop="checkeds(item,item.consId)">
					<view class="myurl-name-phone">
						<span style="margin-right: 8rpx;">{{item.name || ''}}</span>
						<span>{{item.phone || ''}}</span>
					</view>
					<view class="myurl-default-url">
						<view>
							<span class="myurl-default" v-if="item.isDefault === 1 ? true : false">默认</span>
							<span>{{item.fullAddress}}</span>
						</view>
						<view>
							<span class="iconfont" @click.stop="editAddress(item.consId)">&#xe62d;</span>
						</view>
					</view>
				</view>
				<!-- 默认地址 -->
				<view class="myurl-selectar-url">
					<view style="display: flex;">
						<radio-group @change="radioChange">
							<radio color="#795C98" :checked="current === item.consId" :value="item.consId"/></label>
						</radio-group>
						<!-- <evan-checkbox v-model="checked[index]" primary-color="#ED2648" @change="evanCheckbox(item)"></evan-checkbox> -->
						<span class="default-url">默认地址</span>
					</view>
					<view class="myurl-delete" @click="deleteUrl(item.consId,index)">删除</view>
				</view>
			</view>
			<view class="addWx" @click="getAddress">
				<view class="wx-box">
					<view class="iconfont icon">&#xe620;</view>
					<view class="txt">获取微信收货地址</view>
					<view class="iconfont right">&#xe61a;</view>
				</view>
			</view>
		</view>
		</view>
		<!-- 提示删除弹窗 -->
		<uni-popup ref="deletUrl" type="dialog">
		    <uni-popup-dialog type="info" title="删除地址" content="是否删除该地址？" :duration="2000" :before-close="true" @close="$refs.deletUrl.close()" @confirm="ConfirmUrl"></uni-popup-dialog>
		</uni-popup>
		<!-- 按钮 -->
		<view class="collect-btn">
			  <button type="warn" @click="showInterstitialAd">添 加</button>
		</view>
	</view>
</template>

<script>
	import { getMyUrl, setDefault, deleteAddress, addAddressByWord } from '@/utils/network/api.js'
	export default {
		data() {
			return {
				afterSaleId: '', // 售后跳页面选地址使用，售后单ID
				afterSaleOrderId: '', // 售后详情跳页面选地址使用，售后订单ID
				consindex:'', // 当前下标
				consId:'', // 收货人id
				current: '',
				value:[],
				checked:[],
				urlData:[],
				orderTz:'',
				consName:'', // 收货人姓名
				consPhone:'', // 收货人电话
				provinceName:'', // 省
				cityName:'', // 市
				areaName:'', // 区
				address:'', // 详细地址
			};
		},
		onShow(options) {
			this.getmyurl()
		},
		onLoad(options) {
			this.orderTz = options.orderTz
			this.afterSaleId = options.afterSaleId || ''
			this.afterSaleOrderId = options.orderId || ''
		},
		methods:{
			getAddress(){
				const that = this
				wx.chooseAddress({
				  success (res) {
						const params = {
							consName :res.userName, // 收货人姓名
							consPhone:res.telNumber, // 收货人电话
							provinceName:res.provinceName, // 省
							cityName:res.cityName, // 市
							areaName:res.countyName, // 区
							address:res.detailInfo, // 详细地址
						}
						addAddressByWord(params).then(res => {
							// that.getmyurl()
						})
				  }
				})
			},
			// 删除
			deleteUrl(id,index) {
				this.consId = id
				this.consindex = index
				this.$refs.deletUrl.open()
			},
			// 确认删除
			ConfirmUrl() {
				deleteAddress({ consId: this.consId }).then(res => {
					 uni.showToast({title: "删除地址成功!", icon:'none'})
					 this.$refs.deletUrl.close()
					 this.urlData.splice(this.consindex, 1)
				})
			},
			// 获取我的地址
			getmyurl() {
				wx.showLoading({
					title: '加载中',
					mask: true
				})
				getMyUrl().then(res => {
					this.urlData = res.data 
					// 回显默认地址
					this.urlData.forEach((item, index) => {
						if (item.isDefault === 1){
							this.current = item.consId;
						}
					})
				})
				setTimeout(function () {wx.hideLoading();}, 500);
			},
			// 多选框
			evanCheckbox(val) {
				console.log("多选",val)
			},
			// 编辑地址
			editAddress(id) {
				uni.navigateTo({
					  url: './addurl?id='+id
				})
			},
			// 返回上一页
			back(){
				uni.navigateBack({})
			},
			// 添加地址
			showInterstitialAd() {
				uni.navigateTo({
					   url: './addurl'
				})
			},
			//点击选择地址跳转到下单页面
			checkeds(index,id){
				const vm = this
				if(this.orderTz){
					uni.setStorageSync('evt_key',index);
					wx.redirectTo({
						   url: '/pages/order/sureOrder?active=1'
					})
					// return false
				}
				if(vm.afterSaleId) { // 跳售后列表
					uni.navigateTo({
					  url: '/pages/me/markets/after_sale/AfterSale?addressId='+ id
					})
				}
				if (vm.afterSaleOrderId) { // 跳售后详情
					uni.navigateTo({
					  url: '/pages/me/markets/after_sale/afterSaleDetail?addressId='+ id
					})
				}
			},
			radioChange(val) {
				const { value } = val.detail
				this.current = value
				setDefault({ consId: value }).then(res => {
					 uni.showToast({title: "设置默认地址成功!", icon:'none'})
					 this.getmyurl()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	// 公共样式
.myurl-contion {
	height: 100vh;
	background-color: #f9f9f9;
	box-shadow: 0px 2rpx 8rpx -2rpx rgba(0,0,0,0.10) inset;
	font-size: 30rpx;
	font-family: PingFangSC, PingFangSC-Regular;
	.main{
		height: calc( 100vh - 353rpx);
		overflow-x: hidden;
			.myurl-wap{
      
			}
	}
	.myurl-main{
		padding: 24rpx;
		margin:24rpx 24rpx 0 24rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		.myurl-default-url{
			display: flex;
			justify-content: space-between;
			line-height: 37rpx;
			padding: 0rpx 0 24rpx 0;
			border-bottom: 1rpx solid #eeeeee;
			.myurl-default{
				margin-right: 8rpx;
				font-size: 22rpx;
				font-weight: 400;
				text-align: left;
				color: #333333;
				background: #eeeeee;
				padding: 0 8rpx;
				border-radius: 4rpx;
			}
		}
		.myurl-selectar-url{
			display: flex;
			justify-content: space-between;
			padding-top: 24rpx;
			.default-url{
				margin-left: 16rpx;
			}
			.myurl-delete{
				font-size: 26rpx;
				font-weight: 400;
				color: #ed2648;
			}
		}
	}
	.addWx{
		padding: 24rpx 24rpx 24rpx 24rpx;
		.wx-box{
			display: flex;
			position: relative;
			padding: 24rpx;
			background: #ffffff;
			border-radius: 16rpx;
			.icon{
				line-height: 48rpx;
				font-size: 48rpx;
				color: rgb(72, 189, 28);
			}
			.txt{
				font-size: 34rpx;
				line-height: 48rpx;
				padding-left: 16rpx;
			}
			.right{
				position: absolute;
				right: 12rpx;
				color: #CCCCCC;
				font-size: 48rpx;
				line-height: 48rpx;
			}
		}
	}
	.altve{
		// margin-bottom: 0 !important;
	}
	// 按钮样式
	.collect-btn{
		width: 100%;
		position:fixed;;
		bottom: 70rpx;
		button{
			width: 702rpx;
			height: 112rpx;
			line-height: 112rpx;
			background: #795C98;
		}
	}
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
