<template>
	<view class="container">
		<!-- 导航 -->
		<uni-nav-bar fixed statusBar>
		  <view slot="left" class="detail">
				<view class="iconfont icon" @click="goBack">&#xe618;</view>
				<view class="txt" @click="clickLeft">{{leftText}}</view>
			</view>
			<view slot="default" class="title">我的收藏</view>
		</uni-nav-bar>
		<!-- 底部 -->
		<view class="bottom-botton" v-if="activeIndex === 2">
			<view class="checkAll">
				<checkbox-group @change="selectAll">
					<label>
							<checkbox value="all" :checked="allChecked?true:false"></checkbox> 全选
					</label>
				</checkbox-group>
			</view>
			<view class="bottom-delete" @click="deleteList">删除</view>
		</view>
		<!-- tabs -->
		<view class="tabs">
			<mzy-tabs class="tabs-mzy" :list="list" v-model="active" grow gutter="12" paddingX="300" activeColor="#795C98" fontSize="15" height="43" :slider="sliders" @change="handleChange"/>
		</view>
		<!-- 商品&档口 -->
		<view class="mian">
			<!-- 商品 -->
			<checkbox-group @change="changeGoods" v-if="active === 0">
					<uni-swipe-action>
						<uni-swipe-action-item class="goods-main"  v-for="(item,index) in collectData" :key="item.goodsId" :show="isOpened" :auto-close="false" :right-options="options" :disabled="activeIndex === 2" @click="swipeAction(item.goodsId,index)">
							<view class="goods-list" @click="goGoods(item.goodsId)">
									<checkbox  class="check-box" :value="String(item.goodsId)" :checked="item.checked" @click.stop="handleGoods(item.goodsId)" v-if="activeIndex === 2"></checkbox>
									<view class="goods-img">
										<image :src="imgObs + item.fileUrl" mode="aspectFill"></image>
									</view>
									<view class="goods-name">
										<view class="goods-txt">{{item.name}}</view>
										<view class="goods-price bold">￥{{item.tradePrice}}</view>
									</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
			</checkbox-group>
			<!-- 档口 -->
			<checkbox-group @change="changeStall" v-if="active === 1">
					<uni-swipe-action>
						<uni-swipe-action-item class="goods-main"  v-for="(item,index) in collectDataSup" :key="item.suppId" :show="isOpened" :auto-close="false" :right-options="options" :disabled="activeIndex === 2" @click="swipeActionStall(item.suppId,index)">
							<view class="goods-list" @click="goStall(item.suppId)">
									<checkbox  class="check-box" :value="String(item.suppId)" :checked="item.checked" @click.stop="handleStall(item.suppId)" v-if="activeIndex === 2"></checkbox>
									<view class="stall-img" style="border: 1px solid rgba(51,51,51,0.26);">
										<image src="@/static/stall-logo.png" mode="aspectFill"></image>
									</view>
									<view class="goods-name">
										<view class="stall-txt">{{item.fullName}}</view>
										<view class="stall-add"><text class="iconfont" style="margin-right: 19rpx;">&#xe623;</text>{{item.fullAddress}}</view>
									</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
			</checkbox-group>
			<!--  -->
			<view>
				<uni-load-more :status="loadingType" iconType="auto" v-if="current > 1"></uni-load-more>
			</view>
		</view>
		<nodata :noText="noDataText" v-if="!collectData.length && active === 0"/>
		<nodata :noText="noDataText" v-if="!collectDataSup.length && active === 1"/>
	</view>
</template>

