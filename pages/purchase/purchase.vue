<template>
	<view class="container">
		<!-- <uni-nav-bar fixed statusBar backgroundColor="#795C98" color="#fff">
		  <view slot="left" class="detail"  @click="clickLeft" v-if="dataList.length">{{leftText}}</view>
			<view slot="default" class="title">进货单</view>
		</uni-nav-bar> -->
		<view class="nav-bar" :style="{height:height + 'px'}">
			<view class="nav-content" :style="{top:topHeight + 'px',height:textHeight + 'px',lineHeight:textHeight + 'px'}">
				<view class="nav-left" @click="clickLeft" v-if="dataList.length">{{leftText}}</view>
				<view class="nav-center">进货单</view>
			</view>
		</view>
		<scroll-view class="scroll-view" :style="{top:srrowHeight + 'px',height:ktxWindowHeight + 'rpx'}" scroll-y="false" :scroll-top="scrollTop" scroll-with-animation="true" refresher-enabled="true" refresher-threshold="45" :refresher-triggered="triggered" @scroll="scrollChange" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
		   <!-- 空白 -->
			<nodata :noText="noDataText" v-if="dataList.length <= 0"/>
			<view class="main" v-else>
				<!-- 档口列表 -->
				<checkbox-group @change="changeStall">
					<view class="stallList" v-for="(item, index) in dataList" :key="index">
						<!-- <checkbox-group @change="changeStall($event,item.stallId)"> -->
						<view class="stallDetail">
							 <checkbox :value="String(item.stallId)" :checked="item.checked" :disabled="item.disabled" @click="handleStall(item.stallId)"></checkbox>
							 <view class="stallDetail-name" :data-id="item.stallId" @click="goStall">
								 <view class="name">{{item.stallName}}</view>
								 <view class="iconfont iconGo"> &#xe61a; </view>
							 </view>
						</view>
						<!-- 商品列表 -->
						<checkbox-group @change="changeGoods">
							<view class="goodsList" v-for="(items, indexs) in item.goodsInfos" :key="items.goodsNo">
									<!-- 左滑删除商品 -->
									<uni-swipe-action>
									 <uni-swipe-action-item :right-options="options" autoClose @click="deleteGoods(items.goodsNo, indexs)">
											 <view class="goodsDetail">
													<checkbox :value="items.goodsNo" :checked="items.checked" :disabled="items.disabled" @click="handleGoods(item.stallId, items.goodsNo)"></checkbox>
													<view class="goGoods" :data-id="items.goodsNo" @click="goGoodsDetail">
														<image :src="imgObs + items.goodsUrl" mode="aspectFill" class="goodsDetail-img"></image>
														<view class="goodsDetail-name">{{items.goodsName}}</view>
													</view>
											 </view>
										 </uni-swipe-action-item>
									 </uni-swipe-action>
									<!-- sku列表 -->
									<checkbox-group @change="changeSku">
										<view class="skuList" v-for="(itemx, nindex) in items.goodsSpecs" :key="nindex">
											<!-- 左滑删除sku -->
											<uni-swipe-action>
												<uni-swipe-action-item>
														<template v-slot:right>
															<view class="slot-button" :data-skuid="itemx.skuId" autoClose @click="deleteAtt(itemx.skuId,nindex,items.goodsNo,item.stallId)">
																<image src="../../static/delete/icon_delete.png" mode=""></image>
															</view>
														</template>
														<view class="skuList-box">
															<view class="checkbox-Att">
																<checkbox :value="itemx.skuId" :checked="itemx.checked" :disabled="items.disabled || itemx.disabled" @click="handleSku(item.stallId, items.goodsNo, itemx.skuId)"></checkbox>
															</view>
															<view class="skuList-list">
																<view class="list-left">
																	<view class="skutxt">
																		{{ itemx.colorName + '；' + itemx.sizeName + '码' }}
																	</view>
																	<view class="price"> ￥{{ itemx.price }} <text style="color: #000000;">/件</text></view>
																</view>
																<view class="number" :data-goodsno="items.goodsNo" :data-skuid="itemx.skuId"  @click.capture="clickChange">
																	<uni-number-box :disabled="items.disabled || itemx.disabled" :min="1" :max="100000" :value="itemx.amount" @blur="blurNumber($event,itemx.skuId)"  @change="bindChange"/>
																</view>
															</view>
															
														</view>
												</uni-swipe-action-item>
											</uni-swipe-action>
										</view>
									</checkbox-group>	 
							</view>
						</checkbox-group>
						<!-- </checkbox-group> -->
					</view>
				</checkbox-group>
			</view>
		</scroll-view>
		<!-- 底部 -->
		<view class="bottom" v-if="dataList.length">
			<view class="checkAll">
				<checkbox-group @change="selectAll">
					<label>
							<checkbox value="all" :checked="allChecked?true:false"></checkbox>
							<text style="padding-left: 12rpx;">全选</text>
					</label>
				</checkbox-group>
			</view>
			<view class="bottomHandle">
				<view class="bottomClaer" v-show="active===2" @click="clear">
					清空
				</view>
				<view class="bottomDelete" v-show="active===2" @click="bottomDelete">
					删除
				</view>
				<view class="bottomPrice" v-show="active===1">
					<view class="bottomPrice-one">
						总计:<span class="bold" style="color: #795C98;">￥{{allPrice}}</span>
					</view>
					<view class="bottomPrice-two">
						合计{{ allNumber }}件商品
					</view>
				</view>
				<view class="bottomPaly" v-show="active===1" @click="sureOrder">
					结算
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { cardList, cartCreate ,cartDelete , cartClean , goodsDelete} from '@/utils/network/purchase.js'
	import nodata from '@/components/no-data/no-data.vue'
	export default {
		components:{nodata},
		data() {
			return {
				topHeight:uni.getMenuButtonBoundingClientRect().top,
				textHeight:uni.getMenuButtonBoundingClientRect().height,
				height:uni.getMenuButtonBoundingClientRect().bottom + 30,
				srrowHeight:uni.getMenuButtonBoundingClientRect().bottom + 14,
				scrollTop:0,
				lastScrollY:0,
				noDataText: '暂无商品~',
				triggered:false,
				goodsItem:null,
				checkedArr:[], // 已选择档口id集合
				checkedGoods: [], // 已选择商品id集合
				checkedSku: [],
				checkedList:[], //已选择数据集合
				allChecked:false, //是否全选
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				leftText:'编辑',
				active:1,
				options:[{
					text: '删除',
					style: {
						backgroundColor: '#ED2648'
					},
				}],
				dataList:[], // 进货单列表
				amount:'', // 数量
				goodsId:'', // 商品ID
				skuId:'', // 商品sku
				allNumber:0 ,// 商品总数
				allPrice:0, //商品总价
				ktxWindowHeight:0
			};
		},
		onShow(){
			this.getHeight()
			this.$token = uni.getStorageSync('authorization')
			this.checkedArr = []
			this.allChecked = false
			this.allNumber = 0 
			this.allPrice = 0
			this.scrollTop = this.lastScrollY
			this.$nextTick(function(){
				this.scrollTop = 0;
			})
			this.getData()
		},
		methods:{
			getHeight(){
				let systemInfo = wx.getSystemInfoSync()
					// px转换到rpx的比例
					let pxToRpxScale = 750 / systemInfo.windowWidth;
					// 状态栏的高度
					let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
					// 导航栏的高度
					let navigationHeight = 44 * pxToRpxScale
					// window的宽度
					let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
					// window的高度
					let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
					// 屏幕的高度
					let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
					// 底部tabBar的高度
					let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight
					this.ktxWindowHeight = ktxWindowHeight - navigationHeight - ktxStatusHeight - this.srrowHeight/2 - 73
					// console.log(this.ktxWindowHeight)
			},
			// 刷新高度
			scrollChange (e) {
			 this.lastScrollY = e.detail.scrollTop;
			},
			// 下拉刷新
			onRefresh(){
				const that = this
				that.triggered = true
				setTimeout(() => {
						this.scrollTop = this.lastScrollY
						this.$nextTick(function(){
							this.scrollTop = 0;
						})
						that.$token = uni.getStorageSync('authorization')
						this.triggered = false;
						that.checkedArr = []
						that.allChecked = false
						that.allNumber = 0 
						that.allPrice = 0
						that.getData()
				}, 500)
			},
			onRestore(){
				this.triggered = 'restore'; // 需要重置
				this.$nextTick(function(){
					this.scrollTop = 0;
				})
			},
			
			// 全选操作
			selectAll(e) {
				const vm = this
				vm.allChecked = true
				const checke = e.detail.value.length === 0 ? false : true
				vm.dataList.map(t => {
					if(!t.disabled){
						t.goodsInfos.map(g => {
							// sku 需要判断是否可选，库存不足，disabled = true
							if(!g.disabled){
								g.goodsSpecs.map(s => {
									if(!s.disabled){
										vm.$set(s, 'checked', checke)
									}
								})
								return vm.$set(g, 'checked', checke)
							}
						})
						return vm.$set(t, 'checked', checke)
					}	
				})
				vm.getSelectList()
			},
			// 档口选择，多选框click事件
			handleStall(val) {
				const vm = this
				let num = 0, len = 0
				const check = vm.checkedArr.includes(val)
				vm.dataList.forEach(s => {
					if (s.stallId === val && !s.disabled) {
						vm.$set(s, 'checked', check)
						s.goodsInfos.map(g => {
							if(!g.disabled){
								g.goodsSpecs.map(s => {
									if(!s.disabled){
										vm.$set(s, 'checked', check)
									}
								})
								return vm.$set(g, 'checked', check)
							}
						})
						// 档口全选与反选
						// len = vm.dataList.length
						const disableNum = vm.dataList.filter(d => !d.disabled)
						const checkNum = vm.dataList.filter(d => d.checked)
						if (disableNum.length === checkNum.length) {
							vm.allChecked = true
						}else{
							vm.allChecked = false
						}
					}
				})
				vm.getSelectList()
			},
			// 档口选择，多选框change事件
			changeStall(e){
				const vm = this
				vm.checkedArr = e.detail.value
				// console.log('档口选择data:', vm.dataList)
			},
			// 选择商品
			handleGoods(stall, val) {
				const vm = this
				let num = 0, len = 0
				const check = vm.checkedGoods.includes(val)
				vm.dataList.forEach(s => {
					if (s.stallId === stall && !s.disabled) {
						s.goodsInfos.forEach(g => {
							if(!g.disabled){ //
								if (g.goodsNo === val) {
									vm.$set(g, 'checked', check)
									g.goodsSpecs.map(s => {
										if(!s.disabled){
											vm.$set(s, 'checked', check)
										}
									})
								}
							}
						})
						len = s.goodsInfos.length
						const disableNum = s.goodsInfos.filter(g => !g.disabled)
						const checkNum = s.goodsInfos.filter(g => g.checked)
						// 如果checkNum.length等于true的长度 === len 商品checked= true
						if (disableNum.length === checkNum.length) {
							vm.$set(s, 'checked', check)
						}else{
							vm.$set(s, 'checked', false)
						}
						const disableStall = vm.dataList.filter(d => !d.disabled)
						const stallNum = vm.dataList.filter(d => d.checked) // 档口选择数量
						if (stallNum.length == disableStall.length) {
							vm.allChecked = true
						}else{
							vm.allChecked = false
						}
					}
				})
				vm.getSelectList()
			},
			changeGoods(e) {
				const vm = this
				vm.checkedGoods = e.detail.value
				// console.log('商品选择data:', vm.dataList)
			},
			clearAll() {
				const vm = this
				vm.dataList.forEach(t => {
					// 清空选中商品
					t.children = []
					t.goodsInfos.forEach(j => {
						// 清空选中sku
						j.children = []
					})
				})
			},
			clearGoodsAll(id) {
				const vm = this
				vm.dataList.forEach(t => {
					if (t.stallId === id) {
						t.children = []
						t.goodsInfos.forEach(j => {
							j.children = []
						})
					}
				})
			},
			changeGoodItem(stall, goods) {
				const vm = this
				vm.dataList.forEach(t => {
					if (t.stallId === stall) {
						const check = t.children.includes(goods)
						if (check) {
							t.goodsInfos.forEach(g => {
								if (g.goodsNo === goods) {
									g.goodsSpecs.forEach(s => {
										g.children.push(s.skuId)
									})
								}
							})
						}
					}
				})
				// console.log(vm.dataList)
			},
			// 选择属性sku
			changeSku(e){
				const vm = this
				vm.checkedSku = e.detail.value
				// console.log("sku",vm.checkedSku)
			},
			// sku点击事件
			handleSku(stall, val, sku) {
				const vm = this
				let num = 0, len = 0
				const check = vm.checkedSku.includes(sku)
				vm.dataList.forEach(s => {
					if (s.stallId === stall && !s.disabled) {
						s.goodsInfos.forEach(g => {
							if (g.goodsNo === val && !g.disabled) {
								g.goodsSpecs.forEach(k => {
									if(k.skuId === sku && !k.disabled) {
										vm.$set(k, 'checked', check)
									}
									// len = g.goodsSpecs.length
									const disableSku = g.goodsSpecs.filter(j => !j.disabled)
									const checkNum = g.goodsSpecs.filter(z => z.checked)
									// console.log("sku:",g.goodsSpecs)
									// console.log("未禁用sku长度",disableSku.length)
								 //  console.log("选中sku长度",checkNum.length)
									if (disableSku.length === checkNum.length) {
										// 如果所有商品选择了，那么档口也要选中
										vm.$set(g, 'checked', check)
										const disableGoods = s.goodsInfos.filter(t => !t.disabled)
										// const goodslen = s.goodsInfos.length
										const goodsNum = s.goodsInfos.filter(y => y.checked)
										if (disableGoods.length === goodsNum.length) {
											vm.$set(s, 'checked', true)
											const disableStall = vm.dataList.filter(m => !m.disabled)
											const stallNum = vm.dataList.filter(d => d.checked) // 档口选择数量
											if (stallNum.length === disableStall.length) {
												vm.allChecked = true
											}
										}
									}else{
										vm.$set(g, 'checked', false)
										const disableGoodst = s.goodsInfos.filter(t => !t.disabled)
										// const goodslength = s.goodsInfos.length
										const goodsNums = s.goodsInfos.filter(p => !p.checked)
										// if (disableGoodst.length !== goodsNums.length) {
											vm.$set(s, 'checked', false)
										// }
										vm.allChecked = false
									}
								})
							}
						})
					}
				})
				vm.getSelectList()
			},
			// 获取当前选择项
			getSelectList() {
				const vm = this
				// 获取选中的sku列表 --> 计算总价，商品总数量
				let skuList = []
				vm.dataList.forEach(t => {
					t.goodsInfos.forEach(g => {
						g.goodsSpecs.forEach(s => {
							if (s.checked) {
								skuList.push(s)
							}
						})
					})
				})
				// console.log("获取当前选择项:",vm.dataList)
				vm.calculate(skuList)
			},
			submitGetList() {
				const vm = this
				// 遍历整个数据list
				// console.log("获取当前选择项:",skuList)
				let arr = []
				const submitList = JSON.parse(JSON.stringify(vm.dataList))
				submitList.forEach(t => {
					const skuList = []
					t.goodsInfos.forEach(g => {
						g.goodsSpecs.forEach(s => {
							if (s.checked) {
								skuList.push(s)
							}
						})
					})
					if (skuList.length) {
						arr.push(t)
					}
				})
				arr.forEach(t => {
					t.goodsInfos = t.goodsInfos.filter(g => {
						g.goodsSpecs = g.goodsSpecs.filter(s => s.checked)
						return g.goodsSpecs.length > 0
					})
				})
				return arr
			},
			// 计算总数和总价
			calculate(val){
				const that = this
				const allNumber = []
				const allPrice = []
				val.forEach(t => {
						allNumber.push(t.amount)  // 商品总数
						allPrice.push(Number(t.price) * Number(t.amount))  // 商品总价
						// console.log("计算总数和总价:",allNumber,allPrice)
				})
				let arr = allNumber.map(Number)
				that.allNumber = arr.reduce(function (sum, current) {
				 return sum + current;
			  }, 0)
				let arr2 = allPrice.map(Number)
				that.allPrice = arr2.reduce(function (sum, current) {
					return sum + current;
				}, 0)
				that.allPrice = parseFloat(that.allPrice).toFixed(2)
				// console.log("计算总数和总价:",that.allNumber,that.allPrice)
			},
			// 点击编辑&完成
			clickLeft(){
				if(this.active===1){
					//点击编辑
					this.active=2
					this.leftText = "完成"
				}else{
					//点击完成
					this.active=1
					this.leftText = "编辑"
				}
			},
			// 底部批量删除
			bottomDelete(){
				const that = this 
				const orderList = that.submitGetList()
				const skuId = []
				orderList.forEach(t => {
					t.goodsInfos.forEach(v => {
						v.goodsSpecs.forEach(s => {
						  skuId.push(s.skuId)
						})	
					})
				})
				cartDelete(skuId).then(res => {
					that.getData()
				})
			},
			// 点击 & 改变数量
			clickChange(e){
			  const that = this 
				that.goodsId = e.currentTarget.dataset.goodsno
				that.skuId = e.currentTarget.dataset.skuid
			},
			// 数字输入框失焦时触发的事件
			blurNumber(e,id) {
				const that = this
				// console.log("blur改变数量:",e.detail.value)
				if (e.detail.value == '') {
					e.detail.value = 1
					uni.showToast({
						title:"数量最少为1",
						icon:"none"
					})
				}
				// if(!e.detail.value.match(/^([1-9]\d*|0)(\.\d*[1-9])?$/)){
				// 	// uni.showToast({
				// 	// 	title:"错误",
				// 	// 	icon:"none"
				// 	// })
				// 	const str = !e.detail.value.indexOf("1",'9',1)
				// 		console.log("blur:",str)
				// }
				// this.$nextTick(() => {
				//   e.detail.value = (e.detail.value.match(/^([1-9]\d*|0)(\.\d*[1-9])?$/)||[''])[0]
				// }) 
			},
			// 数字输入框@change触发的事件
			bindChange(e){
				const that = this
				const value = parseInt(e)
				// console.log("change改变数量:",value)
				that.amount = value
				if(value < 1){
					that.amount = 1
					uni.showToast({
						title:"数量最少为1",
						icon:"none"
					})
				}
				const params = {
					amount:that.amount,
					goodsId:that.goodsId,
					skuId:that.skuId
				}
				cartCreate(params).then(res => {})
				that.dataList.forEach(t =>{
					 t.goodsInfos.forEach(s =>{
							 s.goodsSpecs.forEach(m => {
								 if(m.skuId === that.skuId){
									 // console.log("that.skuId",that.skuId)
										if (m.amount === 0 || m.amount === '') {
											m.amoun = 1
										}else{
											m.amount = that.amount
										}
								 }
							 })
					})
				})
				//that.getData()	
				that.getSelectList()
			},
			// 左滑删除商品
			deleteGoods(e, index){
				const that = this
					 goodsDelete({goodsId:e}).then(res => {
						 that.dataList.forEach(t =>{
						 	 t.goodsInfos.forEach(s =>{
						 			 if(s.goodsNo === e){
										if (t.goodsInfos.length < 1 || t.goodsInfos.length == 1) {
											 that.dataList.splice(index,1)
										}
										  t.goodsInfos.splice(index,1)
									 }
						 	})
						 })
						 that.getSelectList()
						 uni.showToast({
						   title:"删除成功",
						 	icon:"none"
						 })
						 // that.getData()
					 })
			},
			// 左滑删除属性sku
			deleteAtt(id,index,goodsNo,stallId){
				const that = this
				const skuId = [id]
				cartDelete(skuId).then(res => {
					 that.dataList.forEach((t,indext) =>{
						 t.goodsInfos.forEach((s,indexs) =>{
								s.goodsSpecs.forEach(sku => {
									if (sku.skuId == id) {
										 s.goodsSpecs.splice(index,1)
										 // 如果sku只有一条需要删除当前商品
										 if (s.goodsSpecs.length < 1) {
											  t.goodsInfos.splice(indexs,1)
												// 如果只有一条商品就删除当前档口
												if (t.goodsInfos < 1) {
													that.dataList.splice(indext,1)
												}
										 }
									}
								})
						})
					 })
					 that.getSelectList()
					 uni.showToast({
						 title:"删除成功",
						icon:"none"
					 })
										 // that.getData()
				})
			},
			// 清除购物车
			clear(){
				const that = this
				that.allChecked = false;
				cartClean().then(res =>{
					that.getData()
				})
			},
			//进货单列表
			getData(){
				if(this.$token){
					cardList().then(res=>{
						this.dataList=res.data
						// 判断档口是否可以被选中
						this.dataList.forEach(v => {
							v.goodsInfos.forEach(s => {
								if(s.deleteFlag === true || s.enableFlag === 0){
									s.disabled = true
									// const goodsNum = v.goodsInfos.filter(item => item.disabled)
									// // console.log('goodsSpecs:', v.goodsInfos.length)
									// if (goodsNum.length === v.goodsInfos.length) {
									// 	v.disabled = true
									// }else{
									// 	v.disabled = false
									// }
								}
								s.goodsSpecs.forEach(t => {
									if(t.deleteFlag === true || t.enableFlag === 0 || s.deleteFlag === true || s.enableFlag === 0){
										t.disabled = true
										const sku = s.goodsSpecs.filter(item => item.disabled)
										// console.log('sku:',sku)
										if(sku.length === s.goodsSpecs.length){
											s.disabled = true
										}else{
											s.disabled = false
										}
										// 
										const goodsNum = v.goodsInfos.filter(item => item.disabled)
										// console.log('goodsSpecs:', v.goodsInfos.length)
										if (goodsNum.length === v.goodsInfos.length) {
											v.disabled = true
										}else{
											v.disabled = false
										}
									}
								})
							})
						})
						console.log(this.dataList)
					
					}).catch(() => {
						this.isLoadMore = false
						
					})
				}	
			},
			//本地存储确认订单数据
			setStor () {
				const that = this
				const orderList = that.submitGetList()
				 uni.setStorageSync('SubmitOrders',orderList);
			},
			// 跳转档口详情
			goStall(e){
				uni.navigateTo({
				    url: '/pages/home/stallDetail/stallDetail?id='+ e.currentTarget.dataset.id
				});
			},
			// 跳转商品详情
			goGoodsDetail(e){
				// console.log("商品详情",e)
				uni.navigateTo({
				    url: '/pages/classify/classList?id=' + e.currentTarget.dataset.id
				});
			},
			// 跳转订单详情
			sureOrder(){
				const vm = this
				const orderList = vm.submitGetList()
				if(orderList.length > 0){
					this.setStor()
					uni.navigateTo({
					    url: '/pages/order/sureOrder'
					})
				}else{
					uni.showToast({
					  title:"请选择商品" ,
						icon:"none"
					})
				}	
			}	
		}
	}
