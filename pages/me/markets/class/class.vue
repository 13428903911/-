<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar shadow>
			<view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">其他商品编辑</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="category-wrapper" :style="{height:navHeight+'px'}">
			<!-- 左边导航 -->
			<scroll-view scroll-y="true" class="left-wrapper" scroll-with-animation="true" :scroll-top="left_scroll">
				<view class="left-content">
					<view 
						v-for="(title,index) in catrgory" 
						:key="title.id" class="title-content" 
						:class="select_index === title.id ? 'onSelected' : ''" 
					  @tap="choose(title)">
						{{title.name}}
					</view>
				</view>
			</scroll-view>
			<!-- 右边内容 -->
			<scroll-view scroll-y="true" class="right-wrapper" scroll-with-animation="true" :scroll-top="right_scroll" @scroll="myscroll">
					<!-- 产品区 -->
					<view class="right-content">
						<!-- 产品区 -->
						<view class="product-wrapper">
							<view class="category-item">
								<view class="category-content">
									<view class="product-item" v-for="(p_item,p_index) in catrgoryList" :key="p_item.id" @click="navToList(p_item,p_item.name,p_index)">
										<view>{{p_item.name}}</view>
										<uni-icons type="checkmarkempty" size="25" color="#795C98" v-if="flag === p_item.id"></uni-icons>
									</view>
								</view>
							</view>
						</view>
					</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { getSongList,classify } from '@/utils/network/api.js'
	export default {
		data() {
			return {
				pH:'',
				navHeight:'',
				selectAll:{},
				flag: '',
				windows_height: 0, //屏幕高度
				catrgoryList: [],
				catrgory: [],
				select_index: '',
				right_height: [], //右侧每个内容的高度集合
				right_scroll: 0, //右侧的滑动值
				left_height: 0, //左侧总高度
				left_scroll: 0, //左侧滑动值
				last: 0,
				parentId:'',
				parentName:'',
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				 //分页
				 current: 1,
				 pages:1,
				 pageSize:10,
				 fuzzyData:[]
			}
		},
		onLoad(options) {
			const vm = this
			if (options.stairId && options.vfpId) {
				vm.selectAll = {
					selectId: options.stairId,
					vgpId: options.vfpId
				}
			}
			vm.sendInfo(vm.selectAll);
			vm.windows_height = uni.getSystemInfoSync().windowHeight
		},
		mounted() {
			const vm = this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					vm.pH = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
					let titleH = uni.createSelectorQuery().select(".category-wrapper")
					titleH.boundingClientRect(data=>{
					console.log('data',data)
						vm.navHeight = vm.pH - data.top  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
					}).exec()
				}
			})
		},
		methods:{
			// 左侧一级分类接口数据
			sendInfo(item){
				const vm = this
				 getSongList().then(res => {
						vm.catrgory = res.data;
						if (item.selectId && item.vgpId) {
							vm.select_index = item.selectId
							vm.catrgorys(item.selectId)
							vm.flag = item.vgpId
						}else{
							vm.select_index = vm.catrgory[0].id
							vm.catrgorys(vm.catrgory[0].id)
						}	
				 })
			},
			// 右侧二级分类接口数据
			catrgorys(id){
					const params = {
						//传左侧一级分类id
						parentId:id,
						pageSize:this.pageSize,
						pageNum:this.current
					}
					classify(params).then(res => {
						this.catrgoryList = res.data;
						this.pages = res.data.pages
						this.$nextTick(() => {
							this.getHeightList();
						})
					})
			},
			getHeightList() {
				let _this = this;
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery.select('.left-content').boundingClientRect(function(rects) {
					_this.left_height = rects.height;
				});
				selectorQuery.selectAll('.category-item').boundingClientRect(function(rects) {
					_this.right_height = rects.map((item) => item.top);
				}).exec();
			},
			choose(title) {
				this.select_index = title.id;
				this.parentId = title.id
				this.parentName = title.name
				this.catrgorys(title.id)
			}, 
			myscroll(e) {
				//引入节流	
				let right_content_height = e.detail.scrollHeight - this.windows_height;
				if (right_content_height == e.detail.scrollTop) {
					return;
				}
			},
			navToList(item,names,index){
				const vm = this
				
				vm.flag = item.id
				let classObj = {
					stairName: '',
					secondName: item.name,
					stairId: item.parentId,
					secondId: item.id
				}
				vm.catrgory.forEach( classItem => {
					if(classItem.id === item.parentId){
						classObj.stairName = classItem.name
					}
				})
				console.log("对象：",classObj)
				 uni.$emit('update',classObj)
				 uni.navigateBack()
			},
			// 返回上一页
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
		
		.category-wrapper {
			width: 100%;
			display: flex;
			flex-direction: row;
			position: absolute;
			height: 100vh;
			// bottom: 0;
			// top: 0rpx;
			// margin-top: 128rpx;
			// padding-top: constant(safe-area-inset-bottom);  
			// padding-top: env(safe-area-inset-bottom);
			background: #f9f9f9;
			.left-wrapper {
				width: 180rpx;
				flex: 0 0 180rpx;
				background-color: #fff;
				.left-content {
					.title-content {
						width: 100%;
						height: 88rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 26rpx;
						cursor: pointer;
						&:last-child {
							border-bottom: 0;
						}
						&.onSelected {
							background-color: #f9f9f9;
							position: relative;
							color: #795C98;
							font-weight: 500;
							&::before {
								content: '';
								position: absolute;
								left: 0;
								top: 0;
								width: 4rpx;
								height: 100%;
								background: #795C98;
							}
						}
					}
				}
			}
			.right-wrapper {
				flex: 1;
				// margin: 24rpx;
				// height: calc(100vh);
				// background: #fff;
				border-radius: 16rpx;
				.right-content {
					width: 100%;
					padding: 24rpx;
					box-sizing: border-box;
					.banner-wrapper {
						padding: 0 20rpx;
						.swiper-content {
							width: 100%;
							height: 180rpx;
							margin-bottom: 20rpx;
							.swiper-item {
								.swiper-img {
									width: 100%;
									height: 180rpx;
								}
							}
						}
					}
					.product-wrapper {
						.category-item {
							.category-content {
								display: flex;
								flex-direction: row;
								flex-flow: wrap;
								.product-item {
									width: 100%;
									background: #fff;
									height: 96rpx;
									padding:0 24rpx;
									border-radius: 16rpx;
									font-size: 30rpx;
									font-weight: 400;
									margin-bottom: 24rpx;
									display: flex;
									justify-content: space-between;
									align-items: center;
									.product-title {
										font-size: 24rpx;
										color: rgba(51,51,51,0.50);
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