<script>
	import { getCollectSku, collectSku, getCollectSupplier, collectSupplier } from '@/utils/network/api.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {	
				isOpened:'',
				noDataText: '暂无收藏~',
				allChecked:false,
				leftText:"编辑",
				activeIndex:1,
				list: ['商品收藏','档口收藏'],
				sliders:{width:"auto",height:2,round:true},
				active:0,
			  isLoadMore:false,
				loadingType: 'loading', //加载更多状态
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				pageNum:1, // 当前页数
				pageSize:10, // 当前页的数量
				current:0, // 收藏总页数
				options:[{ text: '删除',style: { backgroundColor: '#ED2648', height:"150rpx" }}],
				collectData:[], // 收藏商品
				collectDataSup:[], // 收藏档口
				idList:[], // 被删除的商品id
				stallList:[] // 被删除的档口id
			}
		},
		// 动态设置标题
		onLoad (options) {
		  // wx.setNavigationBarTitle({title:"设置页面标题"})
			this.getCollectList()
		},
		// 触底刷新
		onReachBottom(){
			const that = this
			if(that.active === 0){
				// 收藏商品列表
				if(that.pageNum < that.current){
					that.pageNum++
					getCollectSku({ pageNum: that.pageNum, pageSize: that.pageSize }).then(res => {
						that.loadingType = 'loading'
						that.current = res.data.pages
						that.collectData=[...this.collectData,...res.data.records]
					})
				}else{
					this.loadingType = 'nomore'
					return
				}
			}else{
				// 收藏档口列表
				if(that.pageNum < that.current){
					that.pageNum++
					getCollectSupplier({ pageNum: that.pageNum, pageSize: that.pageSize }).then(res => {
						that.loadingType = 'loading'
						that.current = res.data.pages
						that.collectDataSup=[...this.collectDataSup,...res.data.records]
					})
				}else{
					this.loadingType = 'nomore'
					return
				}
			}
		},
		methods:{
			goBack(){
				uni.navigateBack({})
			},
			// 点击编辑&完成
			clickLeft(){
				const that = this
				that.allChecked = false
				that.idList = []
				that.stallList = []
				if(that.activeIndex === 1){
					//点击编辑
					that.activeIndex=2
					that.leftText = "完成"
					that.isOpened = 'none'
				}else{
					//点击完成
					that.activeIndex=1
					that.leftText = "编辑"
					that.isOpened = ''
					// 清空已经勾选
					if(that.active === 0){
						that.collectData.forEach(t => {
							if(t.checked){
								delete t.checked
							}
						})
					}else{
						that.collectDataSup.forEach(t => {
							if(t.checked){
								delete t.checked
							}
						})
					}
				}
			},
			// Tab选项卡
			handleChange(index,tab){
				const that = this
				that.active = index
				that.current = 0
				that.pageNum = 1
				that.allChecked = false
				if(that.active === 0){
					this.getCollectList()
				}else{
					this.getCollectSup()
				}
			},
			// 获取收藏商品列表
			getCollectList() {
				wx.showLoading({
					title: '加载中',
					mask: true
				})
				const vm = this
				getCollectSku({ pageNum: vm.pageNum, pageSize: vm.pageSize }).then(res => {
					vm.current = res.data.pages
					vm.collectData = res.data.records
				})
				setTimeout(function () {wx.hideLoading();}, 500);
			},
			// 获取收藏档口列表
			getCollectSup(){
				wx.showLoading({
					title: '加载中',
					mask: true
				})
				const vm = this
				getCollectSupplier({ pageNum: vm.pageNum, pageSize: vm.pageSize }).then(res => {
					vm.current = res.data.pages
					vm.collectDataSup = res.data.records
				})
				setTimeout(function () {wx.hideLoading();}, 500);
			},
			// 全选
			selectAll(e){
				const that = this
				that.allChecked = true
				const check = e.detail.value.length === 0 ? false : true
				if(that.active === 0){
					// 商品
					that.collectData.map(s => {
						return that.$set(s, 'checked', check)
					})
					that.checkGoods()
				}else{
					// 档口
					that.collectDataSup.map(s => {
						return that.$set(s, 'checked', check)
					})
					that.checkStall()
				}
			},
			// 当前选中的商品id
			checkGoods(){
				const that = this
				const checkId = []
				that.collectData.forEach(t => {
					if(t.checked){
						checkId.push(t.goodsId)
					}
				})
				// const arr = checkId.map(item => item).join(',')
				that.idList = checkId
				// console.log("当前选中的商品id:",that.idList)
			},
			// 选择商品
			changeGoods(e){
				const vm = this
				vm.idList = e.detail.value
			},
			handleGoods(id){
				const that = this
				let num = 0, len = 0
				const check = that.idList.includes(id)
				that.collectData.forEach(s => {
					if(s.goodsId === id){
						that.$set(s,'checked',check)
						len = that.collectData.length
						const checkNum = that.collectData.filter(d => d.checked)
						if(len === checkNum.length){
							that.allChecked = true
						}else{
							that.allChecked = false
						}
					}
				})
				// console.log("选择商品:",that.collectData)
				that.checkGoods()
			},
			// 当前选中的档口id
			checkStall(){
				const that = this
				const checkId = []
				that.collectDataSup.forEach(t => {
					if(t.checked){
						checkId.push(t.suppId)
					}
				})
				that.stallList = checkId
				// console.log("当前选中的档口id:",that.stallList)
			},
			// 选择档口
			changeStall(e){
				const vm = this
				vm.stallList = e.detail.value
			},
			handleStall(id){
				const that = this
				let num = 0, len = 0
				const check = that.stallList.includes(id)
				that.collectDataSup.forEach(s => {
					if(s.suppId === id){
						that.$set(s,'checked',check)
						len = that.collectDataSup.length
						const checkNum = that.collectDataSup.filter(d => d.checked)
						if(len === checkNum.length){
							that.allChecked = true
						}else{
							that.allChecked = false
						}
					}
				})
				// console.log("选择档口:",that.collectDataSup)
				that.checkStall()
			},
			// 滑动删除商品
			swipeAction(id, index) {
				const vm = this
				collectSku({ goodsId: id }).then(res => {
					uni.showToast({title: "删除成功!", icon:'none'})
					// vm.collectData.splice(index, 1)
					vm.getCollectList()
				})
			},
			// 滑动删除档口
			swipeActionStall(id, index) {
				const vm = this
				collectSupplier({ suppId: id }).then(res => {
					uni.showToast({title: "删除成功!", icon:'none'})
					// vm.collectData.splice(index, 1)
					vm.getCollectSup()
				})
			},
			// 底部批量删除
			deleteList(){
				const that = this
				if(that.active === 0){
					if(that.idList.length){
						collectSku({goodsIdList:that.idList}).then(res => {
							uni.showToast({title: "删除成功!", icon:'none'})
							that.getCollectList()
						})
					}else{
						uni.showToast({title: "请选择商品!", icon:'none'})
					}
				}else{
					if(that.stallList.length){
						collectSupplier({suppIdList:that.stallList}).then(res => {
							uni.showToast({title: "删除成功!", icon:'none'})
							that.getCollectSup()
						})
					}else{
						uni.showToast({title: "请选择档口!", icon:'none'})
					}
				}
			},
			// 跳商品详情
			goGoods(id) {
				uni.navigateTo({
				    url: '/pages/classify/classList?id='+id
				})
			},
			// 跳档口详情
			goStall(id) {
				uni.navigateTo({
				    url: '/pages/home/stallDetail/stallDetail?id='+id
				})
			},		
		}
	}