</script>

<style lang="scss" scoped>
   .container /deep/ .uni-navbar__header{width:100%;font-size: 34rpx;position: relative;z-index: 1;}
	 .container /deep/ .uni-numbox--text{font-size: 40rpx;line-height: 40rpx;margin-bottom: 10rpx;}
   .container /deep/ .uni-numbox__minus{height: 40rpx;border: none;}
   .container /deep/ .uni-numbox__value{width: 104rpx;height: 40rpx;border: none;background-color: #eeeeee;border-radius: 8rpx;line-height: 40rpx;font-size: 24rpx;}
   .container /deep/ .uni-numbox__plus{height: 40rpx;border: none;}
   .container /deep/ .uni-numbox{height: 40rpx;margin-top: 15rpx;}
   checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked{
     width: 32rpx;
     height: 32rpx;
     background: #795C98;
     border: 2rpx solid #795C98;
     border-radius: 50%;
     color: #FFFFFF;
    }
    checkbox /deep/ .wx-checkbox-input {
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
	   height: 100vh;
	   background: #eeeeee;
		 position: relative;
		 .nav-bar{
			 background: #795C98;
			 padding: 0 24rpx;
			 .nav-content{
				 // background: #ccc;
				 position: relative;
				 display: flex;
				 color: #fff;
				 .nav-left{
					 font-size: 30rpx;
				 }
				 .nav-center{
					 position: absolute;
					 left: 50%;
					 transform: translateX(-50%);
					 font-size: 34rpx;
					 font-weight: 500;
				 }
			 }
		 }
		 .scroll-view{
			 position: absolute;
			 left: 0;
			 z-index: 9999;
			 overflow: hidden;
			 .main{
				 border-radius: 32rpx 32rpx 0px 0px;
			   background: #eeeeee;
			   z-index: 1;
				 overflow: hidden;
				 // padding: 0 24rpx 0px 24rpx;
				 .stallList:first-child{
				 	border-radius: 32rpx 32rpx 0px 0px;
					margin-top: 0;
				 }
			   .stallList{
						background: #ffffff;
						// border-radius: 16rpx;
						padding: 32rpx;
						margin:24rpx 0;
						.stallDetail{
							display: flex;
							//background-color: red;
							checkbox{
							  height: 42rpx;
								padding-top: 5rpx;
							}
							.stallDetail-name{
								display: flex;
								// border: 1rpx solid black;
								max-width: 500rpx;
								font-size: 26rpx;
								height: 42rpx;
								line-height: 42rpx;
								padding-left: 12rpx;
								.name{
								 max-width: 450rpx;
								 text-overflow: -o-ellipsis-lastline;
								 overflow: hidden;
								 text-overflow: ellipsis;
								 display: -webkit-box;
								 -webkit-line-clamp: 1;
								 line-clamp: 1;
								 -webkit-box-orient: vertical;
								 }
								.iconGo {
									padding-left: 12rpx;
									width: 34rpx;
									font-size: 34rpx;
									height: 42rpx;
								 }
							}
						}
						.goodsList:not(:last-child){
							border-bottom: 1rpx solid #eee;
							padding-bottom: 36rpx;
						}
						.goodsList{
							.goodsDetail{
								display: flex;
								margin-top: 12rpx;
								.goGoods{
									display: flex;
									padding: 12rpx 0 0rpx 12rpx;
									.goodsDetail-img{
										width: 150rpx;
										height: 150rpx;
										border-radius: 8rpx;
										background: #eeeeee;
										image{
											display: block;
											width: 100%;
											height: 100%;
										}
									}
									.goodsDetail-name{
										// background-color: yellow;
										height: 74rpx;
										line-height: 37rpx;
										max-width: 420rpx;
										padding-left: 16rpx;
										color: rgba(51, 51, 51, 1);
										font-size: 26rpx;
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
								}
								checkbox{
									height: 150rpx;
									display: flex;
									justify-content:center;
								}
							}
							.skuList{
								// border: 1rpx solid red;
								position: relative;
								height: 120rpx;
								margin-top: 24rpx;
								.slot-button {
									width: 64rpx;
									image {
										position: relative;
										width: 42rpx;
										height: 42rpx;
										top:44rpx;
										left: 18rpx;
									 }
								}
							.skuList-box{
									position: relative;
									display: flex;
									width: 100%;
									height: 100%;
									.checkbox-Att {
										// border: 1rpx solid black;
										checkbox {
									   padding-top: 44rpx;
										 padding-right: 12rpx;
										}
									 }
									.skuList-list{
										display: flex;
										justify-content: space-between;
										width: 100%;
										background: #f9f9f9;
										padding: 24rpx 0 24rpx 24rpx;
										border-radius: 8rpx;
										.list-left{
											.skutxt{
												font-size: 24rpx;
												line-height: 32rpx;
												color: rgba(0,0,0,0.4);
												margin-bottom: 8rpx;
											}
											.price{
												font-size: 24rpx;
												line-height: 32rpx;
												color: #795C98;
											}
										}
										.number{
											height: 70rpx;
										}
									}
									
									
									
								}
							}
						}
			 			  }
			   }
		 }
		  // 底部 
	   .bottom{
		   z-index: 9999999;
		   position: fixed;
		   //bottom: 0;
		   bottom: var(--window-bottom);
		   background: #FFFFFF;
		   width: 100%;
		   height: 110rpx;
		   display: flex;
		   .checkAll{
			   width: 160rpx;
			   height: 100%;
			   line-height: 110rpx;
			   padding-left: 32rpx;
		   }
		   .bottomHandle{
			   position: absolute;
			   right: 0;
			   display: flex;
			   .bottomClaer{
				   width: 108rpx;
				   height: 64rpx;
				   font-size: 30rpx;
				   background: #795C98;
				   border-radius: 32rpx;
				   text-align: center;
				   line-height: 64rpx;
				   color: white;
				   margin-top: 23rpx;
			   }
			   .bottomDelete{
				   width: 108rpx;
				   height: 64rpx;
				   line-height: 64rpx;
				   color: #795C98;
				   border: 2rpx solid #795C98;
				   border-radius: 34rpx;
				   font-size: 30rpx;
				   text-align: center;
				   margin-left: 24rpx;
				   margin-top: 22rpx;
				   margin-right: 48rpx;
			   }
			   .bottomPrice{
				  
				   text-align: right;
				   .bottomPrice-one{
						 font-size: 30rpx;
					   padding: 16rpx 24rpx 2rpx 0;
				   }
				   .bottomPrice-two{
						 font-size: 24rpx;
					   padding: 2rpx 24rpx 0rpx 0;
						 color: rgba(0,0,0,0.4);
				   }
			   }
			   .bottomPaly{
				   height: 74rpx;
					 padding: 0 56rpx;
					 margin: 18rpx 32rpx 0 0;
					 line-height: 74rpx;
				   background: #795C98;
				   color: white;
					 border-radius: 36rpx;
				   font-size: 30rpx;
				   text-align: center;
			   }
		   }
		 }
   }
</style>
