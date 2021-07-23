<template>
	<view class="contion">
		<navbar :title="title" @goBack="goBack"></navbar>
		<!-- tabs选项卡 -->
		<view class="tabs">
			<ms-tabs class="tabs-mzy" :list="list" v-model="tabActive" itemColor='#795C98' lineColor='#795C98' @input="handleChange" />
		</view>
		<!-- 颜色 -->
		<view class="main" v-if="tabActive == 0" :style="{'paddingBottom': footerHeight+'px'}">
			<view class="sku-color-box">
				<view v-for="(item,index) in colourList" :key="item.id" v-if="item.list.length" class="color-contion">
					<view class="color-title">{{item.name}}</view>
					<view class="color-box">
						<view v-for="(k,i) in item.list" :key="k.code" class="color-text">
							<view class="zize-color" :style="{background: k.detail}" @click="colorClick(k,i)">
								<i v-if="colorCheck.indexOf(k.code)>-1" class="iconfont">&#xe65a;</i>
							</view>
							<view class="text">{{k.name}}</view>
						</view>
					</view>
				</view>
			</view>
	
		</view>
		<!-- 尺码 -->
		<view class="size-main" v-else>
			<view class="size-contion">
				<view class="size-title">{{sizeList.name}}</view>
				<view class="size" >
					<view 
						class="text" 
						v-for="(x,z) in sizeList.list" 
						:key="x.id" 
						:class="{'star':sizeCheck.indexOf(z)>-1}"
						@click="clickSize(x,z)"
					>
						{{x.name}}
					</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<!-- 颜色 -->
			<view>
				<view class="title-box">
					<view class="title">已选颜色<text class="color-num">({{colorCheckData.length}}种)</text></view>
					<view  v-if="colorCheckData.length > 7" @click="packClick">
						<view v-if="!packStatus" class="pack-unfold">
							<text>收起</text>
							<view class="iconfont">&#xe61d;</view>
						</view>
						<view v-else class="pack-unfold">
							<text>展开</text>
							<view class="iconfont" >&#xe615;</view>
						</view>
					</view>
				</view>
				<view class="select-color-father">
					<view class="select-color" v-if="!colorCheckData.length" @click="clickSelectColor">
						点击此处选择颜色
					</view>
					<view class="color-box">
						<view v-for="(k,i) in colorCheckData" :key="k.code" class="color-text" v-if="!packStatus || i < 7">
							<view class="zize-color" :style="{background: k.color}"></view>
							<view class="text">{{k.name}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 尺码 -->
			<view>
				<view class="title-box">
					<view class="title">已选尺码<text class="color-num">({{sizeCheckData.length}}种)</text></view>
					<view  v-if="sizeCheckData.length > 4" @click="sizePackClick">
						<view v-if="!siziPackStatus" class="pack-unfold">
							<text>收起</text>
							<view class="iconfont">&#xe61d;</view>
						</view>
						<view v-else class="pack-unfold">
							<text>展开</text>
							<view class="iconfont" >&#xe615;</view>
						</view>
					</view>
				</view>
				<view class="select-color-father">
					<view class="select-color" v-if="!sizeCheckData.length" @click="clickSelectSize">
						点击此处选择尺码
					</view>
					<view class="size" >
						<view 
							class="text" 
							v-for="(x,z) in sizeCheckData" 
							:key="x.id" 
							v-if="!siziPackStatus || z < 4"
						>
							{{x.name}}
						</view>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="text-btn" :class="{'footer-btn': !sizeCheckData.length}">
				<view class="text">
					颜色、尺码，自动生成SKU规格
				</view>
				<view>
					<botton text="确认" type="primary" size=28  @btnClick="btnClick"></botton>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/nav-bar/nav-bar.vue'
	import { selectListPage } from '@/utils/network/aftermarket.js'
	import botton from '@/components/button/button.vue'
	export default {
		components: { navbar, botton },
		data() {
			return {
				siziPackStatus: false,
				packStatus: false,
				footerHeight: '',
				colorCheckData: [],
				colorCheck: [],
				sizeCheck: [],
				sizeCheckData: [],
				falng: '',
				tabActive: 0,
				title: '添加规格',
				list: [{ title: '颜色', value: 0 }, { title: '尺码', value: 1 }],
				colourList: [], // 属性颜色数据
				sizeList: {} // 属性尺码数据
			}
		},
		onLoad() {
			this.selectSku()
		},
		mounted() {
			this.calculateHeight()
		},
		methods:{
			// 确认
			btnClick() {
				const vm = this
				const skuList = []
				const colorList = JSON.parse(JSON.stringify(vm.colorCheckData))
				const sizeList = JSON.parse(JSON.stringify(vm.sizeCheckData))
				if(!colorList.length) {
					uni.showToast({title: "请选择颜色规格!", icon:'none'})
					return false
				}
				if(!sizeList.length) {
					uni.showToast({title: "请选择尺码规格!", icon:'none'})
					return false
				}
				colorList.forEach(t => {
					sizeList.forEach(j => {
						const { name, id } = j
						const sku = {
							colorName: t.name,
							colorId: t.id,
							color: t.color,
							sizeName: j.name,
							sizeId: j.id,
							imgUrl: '',
							qty: '',
							tradePrice: '',
							isShelves: 1
						}
						skuList.push(sku)
					})
				})
				// const arr = sizeList.map(x => ({name: x.name,sizeId: x.id}))
				// let skuData = []
				// colorList.forEach(item => {
				// 	item.imgUrl = ''
				// 	item.list = arr 
				// })
				uni.$emit('skuList', skuList)
				uni.navigateBack()
			},
			// 尺码收起
			sizePackClick() {
				this.siziPackStatus = !this.siziPackStatus
			},
			// 收起
			packClick() {
				this.packStatus = !this.packStatus
			},
			// 点击此处选择颜色
			clickSelectColor() {
				this.tabActive = 0
			},
			// 点击选择尺码
			clickSelectSize() {
				this.tabActive = 1
			},
			// 点击尺码
			clickSize(item,index) {
				const vm = this
				const arrIndex = vm.sizeCheck.indexOf(index)
				 if(arrIndex > -1){
					vm.sizeCheck.splice(arrIndex,1);//取消高亮
					vm.sizeCheckData.splice(arrIndex,1)
					vm.calculateHeight(0)
				}else{
					 vm.sizeCheck.push(index)
					 const arr = JSON.parse(JSON.stringify(item))
					 const obj = {
					 	id: arr.id,
					 	name: arr.name,
					 	code: arr.code
					 }
					 vm.sizeCheckData.push(obj) // 尺码添加
					 vm.calculateHeight(1)
				}
			},
			// 点击颜色
			colorClick(item,index) {
				const vm = this
				// this.colorCheck.push(val)
				const arrIndex = vm.colorCheck.indexOf(item.code)
				 if(arrIndex > -1){
					vm.colorCheck.splice(arrIndex,1);//取消高亮
					vm.colorCheckData.splice(arrIndex,1)
					setTimeout(function(){
						vm.calculateHeight(0)
					},100)
					
					
				}else{
					const arr = JSON.parse(JSON.stringify(item))
					const obj = {
						id: arr.id,
						color: arr.detail,
						name: arr.name,
						code: arr.code
					}
					 vm.colorCheck.push(item.code);
					 vm.colorCheckData.push(obj) // 颜色添加
					 setTimeout(function(){
						 vm.calculateHeight(1)
					 },100)
				}
			},
			// 计算高度
			calculateHeight(num) {
				const vm = this
				uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
					success(res) { 
						let titleH = uni.createSelectorQuery().select(".footer")
						titleH.boundingClientRect(data=>{
							vm.footerHeight = data.height+12
						}).exec()
					}
				})
			},
			// 选项卡事件
			handleChange(e) {
				this.tabActive = e
			},
			// 返回上一页
			goBack() {
				uni.navigateBack({})
			},
			// 获取规格
			selectSku(){
				const vm = this
				selectListPage().then(res => {
					console.log(123134645)
					const {records = []} = res.data
					 records.forEach(item => {
						if(item.type == 1) {
							vm.sizeList = item
						}
						if (item.type == 3) {
							vm.colourList =item.list
						}
					})
				})
				// 计算高度
				vm.calculateHeight()
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
	.contion{
		height: 100vh;
		
		.tabs {
			width: 100%;
			position: fixed;
			z-index: 999;
			font-size: 30rpx;
			color: #333333;
			background: #FFFFFF;
			box-shadow: 0 5px 10px -8px #ccc inset;
			/deep/ .tab {
				height: 84rpx !important;
			}
			/deep/ .tab__item {
				line-height: 84rpx !important;
			}
			/deep/ .mm__tab:nth-child(5) {
				margin: 0rpx 24rpx 0rpx 24rpx !important;
			}
			/deep/ .tab__line{
				width: 80rpx !important;
			}
		}
		.main{
			margin: 108rpx 24rpx 0rpx 24rpx;
			// padding: 24rpx;
			padding-bottom:598rpx;
			// border-radius: 16rpx;
			// background: #FFFFFF;
			.sku-color-box{
				padding: 24rpx 24rpx 24rpx 24rpx;
				background-color: #FFFFFF;
				border-radius: 16rpx;
				.color-title{
					font-size: 30rpx;
					margin-bottom: 24rpx;
					border-radius: 16rpx;
				}
				.color-box{
					display: flex;
					flex-wrap: wrap;
					.color-text{
						width: 88rpx;
						height: 94rpx;
						margin: 0 55rpx 48rpx 0;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.zize-color{
							width: 58rpx;
							height: 58rpx;
							border-radius: 50%;
							position: relative;
							.iconfont{
								position: absolute;
								top: 0;
								right: 0;
								bottom: 0;
								left: 0;
								text-align: center;
								line-height: 60rpx;
								color: #FFFFFF;
								font-size: 28rpx;
							}
						}
						.text{
							margin-top: 6rpx;
							text-align: center;
							font-size: 22rpx;
							color: rgba(0,0,0,0.40);
						}
					}
					
				}
			}
		}
		.color-text:nth-child(5n) {
			margin-right: 0 !important;
		}
		// 尺码样式
		.size-main{
			margin: 108rpx 24rpx 24rpx 24rpx;
			.size-contion{
				background-color: #FFFFFF;
				padding: 24rpx;
				margin-bottom: 24rpx;
				border-radius: 16rpx;
				.size-title{
					font-size: 30rpx;
					margin-bottom: 24rpx;
				}
				.size{
					display: flex;
					flex-wrap: wrap;
					.text{
						margin: 0 20rpx 24rpx 0;
						width: 144rpx;
						height: 56rpx;
						border: 1rpx solid rgba(51,51,51,0.50);
						border-radius: 32rpx;
						line-height: 56rpx;
						text-align: center;
						font-size: 28rpx;
					}
					.star{
						background: #f5f2f7;
						border: 2rpx solid #795c98 !important;
						color: #795c98 !important;
					}
				}
			}
			.size > .text:nth-child(4n) {
				margin-right: 0;
			}
		}
	}
	.footer{
		width: 93.5%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #FFFFFF;
		box-shadow: 0px -2rpx 8rpx 0px rgba(0,0,0,0.10); 
		padding: 24rpx;
		.title-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;
			.title{
				font-size: 30rpx;
				.color-num{
					margin-left: 24rpx;
				}
			}
			.pack-unfold{
				color: #2582ff;
				display: flex;
				align-items: center;
			}
		}
		.select-color-father{
			display: flex;
			.select-color{
				// display: inline;
				padding: 11rpx 24rpx;
				border: 1rpx solid rgba(51,51,51,0.50);
				border-radius: 33rpx;
				margin: auto;
				margin-top:16rpx;
				margin-bottom: 32rpx;
				color: rgba(0,0,0,0.4);
				text-shadow: 0px -2rpx 8rpx 0px rgba(0,0,0,0.10); 
				font-size: 28rpx;
			}
			// 颜色
			.color-box{
				display: flex;
				flex-wrap: wrap;
				.color-text{
					width: 88rpx;
					height: 94rpx;
					margin: 0rpx 16rpx 32rpx 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.zize-color{
						width: 58rpx;
						height: 58rpx;
						border-radius: 50%;
					}
					.text{
						margin-top: 6rpx;
						text-align: center;
						font-size: 22rpx;
						color: rgba(0,0,0,0.40);
					}
				}
				.color-text:nth-child(7n) {
					margin-right: 0 !important;
				}
			}
			// 尺码
			.size{
				display: flex;
				flex-wrap: wrap;
				.text{
					margin: 0rpx 35rpx 24rpx 0;
					width: 144rpx;
					height: 56rpx;
					border: 1rpx solid rgba(51,51,51,0.50);
					border-radius: 32rpx;
					line-height: 56rpx;
					text-align: center;
					font-size: 28rpx;
				}
				.text:nth-child(4n) {
					margin-right: 0;
				}
			}
		}
		.text-btn{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin-bottom: env(safe-area-inset-bottom);
			.text{
				margin-right: 24rpx;
				color: rgba(0,0,0,0.24);
				font-size: 24rpx;
				text-shadow: 0px -2px 8px 0px rgba(0,0,0,0.10); 
			}
		}
		.footer-btn{
			margin-top: 64rpx !important;
		}
	}
</style>