</script>

<style lang="scss" scoped>
	.container /deep/ .uni-nav-bar-text{
		padding-left: 12rpx;
	}
	.container /deep/.uni-navbar--border{
		border: none;
	}
	.container /deep/.uni-swipe_button{
		margin: 12rpx 0;
	}
	checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked{
	  width: 32rpx;
	  height: 32rpx;
	  background:#795C98;
	  border: 2rpx solid #795C98;
	  border-radius: 50%;
	  color: #FFFFFF;
	 }
	 checkbox /deep/ .wx-checkbox-input{
	  width: 32rpx;
	  height: 32rpx;
	  border: 2rpx solid #ccc;
	  border-radius: 50%;
	  margin-bottom: 10rpx;
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
	.container{
		background: #f9f9f9;
		height: 100vh;
		.detail{
			display: flex;
			.icon{
				// background: #ccc;
				font-size: 48rpx;
				padding-right: 24rpx;
				line-height: 48rpx;
			}
			.txt{
				font-size: 34rpx;
				line-height: 48rpx;
			}
		}

		.title{
		  position: relative;
		  margin: 0 auto;
			right: 14rpx;
		  text-align: center;
		  font-weight: 500;
			font-size: 34rpx;
		  }
		.bottom-botton{
			position: fixed;
			z-index: 999;
			bottom: var(--window-bottom);
			background: #fff;
			display: flex;
			width: 100%;
			.checkAll{
			  line-height: 110rpx;
			  padding-left: 38rpx;
			}
			.bottom-delete{
				position: absolute;
				right: 48rpx;
				top:24rpx;
				padding: 11rpx 24rpx;
				font-size: 30rpx;
				line-height: 42rpx;
				background: #795C98;
				color: white;
				border-radius: 32rpx;
			}
		}
		.tabs{
			width: 100%;
			position: fixed;
			z-index: 999;
			background: #fff;
			box-shadow: 0 3px 10px -5px #ccc inset;
		}
		.mian{
			padding: 96rpx 24rpx 134rpx 24rpx;
			background: #f9f9f9;
			.goods-list{
				display: flex;
				background: #fff;
				border-radius: 16rpx;
				padding: 24rpx 24rpx 24rpx 16rpx;
				margin: 12rpx 0;
				.check-box{
					line-height: 150rpx;
					padding-right: 12rpx;
					display: flex;
					justify-content: center;
				}
				.goods-img{
					width: 150rpx;
					height: 150rpx;
					background: radial-gradient(rgba(255,255,255,0.50), rgba(202,202,202,0.50));
					border-radius: 8rpx;
					image{
						display: block;
						width: 100%;
						height: 100%;
						border-radius: 8rpx;
					}
				}
				.stall-img{
					width: 128rpx;
					height: 128rpx;
					background: radial-gradient(rgba(255,255,255,0.50), rgba(202,202,202,0.50));
					border-radius: 5rpx;
					image{
						display: block;
						width: 100%;
						height: 100%;
						border-radius: 5rpx;
					}
				}
				.goods-name{
					width: 65%;
					position: relative;
					padding-left: 24rpx;
					font-size: 30rpx;
					.goods-txt{
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
					.goods-price{
						position: absolute;
						bottom: 0;
						line-height: 42rpx;
						font-weight: 500;
					}
					.stall-txt{
						margin: 16rpx 0 24rpx 0;
						line-height: 37rpx;
						font-size: 26rpx;
						font-weight: 500;
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
					.stall-add{
						font-size: 24rpx;
						line-height: 33rpx;
						color: rgba(51,51,51,0.5);
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
	}
</style>